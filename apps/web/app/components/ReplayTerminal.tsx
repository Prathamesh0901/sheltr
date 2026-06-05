'use client'

import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import { useEffect, useRef } from "react";

type EventType = {
    t: number,
    data: string
}

export default function ReplayTerminalComponent({ events }: {
    events: EventType[]
}) {
    const terminalRef = useRef<HTMLDivElement>(null)
    const termRef = useRef<Terminal | null>(null)

    
    useEffect(() => {
        if (termRef.current) return
        
        let timeouts: NodeJS.Timeout[] = [];

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

        events.forEach(event => {
            const timeout = setTimeout(() => {
                term.write(event.data);
            }, event.t);

            timeouts.push(timeout);
        })

        return () => {
            timeouts.forEach(timeout => {
                clearTimeout(timeout);
            })
            term.dispose()
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