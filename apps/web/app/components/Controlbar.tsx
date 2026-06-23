'use client'

import { PlaybackState } from "@/types/type";
import { parseTime } from "@/utils/util";

type Props = {
    playback: PlaybackState;
    handlePlayPause: (play: boolean) => void;
    handleSpeedChange: (speed: number) => void;
    handleRestart: () => void;
}

export default function Controlbar({ playback, handlePlayPause, handleSpeedChange, handleRestart}: Props) {

    const speeds = [0.5, 1, 2];

    return (
        <div className="gap-2 mx-4">
            <input
                className="w-full h-1 rounded-full bg-[#2A2A30] outline-none appearance-none"
                style={{
                    accentColor: "#7C6AF7",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    background: `linear-gradient(to right, #7C6AF7 ${playback.progress}%, #2A2A30 ${playback.progress}%)`,
                }}
                value={playback.progress}
                min={0}
                max={100}
                type="range"
                onChange={() => {}}
                readOnly
            />
            <div className="w-full text-white flex justify-between rounded-xl overflow-hidden">
                <div className="w-60 p-2 flex justify-between items-center text-[#d9d9ff]">
                    <button className="w-4 h-4 cursor-pointer transition-transform duration-300 hover:scale-110"
                        onClick={handleRestart}
                    >
                        <SkipBackward />
                    </button>
                    <button className="w-4 h-4 cursor-pointer transition-transform duration-300 hover:scale-110" onClick={() => handlePlayPause(!playback.isPlaying)}>
                        {
                            playback.isPlaying ?
                                <PauseIcon /> :
                                <PlayIcon />
                        }
                    </button>
                    <button className="w-4 h-4 cursor-pointer transition-transform duration-300 hover:scale-110"
                        onClick={handleRestart}
                    >
                        <SkipForward />
                    </button>
                    <p className="text-sm text-[#6B6B78]">
                        <span>{parseTime(playback.elapsed)} </span>
                        /
                        <span> {parseTime(playback.duration)}</span>
                    </p>
                </div>

                <div className="w-40 p-2 flex justify-between items-center text-sm">
                    {
                        speeds.map((speed, index) => (
                            <button
                                key={index}
                                className={`px-2 py-1 border rounded-md transition-colors ${
                                    speed === playback.speed
                                    ? 'border-[#7c6af7] bg-[#131025] text-[#a89cf8]'
                                    : 'border-[#3f3b6b] bg-[#1f1d2c] text-white hover:bg-[#2b2750]'
                                }`}
                                onClick={() => handleSpeedChange(speed)}
                            >
                                {speed}x
                            </button>
                        ))
                    }

                </div>
            </div>
        </div>
    )
}

function PauseIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 6C2 4.11438 2 3.17157 2.58579 2.58579C3.17157 2 4.11438 2 6 2C7.88562 2 8.82843 2 9.41421 2.58579C10 3.17157 10 4.11438 10 6V18C10 19.8856 10 20.8284 9.41421 21.4142C8.82843 22 7.88562 22 6 22C4.11438 22 3.17157 22 2.58579 21.4142C2 20.8284 2 19.8856 2 18V6Z" fill="#ffffff"></path> <path d="M14 6C14 4.11438 14 3.17157 14.5858 2.58579C15.1716 2 16.1144 2 18 2C19.8856 2 20.8284 2 21.4142 2.58579C22 3.17157 22 4.11438 22 6V18C22 19.8856 22 20.8284 21.4142 21.4142C20.8284 22 19.8856 22 18 22C16.1144 22 15.1716 22 14.5858 21.4142C14 20.8284 14 19.8856 14 18V6Z" fill="#ffffff"></path> </g></svg>
    )
}

function PlayIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21.4086 9.35258C23.5305 10.5065 23.5305 13.4935 21.4086 14.6474L8.59662 21.6145C6.53435 22.736 4 21.2763 4 18.9671L4 5.0329C4 2.72368 6.53435 1.26402 8.59661 2.38548L21.4086 9.35258Z" fill="#ffffff"></path> </g></svg>
    )
}

function SkipForward() {
    return (
        <svg fill="#ffffff" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>forward</title> <path d="M0 24q0 0.544 0.288 1.056t0.768 0.736q0.48 0.256 1.056 0.224t0.992-0.32l12-8q0.896-0.608 0.896-1.696t-0.896-1.632l-12-8q-0.448-0.32-0.992-0.352t-1.056 0.224q-0.48 0.256-0.768 0.736t-0.288 1.024v16zM16 24q0 0.544 0.288 1.056t0.768 0.736q0.48 0.256 1.056 0.224t0.992-0.32l12-8q0.896-0.608 0.896-1.696t-0.896-1.632l-12-8q-0.448-0.32-0.992-0.352t-1.056 0.224q-0.48 0.256-0.768 0.736t-0.288 1.024v16z"></path> </g></svg>
    )
}

function SkipBackward() {
    return (
        <svg fill="#ffffff" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>backward</title> <path d="M0 16q0 1.12 0.896 1.664l12 8q0.448 0.32 0.992 0.352t1.056-0.224q0.48-0.288 0.768-0.768t0.288-1.024v-16q0-0.544-0.288-1.024t-0.768-0.736-1.056-0.224-0.992 0.32l-12 8q-0.896 0.608-0.896 1.664zM16 16q0 1.12 0.896 1.664l12 8q0.448 0.32 0.992 0.352t1.056-0.224q0.48-0.288 0.768-0.768t0.288-1.024v-16q0-0.544-0.288-1.024t-0.768-0.736-1.056-0.224-0.992 0.32l-12 8q-0.896 0.608-0.896 1.664z"></path> </g></svg>
    )
}