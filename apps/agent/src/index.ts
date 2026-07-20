#!/usr/bin/env node

import * as pty from 'node-pty';
import WebSocket from 'ws';
import { AgentMessage, ServerToAgentMessage } from '@sheltr/shared';
import { platform } from 'node:os';

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

const SERVER_URL = 'wss://sheltr_wss.onrender.com';
// const SERVER_URL = 'ws://localhost:3001';


let currentWs: WebSocket | null = null;

export const connectServer = (attempts: number) => {
    if (attempts >= 5) {
        console.log('Could not connect after 5 attempts. Exiting.');
        process.exit(1);
    }

    const apiKey = process.env.SHELTR_API_KEY;

    // Connect to relay server
    const ws = new WebSocket(`${SERVER_URL}?role=agent&apiKey=${apiKey}`);

    ws.on('open', () => {
        currentWs = ws;
        console.log('Connected to server');

        ws.on('message', async (raw) => {
            const message = JSON.parse(raw.toString()) as ServerToAgentMessage;

            if (message.type === 'urls') {
                const { controllerUrl, viewerUrl } = message.data

                console.log('\n✓ Session ready\n')
                console.log(`  Controller → ${controllerUrl}`)
                console.log(`  Viewer     → ${viewerUrl}\n`)

                const { exec } = await import('node:child_process')

                const cmd = platform() === 'darwin' ?
                        `open "${controllerUrl}"`:
                        platform() === 'win32' ?
                        `start "${controllerUrl}"` :
                        `xdg-open "${controllerUrl}"`
                        
                exec(cmd)
            }
            else if (message.type === 'input') {
                ptyProcess.write(message.data);
            }
            else if (message.type === 'resize') {
                ptyProcess.resize(message.cols, message.rows);
            }
        })
    })
    
    ws.on('close', () => {
        const delay = Math.pow(2, attempts)*1000;
        console.log(`Reconnecting in ${delay/1000}s...`);
        setTimeout(() => connectServer(attempts+1),delay);
    })
    
    ws.on('error', (err) => {
        console.log('Websocker err:', err.message);
    })
    
    return ws;
}

connectServer(0);

// PTY-output to Server
ptyProcess.onData((data) => {
    const message: AgentMessage = { type: 'output', data };
    currentWs?.send(JSON.stringify(message));
})

ptyProcess.onExit(() => {
    const message: AgentMessage = { type: 'exit' };
    if(currentWs?.readyState === WebSocket.OPEN) {
        currentWs.send(JSON.stringify(message))
    }
    currentWs?.close();
})

process.on('SIGINT', () => {
    const message: AgentMessage = { type: 'exit' }
    if(currentWs?.readyState === WebSocket.OPEN) {
        currentWs.send(JSON.stringify(message))
    }
    currentWs?.close()
    ptyProcess.kill()
    process.exit(0)
});