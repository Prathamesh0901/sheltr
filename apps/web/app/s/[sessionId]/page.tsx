'use client';

import { useParams } from 'next/navigation';
import Terminal from '../../components/Terminal';

export default function Home() {
    const params = useParams();
    const sessionId = params.sessionId as string;
    if (!sessionId) {
        return (
            <div>
                Session Id is required
            </div>
        )
    }
    return (
        <main className="w-screen h-screen bg-[#0a0a0a] p-4">
            <Terminal sessionId={sessionId}/>
        </main>
    )
}