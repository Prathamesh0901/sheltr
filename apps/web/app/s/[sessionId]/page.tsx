'use client';

import { useParams, useSearchParams } from 'next/navigation';
import Terminal from '../../components/Terminal';
import { Role } from '@sheltr/shared';
import Navbar from '@/app/components/Navbar';
import Sidebar from '@/app/components/Sidebar';
import { useState } from 'react';
import ShareDialog from '@/app/components/ShareDialog';

export default function Home() {
    const params = useParams();
    const searchParams = useSearchParams();
    const sessionId = params.sessionId as string;
    const role = searchParams.get('role') as Role;

    const [isOpen, setIsOpen] = useState<boolean>(false)

    if (!sessionId || !role) {
        return <div>Session Id and Role is required</div>
    }

    return (
        <>
            <main className="min-w-screen h-screen flex flex-col bg-[#0c0c0e] text-[#e8e8ec] font-sans antialiased overflow-hidden">
                <Navbar sessionId={sessionId} role={role} type='session' />
                <div className='w-full h-full flex overflow-hidden py-2 px-4'>
                    <Terminal sessionId={sessionId} role={role} />
                    <Sidebar handleClick={() => setIsOpen(true)} />
                </div>
            </main>
            <ShareDialog sessionId={sessionId} show={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
}