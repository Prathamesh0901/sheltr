import { Role } from "@sheltr/shared";

export type Participant = {
    role: Role;
    id: string;
}

export type EventType = {
    t: number,
    data: string
}

export type PlaybackState = {
    isPlaying: boolean;
    speed: number;
    progress: number;
    duration: number;
    elapsed: number;
}