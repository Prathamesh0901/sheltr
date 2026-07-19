import Navbar from "@/app/components/Navbar"
import ReplayPlayer from "@/app/components/ReplayPlayer"
import Link from "next/link"
import { UUID } from "node:crypto"
import { prisma } from "@sheltr/db"
import { RecordingEvent } from "@sheltr/shared"

type Props = {
    params: Promise<{ replayId: string }>
}

export default async function Home({ params }: Props) {
    const { replayId } = await params;

    const replay = await prisma.recording.findUnique({
        where: {
            id: replayId
        },
        include: {
            sheltrSession: true
        }
    })
    
    if (!replay) {
        return (
            <main className="min-h-screen bg-[#0c0c0e] text-[#e8e8ec] font-sans antialiased flex flex-col">
                <Navbar type="normal" />
                <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-6">
                    <span className="font-mono text-xs text-[#3dd68c] uppercase tracking-widest">replay</span>
                    <h1 className="text-5xl font-light tracking-tight">
                        Replay not <span className="italic font-serif text-[#a89cf8]">found.</span>
                    </h1>
                    <p className="text-[#6b6b78] max-w-sm">
                        This replay doesn't exist or may have been deleted.
                    </p>
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

    const events = replay.events as RecordingEvent[]
    const sessionId: UUID = replay.sheltrSessionId as UUID;
    const duration = replay.duration ?? 0;

    return (
        <>
            <main className="min-w-screen h-screen flex flex-col bg-[#0c0c0e] text-[#e8e8ec] font-sans antialiased overflow-hidden">
                <Navbar sessionId={sessionId} replayId={replayId} type='replay' duration={duration} />
                <ReplayPlayer events={events} duration={duration} />
            </main>
        </>
    )
}