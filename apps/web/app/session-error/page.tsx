'use client'

import { useSearchParams } from 'next/navigation'
import Navbar from '../components/Navbar'
import Link from 'next/link'

export default function SessionError() {
    const searchParams = useSearchParams()
    const message = searchParams.get('message') ?? 'Session not found or has ended'

    return (
        <main className="min-h-screen bg-[#0c0c0e] text-[#e8e8ec] font-sans antialiased flex flex-col">
            <Navbar type="normal" />
            <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-6">
                <span className="font-mono text-xs text-[#f59e0b] uppercase tracking-widest">session</span>
                <h1 className="text-5xl font-light tracking-tight">
                    Session not <span className="italic font-serif text-[#a89cf8]">found.</span>
                </h1>
                <p className="text-[#6b6b78] max-w-sm">{message}</p>
                <Link
                    href="/dashboard"
                    className="mt-2 px-6 py-2.5 bg-[#7c6af7] text-white rounded-lg text-sm font-medium hover:bg-[#6a59e0] transition-colors"
                >
                    back to dashboard
                </Link>
            </div>
        </main>
    )
}