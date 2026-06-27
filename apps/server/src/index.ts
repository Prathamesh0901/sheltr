import 'dotenv/config'
import express from 'express'
import http from 'http'
import { WebSocketServer, WebSocket } from "ws";
import sessionManager from './sessionManager.js';
import { AgentMessage, BrowserMessage, Role, ServerToAgentMessage, ServerToBrowserMessage } from "@sheltr/shared";
import { UUID } from "node:crypto";
import { prisma } from '@sheltr/db';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

const app = express();

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
    const role = new URL(req.url!, 'http://localhost').searchParams.get('role');

    if (role === 'agent') {
        const sessionId = sessionManager.createSession(ws);

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
                    sessionId,
                    duration,
                    events: session.recording,
                }
            });

            session.browserSockets.forEach(((browserData, browserWs) => {
                const replayUrl = `${process.env.SHELTR_WEB_URL}/r/${res.id}`;
                browserWs.send(JSON.stringify({ type: 'disconnected', replayUrl }));
                browserWs.close()
            }));

            sessionManager.destroySession(sessionId);
        });
    }

    if (role === 'controller' || role === 'viewer') {
        const sessionId = new URL(req.url!, 'http://localhost').searchParams.get('sessionId') as UUID;
        if (!sessionId) return;

        const browserId = crypto.randomUUID();
        sessionManager.addBrowser(sessionId, role, ws, browserId);

        const message: ServerToBrowserMessage = { type: 'role', role };
        ws.send(JSON.stringify(message));

        const session = sessionManager.getSession(sessionId);
        if (session?.buffer) {
            const message: ServerToBrowserMessage = { type: 'buffer', data: session.buffer };
            ws.send(JSON.stringify(message));
        }

        const participants: { role: Role, id: UUID }[] = [];

        session?.browserSockets.forEach((browserData, browserWs) => {
            participants.push(browserData);
        });

        const participantsData: ServerToBrowserMessage = { type: 'participants', data: participants };
        session?.browserSockets.forEach((browserData, browserWs) => {
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

app.get('/replay/:replayId', async (req, res) => {
    try {
        const replayId = req.params.replayId;
        if(!replayId) {
            return res.status(400).json({
                message: 'Session id is required'
            })
        }

        const replay = await prisma.recording.findUnique({
            where: {
                id: replayId
            }
        })

        if(!replay) {
            return res.status(400).json({
                message: 'Session not found'
            })
        }

        res.status(200).json({
            message: 'Session found',
            replay
        })

    } catch (e) {
        console.log('Error fetching replay:', e);
        res.status(400).json({
            message: 'Error fetching the replay'
        });
    }
})

server.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
})