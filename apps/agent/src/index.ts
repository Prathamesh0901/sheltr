import * as pty from 'node-pty';
import WebSocket from 'ws';
import { AgentMessage, BrowserMessage, ServerToAgentMessage } from '@sheltr/shared';

const SERVER_URL = process.env.SHELTR_SERVER_URL ?? 'ws://localhost:3001';
const shell = process.env.SHELL ?? 'bash';

// Spawn the local shell
const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    rows: 24,
    cols: 80,
    cwd: process.env.HOME,
    env: process.env as Record<string, string>
});

console.log(`Spawned ${shell} shell`);
console.log(`Connecting to server at ${SERVER_URL}`);

// Connect to relay server
const ws = new WebSocket(`${SERVER_URL}?role=agent`);

ws.on('open', () => {
    console.log('Connected to server');

    // PTY-output to Server
    ptyProcess.onData((data) => {
        const message: AgentMessage = { type: 'output', data};
        ws.send(JSON.stringify(message));
    })

    ws.on('message', (raw) => {
        const message = JSON.parse(raw.toString()) as ServerToAgentMessage;

        if(message.type === 'urls') {
            console.log(message.data);
        }
        else if(message.type === 'input') {
            ptyProcess.write(message.data);
        }
        else if(message.type === 'resize') {
            ptyProcess.resize(message.cols, message.rows);
        }
    })
})

ws.on('close', () => {
    console.log('Disconnected from server')
    ptyProcess.kill();
    process.exit(0);
})

ws.on('error', (err) => {
    console.log('Websocker err:', err.message);
    process.exit(1);
})

ptyProcess.onExit(() => {
    const message: AgentMessage = { type: 'exit' };
    ws.send(JSON.stringify(message));
    ws.close();
})