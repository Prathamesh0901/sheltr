'use client';

import { useParams, useSearchParams } from 'next/navigation';
import Terminal from '../../components/Terminal';
import { Role } from '@sheltr/shared';
import Navbar from '@/app/components/Navbar';
import { UUID } from 'node:crypto';
import Sidebar from '@/app/components/Sidebar';

export default function Home() {
    const params = useParams();
    const searchParams = useSearchParams();
    const sessionId = params.sessionId as UUID;
    const role = searchParams.get('role') as Role;

    if (!sessionId || !role) {
        return (
            <div>
                Session Id and Role is required
            </div>
        )
    }
    
    return (
        <>
            <main className="min-w-screen h-screen flex flex-col bg-[#0c0c0e] text-[#e8e8ec] font-sans antialiased overflow-hidden">
                <Navbar sessionId={sessionId} role={role} type='session'/>
                <div className='w-full h-full flex overflow-hidden py-2 px-4'>
                    <Terminal sessionId={sessionId} role={role}/>
                    <Sidebar />
                </div>
            </main>
        </>
    )
}