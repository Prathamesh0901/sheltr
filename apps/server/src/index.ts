import 'dotenv/config'
import express from 'express'
import http from 'http'
import { WebSocketServer, WebSocket } from "ws";
import sessionManager from './sessionManager.js';
import { AgentMessage, BrowserMessage, Role, ServerToAgentMessage, ServerToBrowserMessage } from "@sheltr/shared";
import { UUID } from "node:crypto";
import { prisma } from '@sheltr/db';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

const wss = new WebSocketServer({ port: PORT });

wss.on('connection', async (ws, req) => {
    const role = new URL(req.url!, 'http://localhost').searchParams.get('role');

    if (role === 'agent') {

        const apiKey = new URL(req.url!, 'http://localhost').searchParams.get('apiKey');

        if(!apiKey) {
            ws.close(4001, 'API key required');
            return;
        }

        const keyRecord = await prisma.apiKey.findUnique({
            where: {
                key: apiKey
            },
            include: {
                user: true
            }
        })
  
        if(!keyRecord) {
            ws.close(4001, 'Invalid API key')
            return
        }

        await prisma.apiKey.update({
            where: { 
                key: apiKey
            },
            data: {
                lastUsed: new Date()
            }
        })

        const dbSession = await prisma.sheltrSession.create({
            data: {
                userId: keyRecord.user.id
            }
        })

        const sessionId = dbSession.id;
        sessionManager.createSession(ws, sessionId);

        const controllerUrl = `${process.env.SHELTR_WEB_URL ?? 'http://localhost:3000'}/s/${sessionId}?role=controller`;
        const viewerUrl = `${process.env.SHELTR_WEB_URL ?? 'http://localhost:3000'}/s/${sessionId}?role=viewer`;

        const message: ServerToAgentMessage = { type: 'urls', data: { controllerUrl, viewerUrl } };

        ws.send(JSON.stringify(message));

        ws.on('message', (data) => {
            const agentMessage = JSON.parse(data.toString()) as AgentMessage;
            const session = sessionManager.getSession(sessionId);
            if (agentMessage.type === 'output') {
                const browserMessage: ServerToBrowserMessage = { type: 'output', data: agentMessage.data }
                const serialised = JSON.stringify(browserMessage)
                session?.browserSockets.forEach((browserRole, browserWs) => {
                    if (browserWs.readyState === WebSocket.OPEN) {
                        browserWs.send(serialised)
                    }
                });
            }
            sessionManager.appendScrollback(sessionId, agentMessage);
            if (agentMessage.type === 'output') {
                sessionManager.appendRecording(sessionId, agentMessage.data);
            }
        });

        ws.on('close', async () => {
            const session = sessionManager.getSession(sessionId);
            if(!session) return;

            const duration = Date.now() - session.startTime;

            const res = await prisma.recording.create({
                data: {
                    sheltrSessionId: dbSession.id,
                    duration,
                    events: session.recording,
                    viewerCount: session.maxViewers
                }
            });

            await prisma.sheltrSession.update({
                where: {
                    id: sessionId
                },
                data: {
                    endedAt: new Date()
                }
            })

            session.browserSockets.forEach(((browserData, browserWs) => {
                const replayUrl = `${process.env.SHELTR_WEB_URL}/r/${res.id}`;
                browserWs.send(JSON.stringify({ type: 'disconnected', replayUrl }));
                browserWs.close()
            }));

            sessionManager.destroySession(sessionId);
        });
    }

    if(role === 'controller') {
        const sessionId = new URL(req.url!, 'http://localhost').searchParams.get('sessionId')
        if(!sessionId) {
            ws.send(JSON.stringify({ type: 'error', message: 'Session ID required' }))
            ws.close()
            return
        }

        const session = sessionManager.getSession(sessionId)
        if(!session) {
            ws.send(JSON.stringify({ type: 'error', message: 'Session not found' }))
            ws.close()
            return
        }

        const authTimeout = setTimeout(() => {
            ws.close(4001, 'Auth timeout')
        }, 5000)

        ws.once('message', async (data) => {
            const message = JSON.parse(data.toString()) as BrowserMessage

            if (message.type !== 'auth') {
                clearTimeout(authTimeout)
                ws.close(4001, 'Expected auth message')
                return
            }

            const authSession = await prisma.session.findUnique({
                where: { token: message.token }
            })

            if (!authSession || authSession.expiresAt < new Date()) {
                clearTimeout(authTimeout)
                ws.close(4001, 'Invalid or expired session')
                return
            }

            clearTimeout(authTimeout)

            const browserId = crypto.randomUUID()
            sessionManager.addBrowser(sessionId, role, ws, browserId)

            ws.send(JSON.stringify({ type: 'role', role }))

            if(session.buffer) {
                ws.send(JSON.stringify({ type: 'buffer', data: session.buffer }))
            }

            const participants: { role: Role, id: string }[] = []
            session.browserSockets.forEach((browserData) => participants.push(browserData))
            const participantsMsg: ServerToBrowserMessage = { type: 'participants', data: participants }
            session.browserSockets.forEach((_, browserWs) => browserWs.send(JSON.stringify(participantsMsg)))

            ws.on('message', (data) => {
                const session = sessionManager.getSession(sessionId)
                if (!session) return

                const browserMessage = JSON.parse(data.toString()) as BrowserMessage

                if(session.agentSocket?.readyState === WebSocket.OPEN) {
                    if(browserMessage.type === 'input') {
                        session.agentSocket.send(JSON.stringify({ type: 'input', data: browserMessage.data }))
                    } 
                    else if(browserMessage.type === 'resize') {
                        session.agentSocket.send(JSON.stringify({ type: 'resize', rows: browserMessage.rows, cols: browserMessage.cols }))
                    }
                }
            })

            ws.on('close', () => {
                sessionManager.removeBrowser(sessionId, ws)
                const participants: { role: Role, id: string }[] = []
                session?.browserSockets.forEach((browserData) => participants.push(browserData))
                session?.browserSockets.forEach((_, browserWs) => {
                    browserWs.send(JSON.stringify({ type: 'participants', data: participants }))
                })
            })
        })
    }

    if(role === 'viewer') {
        const sessionId = new URL(req.url!, 'http://localhost').searchParams.get('sessionId') as UUID;
        if (!sessionId) {
            const msg: ServerToBrowserMessage = { type: 'error', message: 'Session Id is required' }
            ws.send(JSON.stringify(msg))
            ws.close()
            return;
        }
        
        const browserId = crypto.randomUUID();
        sessionManager.addBrowser(sessionId, role, ws, browserId);

        const message: ServerToBrowserMessage = { type: 'role', role };
        ws.send(JSON.stringify(message));

        const session = sessionManager.getSession(sessionId);

        if(!session) {
            const msg: ServerToBrowserMessage = { type: 'error', message: 'Session not found' }
            ws.send(JSON.stringify(msg))
            ws.close()
            return;
        }

        if (session.buffer) {
            const message: ServerToBrowserMessage = { type: 'buffer', data: session.buffer };
            ws.send(JSON.stringify(message));
        }

        const participants: { role: Role, id: UUID }[] = [];

        session.browserSockets.forEach((browserData, browserWs) => {
            participants.push(browserData);
        });

        const participantsData: ServerToBrowserMessage = { type: 'participants', data: participants };
        session.browserSockets.forEach((browserData, browserWs) => {
            browserWs.send(JSON.stringify(participantsData));
        });

        ws.on('message', (data) => {
            const session = sessionManager.getSession(sessionId);
            if (!session) return;

            const role = session.browserSockets.get(ws)?.role;

            if(!role || role === 'viewer') return;

            const browserMessage = JSON.parse(data.toString()) as BrowserMessage;

            if (session.agentSocket?.readyState === WebSocket.OPEN) {
                if (browserMessage.type === 'input') {
                    const agentMessage: ServerToAgentMessage = { type: 'input', data: browserMessage.data }
                    session.agentSocket.send(JSON.stringify(agentMessage))
                } else if (browserMessage.type === 'resize') {
                    const agentMessage: ServerToAgentMessage = { type: 'resize', rows: browserMessage.rows, cols: browserMessage.cols }
                    session.agentSocket.send(JSON.stringify(agentMessage))
                }
            }
        });

        ws.on('close', () => {
            sessionManager.removeBrowser(sessionId, ws);
            const participants: { role: Role, id: UUID }[] = [];

            session?.browserSockets.forEach((browserData, browserWs) => {
                participants.push(browserData);
            });

            const participantsData: ServerToBrowserMessage = { type: 'participants', data: participants };
            session?.browserSockets.forEach((browserData, browserWs) => {
                browserWs.send(JSON.stringify(participantsData));
            });
        })
    }
})