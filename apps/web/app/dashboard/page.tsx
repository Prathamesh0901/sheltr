import { auth, prisma, Recording } from "@sheltr/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import SessionTable from "../components/SessionTable";
import Statsrow from "../components/Statsrow";

export default async function Home() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) redirect('/auth/signin')

    const sheltrSessions = await prisma.sheltrSession.findMany({
        where: {
            userId: session.user.id
        },
        include: {
            recording: true
        },
        orderBy: {
            startedAt: 'desc'
        }
    })

    let recordings: Recording[] = [];
    sheltrSessions.forEach(s => s.recording && recordings.push(s.recording))

    const totalDurationMs = recordings.reduce((acc, r) => acc + (r.duration ?? 0), 0)
    const hoursShared = parseFloat((totalDurationMs / 3600000).toFixed(1))

    return (
        <main className="min-w-screen h-screen flex flex-col bg-[#0c0c0e] text-[#e8e8ec] font-sans antialiased overflow-hidden">
            <Navbar type='dashboard' />
            <div className='w-full h-full flex flex-col overflow-hidden py-2 px-6'>
                <Statsrow 
                    totalSessions={sheltrSessions.length}
                    totalReplays={recordings.filter(r => r.events).length}
                    hoursShared={hoursShared}
                    username={session.user.name}
                />
                <div className="w-full border border-[#2A2A30]" />
                <div className="flex-1 min-h-0 overflow-hidden">
                    <SessionTable sessions={sheltrSessions}/>
                </div>
            </div>
        </main>
    )
}