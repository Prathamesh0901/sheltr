import { WebSocketServer, WebSocket } from "ws";
import sessionManager from './sessionManager.js';
import { AgentMessage, BrowserMessage, ServerToAgentMessage, ServerToBrowserMessage } from "@sheltr/shared";
import { UUID } from "node:crypto";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

const wss = new WebSocketServer({ port: PORT });

console.log(`Server running on port: ${PORT}`);

wss.on('connection', (ws, req) => {
    const role = new URL(req.url!, 'http://localhost').searchParams.get('role');

    if (role === 'agent') {
        const sessionId = sessionManager.createSession(ws);

        console.log('New session created');

        const controllerUrl = `http://localhost:3000/s/${sessionId}?role=controller`;
        const viewerUrl = `http://localhost:3000/s/${sessionId}?role=viewer`;

        const message: ServerToAgentMessage = { type: 'urls', data: { controllerUrl, viewerUrl } };

        ws.send(JSON.stringify(message));

        ws.on('message', (data) => {
            const agentMessage = JSON.parse(data.toString()) as AgentMessage;
            const session = sessionManager.getSession(sessionId);
            if (agentMessage.type === 'output') {
                const browserMessage: ServerToBrowserMessage = { type: 'output', data: agentMessage.data }
                const serialised = JSON.stringify(browserMessage)
                session?.browserSockets.forEach(browser => {
                    if (browser.readyState === WebSocket.OPEN) {
                        browser.send(serialised)
                    }
                })
            }
            sessionManager.appendScrollback(sessionId, agentMessage);
        });

        ws.on('close', () => {
            console.log('Agent disconnected');
            const session = sessionManager.getSession(sessionId);
            session?.browserSockets.forEach(browser => browser.close());
            sessionManager.destroySession(sessionId);
        });
    }

    if (role === 'browser') {
        const sessionId = new URL(req.url!, 'http://localhost').searchParams.get('sessionId') as UUID;
        if (!sessionId) return;

        sessionManager.addBrowser(sessionId, ws);

        console.log('Browser added to session:', sessionId);

        const session = sessionManager.getSession(sessionId);
        if (session?.buffer) {
            const message: ServerToBrowserMessage = { type: 'buffer', data: session.buffer };
            ws.send(JSON.stringify(message));
        }

        console.log('Browser connected to session', sessionId);

        ws.on('message', (data) => {
            const session = sessionManager.getSession(sessionId);
            if (!session) return;

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
            console.log('Browser disconnected');
            sessionManager.removeBrowser(sessionId, ws);
        })
    }
})