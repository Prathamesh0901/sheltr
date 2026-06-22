import { Participant } from '@/types/type';
import { UUID } from 'node:crypto';
import { create } from 'zustand';

interface ParticipantState {
    participants: Participant[];
    updateStore: (participants: Participant[]) => void;
    emptyStore: () => void;
    addParticipant: (participant: Participant) => void;
    removeParticipant: (id: UUID) => void;
};

export const useParticipantStore = create<ParticipantState>((set) => ({
    participants: [],
    updateStore: (p: Participant[]) => set(() => ({participants: p})),
    emptyStore: () => set(() => ({participants: []})),
    addParticipant: (p) => set((state) => {
        const participants = state.participants;
        participants.push(p);
        return {participants}
    }),
    removeParticipant: (id) => set((state) => {
        const filteredParticipants = state.participants.filter(p => p.id !== id);
        return {participants: filteredParticipants};
    })
}));