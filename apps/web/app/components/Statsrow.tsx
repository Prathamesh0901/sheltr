type StatsRowProps = {
    totalSessions: number;
    totalReplays: number;
    hoursShared: number;
    username: string;
}

export default function Statsrow({ totalSessions, totalReplays, hoursShared, username }: StatsRowProps) {
    
    const stats = [{
        stat: totalSessions,
        text: 'Total Sessions',
        color: 'text-[#7C6AF7]'
    }, {
        stat: totalReplays,
        text: 'Total Replays',
        color: 'text-[#3DD68C]'
    }, {
        stat: hoursShared,
        text: 'Hours Shared',
        color: 'text-[#F59E0B]'
    }];

    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
    console.log(hour)
    
    return (
        <div className="w-full p-8 flex flex-col gap-4">
            <div className="w-full flex flex-col gap-2">
                <p className="text-4xl font-bold">{greeting}, {username}</p>
                <p className="text-sm text-[#6B6B78]">Here are your recent sessions and replays.</p>
            </div>
            <div className="w-full flex justify-between items-center">
                <div className="w-170 flex justify-between">
                    {
                        stats.map((stat, i) => (
                            <StatsCard key={i} stat={stat.stat} text={stat.text} color={stat.color} />
                        ))
                    }
                </div>

                <div>
                    <button className="bg-[#7C6AF7] px-4 py-2 rounded-md cursor-pointer">+ new session</button>
                </div>
            </div>
        </div>
    )
}

function StatsCard({ stat, text, color }: { stat: number, text: string, color: string }) {
    return (
        <div className="w-50 border border-[#2A2A30] p-4 rounded-xl">
            <p className={`text-3xl font-bold ${color}`}>{stat}</p>
            <p>{text}</p>
        </div>
    )
}