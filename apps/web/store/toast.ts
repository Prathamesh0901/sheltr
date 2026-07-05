import { create } from "zustand";

type Toast = {
    id: string;
    type: 'success' | 'error';
    message: string;
}

type ToastState = {
    toasts: Toast[],   
    showToast: (type: 'success' | 'error', message: string) => void;
    hideToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
    toasts: [],
    showToast: (type, message) => {
        let id = crypto.randomUUID();
        set(state => ({
            toasts: [...state.toasts, {id, type, message}]
        }))
        setTimeout(() => useToastStore.getState().hideToast(id), 3000)
    },
    hideToast: (id: string) => set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
    }))
}))