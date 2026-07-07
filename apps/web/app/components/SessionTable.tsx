import { parseTime } from "@/utils/util"
import { Recording, SheltrSession } from "@sheltr/db";

type Session = SheltrSession & {
    recording: Recording | null
}

export default function SessionTable({ sessions }: { sessions: Session[] }) {

    return (
        <div className="w-full h-full p-8 flex flex-col gap-4">
            <p className="text-lg font-bold">Recent Sessions</p>
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-theme">
                <table className="table-auto w-full text-sm">
                    <thead>
                        <tr className="bg-[#17171b] text-[#6b6b78] text-xs uppercase tracking-wider">
                            <th className="text-left px-4 py-3 font-medium rounded-tl-lg">Session ID</th>
                            <th className="text-left px-4 py-3 font-medium">Created</th>
                            <th className="text-left px-4 py-3 font-medium">Duration</th>
                            <th className="text-left px-4 py-3 font-medium">Viewers</th>
                            <th className="text-left px-4 py-3 font-medium">Status</th>
                            <th className="text-left px-4 py-3 font-medium rounded-tr-lg">Replay</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2a2a30]">
                        {sessions.map((session, i) => {
                            const status = session.recording ? 'ended' : 'ongoing';

                            return <tr key={i} className="hover:bg-[#111114] transition-colors">
                                <td className="px-4 py-3 font-mono text-[#a89cf8]">
                                    {session.id}
                                </td>
                                <td className="px-4 py-3 text-[#6b6b78]">
                                    {new Date(session.startedAt).toLocaleDateString('en-US', { 
                                        month: 'short', day: 'numeric', year: 'numeric', 
                                        hour: '2-digit', minute: '2-digit' 
                                    })}
                                </td>
                                <td className="px-4 py-3 font-mono text-[#e8e8ec]">
                                    {session.recording ? parseTime(session.recording.duration) : '-'}
                                </td>
                                <td className="px-4 py-3">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-[#131025] border border-[#7c6af7]/30 text-[#a89cf8]">
                                        {session.recording?.viewerCount ?? 0} viewers
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status === 'ongoing'
                                        ? 'bg-green-900/30 border border-green-500/30 text-green-400'
                                        : 'bg-[#0f1a12] border border-[#3dd68c]/30 text-[#3dd68c]'
                                        }`}>
                                        {status}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    {session.recording ? (
                                        <a
                                            href={`/r/${session.recording.id}`}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#131025] border border-[#7c6af7]/30 text-[#a89cf8] hover:bg-[#1a1535] transition-colors"
                                        >
                                            <PlayIcon />
                                            Watch
                                        </a>
                                    ) : (
                                        <span className="text-[#6b6b78]">—</span>
                                    )}
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div >
    )
}

function PlayIcon() {
    return (
        <svg className="w-3 h-3" viewBox="-0.5 0 8 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>play [#1001]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-427.000000, -3765.000000)" fill="#A89CF8"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="play-[#1001]" points="371 3605 371 3613 378 3609"> </polygon> </g> </g> </g> </g></svg>
    )
}