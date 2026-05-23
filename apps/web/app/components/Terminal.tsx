'use client'

import { AgentMessage, BrowserMessage, ServerMessage } from "@sheltr/shared";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import { useEffect, useRef } from "react";

export default function TerminalComponent() {
    const terminalRef = useRef<HTMLDivElement>(null)
    const wsRef = useRef<WebSocket | null>(null)
    const termRef = useRef<Terminal | null>(null)

    useEffect(() => {
        if (wsRef.current || termRef.current) return

        const term = new Terminal({
            cursorBlink: true,
            fontSize: 14,
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            theme: {
                background: '#0a0a0a',
                foreground: '#e0e0e0',
            }
        })
        termRef.current = term

        const fitAddon = new FitAddon()
        term.loadAddon(fitAddon)
        term.open(terminalRef.current!)
        fitAddon.fit()

        const ws = new WebSocket('ws://localhost:3001?role=browser')
        wsRef.current = ws
        ws.binaryType = 'arraybuffer'

        ws.onmessage = (event) => {
            const raw = event.data instanceof ArrayBuffer
                ? new TextDecoder().decode(event.data)
                : event.data
            const message = JSON.parse(raw) as ServerMessage
            if (message.type === 'output') {
                term.write(message.data)
            }
        }

        term.onData((data) => {
            if (ws.readyState === WebSocket.OPEN) {
                const message: BrowserMessage = { type: 'input', data }
                ws.send(JSON.stringify(message))
            }
        })

        return () => {
            ws.close()
            term.dispose()
            wsRef.current = null
            termRef.current = null
        }
    }, [])

    return (
        <div
            ref={terminalRef}
            className="w-full h-full"
        />
    )

}