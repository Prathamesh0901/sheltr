'use client'

import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const ReplayTerminalComponent = forwardRef((props, ref) => {
    const termRef = useRef<Terminal | null>(null)
    const terminalDivRef = useRef<HTMLDivElement | null>(null)

    useImperativeHandle(ref, () => ({
        write: (data: string) => {
            termRef.current?.write(data)
        },
        clear: () => termRef.current?.clear()
    }))

    useEffect(() => {
        if (termRef.current) return

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
        term.open(terminalDivRef.current!)
        fitAddon.fit()

        return () => {
            term.dispose()
            termRef.current = null
        }
    }, [])

    return (
        <div
            ref={terminalDivRef}
            className="w-full h-full"
        />
    )
})

export default ReplayTerminalComponent;