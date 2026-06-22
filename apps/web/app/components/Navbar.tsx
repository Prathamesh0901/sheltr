import { Role } from "@sheltr/shared";
import { UUID } from "node:crypto"

type params = {
    type: 'session' | 'replay'
    sessionId: UUID;
    replayId?: string;
    role?: Role;
}

export default function Navbar({ type, sessionId, replayId, role }: params) {
    return (
        <nav className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/[0.06] sticky top-0 bg-[#0c0c0e]/90 backdrop-blur-md z-50">
            <div className="flex gap-10">
                <span className="font-mono text-[1.05rem] tracking-tight">
                    sh<span className="text-[#7c6af7]">&gt;</span>ltr
                </span>
                <span className="border-l border-white/20 pl-4">
                    {type} / {sessionId.split('-')[0]}
                </span>
                <div className="w-fit px-2 border-2 rounded-full border-[#7c6af7] bg-[#131025]">
                    {type === 'session'? role: replayId}
                </div>
            </div>
            <div>
                {
                    type === 'session'?
                        <div className="w-4 h-4 bg-[#3DD68C] rounded-full animate-pulse"></div>
                    :
                        <div className="text-sm text-[#6B6B78]">
                            4m 02s
                        </div>
                }
            </div>
        </nav>
    )
}