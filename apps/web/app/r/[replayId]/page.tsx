import Controlbar from "@/app/components/Controlbar"
import Navbar from "@/app/components/Navbar"
import ReplayPlayer from "@/app/components/ReplayPlayer"
import ReplayTerminalComponent from "@/app/components/ReplayTerminal"
import { UUID } from "node:crypto"

type Props = {
    params: Promise<{ replayId: string}>
}

const getReplay = async (replayId: string) => {
    const SERVER_URL = process.env.NEXT_PUBLIC_SHELTR_SERVER_URL ?? 'http://localhost:3001'
    const res = await fetch(`${SERVER_URL}/replay/${replayId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if(res.status != 200) {
        return null;
    }

    const data = await res.json();
    return data.replay;
}

export default async function Home({ params }: Props) {
    const { replayId } = await params;

    if (!replayId) {
        return (
            <div>
                Replay Id is required
            </div>
        )
    }
    
    const replay = await getReplay(replayId);

    if(!replay) {
        return (
            <div>
                Invalid replay Id
            </div>
        )
    }

    const events = replay.events ?? [];
    const sessionId: UUID = replay.sessionId;
    const duration = replay.duration ?? 0;

    return (
        <>
            <main className="min-w-screen h-screen flex flex-col bg-[#0c0c0e] text-[#e8e8ec] font-sans antialiased overflow-hidden">
                <Navbar sessionId={sessionId} replayId={replayId} type='replay' duration={duration}/>
                <ReplayPlayer events={events} duration={duration}/>
            </main>
        </>
    )
}