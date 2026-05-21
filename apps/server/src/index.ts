import { WebSocketServer, WebSocket } from "ws";

const PORT = process.env.PORT ? parseInt(process.env.PORT): 3001;

const wss = new WebSocketServer({ port: PORT });

let agent: WebSocket | null = null;
let browser: WebSocket | null = null;

console.log(`Server running on port: ${PORT}`);

wss.on('connection', (ws, req) => {
    const role = new URL(req.url!, 'http://localhost').searchParams.get('role');

    if (role === 'agent') {
        agent = ws;
        console.log('Agent connected');

        ws.on('message', (data) => {
            if (browser?.readyState === WebSocket.OPEN) {
                browser.send(data);
            }
        });

        ws.on('close', () => {
            console.log('Agent disconnected');
            agent = null;
            browser?.close();
        });
    }

    if (role === 'browser') {
        browser = ws;
        console.log('Browser connected');

        ws.on('message', (data) => {
            if (agent?.readyState === WebSocket.OPEN) {
                agent.send(data);
            }
        });

        ws.on('close', () => {
            console.log('Browser disconnected');
            browser = null;
        })
    }
})