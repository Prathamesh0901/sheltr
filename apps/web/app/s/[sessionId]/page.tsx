'use client';

import { useParams, useSearchParams } from 'next/navigation';
import Terminal from '../../components/Terminal';
import { Role } from '@sheltr/shared';

export default function Home() {
    const params = useParams();
    const searchParams = useSearchParams();
    const sessionId = params.sessionId as string;
    const role = searchParams.get('role') as Role;

    if (!sessionId || !role) {
        return (
            <div>
                Session Id and Role is required
            </div>
        )
    }
    
    return (
        <main className="w-screen h-screen bg-[#0a0a0a] p-4">
            <Terminal sessionId={sessionId} role={role}/>
        </main>
    )
}