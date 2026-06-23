'use client'

import { useEffect, useRef, useState } from "react"
import Controlbar from "./Controlbar"
import ReplayTerminalComponent from "./ReplayTerminal"
import { EventType, PlaybackState } from "@/types/type"

type Props = {
    events: EventType[];
    duration: number;
}

export default function ReplayPlayer({ events, duration }: Props) {
    const terminalRef = useRef<{ write: (data: string) => void, clear: () => void }>(null)
    const timeoutsRef = useRef<NodeJS.Timeout[]>([])
    const intervalRef = useRef<NodeJS.Timeout>(null)
    const currentIndexRef = useRef<number>(0)
    const pausedAtRef = useRef<number>(0)

    const [playback, setPlayBack] = useState<PlaybackState>({
        isPlaying: true,
        speed: 1,
        progress: 0,
        elapsed: 0,
        duration
    });

    const scheduleEvents = (fromIndex: number, speed: number) => {
        for(let i = fromIndex; i<events.length; i++) {
            const baseTime = events[currentIndexRef.current].t
            const delay = (events[i].t - baseTime) / speed;

            const timeout = setTimeout(() => {
                terminalRef.current?.write(events[i].data);
                currentIndexRef.current = i+1;
            }, delay);
            timeoutsRef.current.push(timeout);
        }
    }

    const startProgressInterval = (startElapse: number, speed: number) => {
        const startedAt = Date.now();
        intervalRef.current = setInterval(() => {
            const realElapsed = (Date.now() - startedAt) * speed;
            const currentElapsed = startElapse + realElapsed;
            if(currentElapsed >= duration) {
                setPlayBack(prev => ({
                    ...prev, 
                    isPlaying: false
                }));
                clearInterval(intervalRef.current!);
                return;
            }
            setPlayBack(prev => ({
                ...prev,
                elapsed: currentElapsed,
                progress: Math.round((currentElapsed / duration) * 100)
            }))
        }, 100);
    }

    const handlePlayPause = (play: boolean) => {
        if(play) {
            if(currentIndexRef.current >= events.length) {
                handleRestart();
                return;
            }
            scheduleEvents(currentIndexRef.current, playback.speed);
            startProgressInterval(pausedAtRef.current, playback.speed);
        }
        else {
            timeoutsRef.current.forEach(timeout => {
                clearTimeout(timeout);
            })
            pausedAtRef.current = playback.elapsed;
            timeoutsRef.current = [];
            clearInterval(intervalRef.current!);
        }
        setPlayBack(prev => ({...prev, isPlaying: play}))
    }

    const handleSpeedChange = (speed: number) => {
        timeoutsRef.current.forEach(clearTimeout)
        timeoutsRef.current = []
        clearInterval(intervalRef.current!)
        if (playback.isPlaying) {
            scheduleEvents(currentIndexRef.current, speed)
            startProgressInterval(playback.elapsed, speed)
        }
        setPlayBack(prev => ({ ...prev, speed }))
    }

    const handleRestart = () => {
        timeoutsRef.current.forEach(clearTimeout)
        clearInterval(intervalRef.current!) 
        timeoutsRef.current = []
        pausedAtRef.current = 0;
        timeoutsRef.current = [];
        currentIndexRef.current = 0;
        setPlayBack(prev => ({
            ...prev,
            isPlaying: true,
            elapsed: 0,
            progress: 0
        }))
        terminalRef.current?.clear();
        scheduleEvents(currentIndexRef.current, playback.speed);
        startProgressInterval(0, playback.speed);
    }

    useEffect(() => {
        scheduleEvents(currentIndexRef.current, playback.speed);
        startProgressInterval(0, playback.speed);
    }, []);

    return (
        <>
            <div className='w-full h-full flex flex-col overflow-hidden py-2 px-4'>
                <ReplayTerminalComponent ref={terminalRef}/>
                <Controlbar playback={playback} handlePlayPause={handlePlayPause} handleSpeedChange={handleSpeedChange} handleRestart={handleRestart} />
            </div>
        </>
    )
}