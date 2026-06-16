import ReplayTerminalComponent from "@/app/components/ReplayTerminal"

type Props = {
    params: Promise<{ replayId: string}>
}

const getReplay = async (replayId: string) => {
    const SERVER_URL = process.env.SERVER_URL ?? 'http://localhost:3000'
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

    return (
        <main className="w-screen h-screen bg-[#0a0a0a] p-4">
            <ReplayTerminalComponent events={events} />
        </main>
    )
}