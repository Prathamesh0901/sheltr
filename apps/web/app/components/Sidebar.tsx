import { useParticipantStore } from "@/store/participant"

export default function Sidebar({ handleClick }: { handleClick: () => void }) {
    const { participants } = useParticipantStore();
    
    return (
        <>
        <div className="w-68 h-full px-4 py-4 flex flex-col overflow-hidden">
            <p className="text-lg text-[#6B6B78]">PARTICIPANTS</p>
            <div className="mt-4 flex-1 min-h-0 overflow-y-auto space-y-2 pb-4 scrollbar-theme">
                {
                    participants.map((p, index) => (
                        <div className="flex gap-4 border-b border-[#2A2A30] p-4" key={index}>
                            <div className="w-12 h-12 bg-[#0B0B0C] rounded-full flex items-center justify-center">
                                {p.id[0].toUpperCase()}
                            </div>
                            <div>
                                <p className="text-[#E8E8EC]">
                                    {p.id.split('-')[0]}
                                </p>
                                <p className="text-[#6B6B78]">
                                    {p.role}
                                </p>
                            </div>
                        </div>
                    ))
                }
            </div>
            <button className="mt-4 px-6 py-3 bg-[#090714] rounded-md border border-[#7C6AF7] text-center cursor-pointer" onClick={handleClick}>
                Share Session
            </button>
        </div>
        </>
    )
}

