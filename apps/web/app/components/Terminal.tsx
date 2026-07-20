'use client'

import { authClient, useSession } from "@/lib/auth-client";
import { useParticipantStore } from "@/store/participant";
import { useToastStore } from "@/store/toast";
import { BrowserMessage, Role, ServerToBrowserMessage } from "@sheltr/shared";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function TerminalComponent({ sessionId, role }: { sessionId: string, role: Role }) {
    const router = useRouter();

    const terminalRef = useRef<HTMLDivElement>(null)
    const wsRef = useRef<WebSocket | null>(null)
    const termRef = useRef<Terminal | null>(null)
    const disconnectedRef = useRef<boolean>(false)
    const errorRef = useRef<boolean>(false)

    const { showToast } = useToastStore()
    
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

        if(role === 'viewer') {
            term.options.disableStdin = true;
        }

        const WS_URL = process.env.NEXT_PUBLIC_SHELTR_WS_URL ?? 'ws://localhost:3001';
        const ws = new WebSocket(`${WS_URL}?role=${role}&sessionId=${sessionId}`);

        console.log(ws);

        wsRef.current = ws
        ws.binaryType = 'arraybuffer'

        ws.onopen = async () => {
            console.log('Connected');
            if(role === 'controller') {
                const session = await authClient.getSession();
                const token = session.data?.session.token ?? ''
                const msg: BrowserMessage = { type: 'auth', token }
                ws.send(JSON.stringify(msg))
            }
        }

        ws.onmessage = (event) => {
            const raw = event.data instanceof ArrayBuffer
                ? new TextDecoder().decode(event.data)
                : event.data
            const message = JSON.parse(raw) as ServerToBrowserMessage
            if (message.type === 'output') {
                term.write(message.data)
            }
            else if(message.type === 'buffer') {
                term.write(message.data);
            }
            else if(message.type === 'disconnected') {
                disconnectedRef.current = true;
                router.push(message.replayUrl);
            }
            else if(message.type === 'participants') {
                useParticipantStore.getState().updateStore(message.data);
            }
            else if(message.type === 'error') {
                router.push(`/session-error?${encodeURIComponent(message.message)}`)
            }
        }

        ws.onclose = (event) => {
            if(event.code === 4001) {
                router.push('/auth/signin')
                showToast('error', 'User not authenticated')
                return
            }
            if(disconnectedRef.current || errorRef.current) return
            term.write('\r\nConnection lost. Session may have ended.\r\n')
            useParticipantStore.getState().emptyStore()
        }

        ws.onerror = () => {
            errorRef.current = true
            term.write('\r\nConnection error. Please try again.\r\n')
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