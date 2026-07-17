'use client'

import { useToastStore } from '@/store/toast'
import { useEffect, useState } from 'react'

export default function ShareDialog({ sessionId, show, onClose }: { 
    sessionId: string
    show: boolean
    onClose: () => void 
}) {
    const [origin, setOrigin] = useState('')
    const { showToast } = useToastStore()

    useEffect(() => {
        setOrigin(window.location.origin)
    }, [])

    const controllerUrl = `${origin}/s/${sessionId}?role=controller`
    const viewerUrl = `${origin}/s/${sessionId}?role=viewer`

    const copy = (url: string, label: string) => {
        navigator.clipboard.writeText(url)
        showToast('success', `${label} URL copied`)
    }

    if (!show) return null

    return (
        <>
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                onClick={onClose}
            />

            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[480px] bg-[#111114] border border-[#2a2a30] rounded-xl shadow-2xl shadow-black/60 p-6">
                
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-base font-medium text-[#e8e8ec]">Share Session</p>
                        <p className="text-xs text-[#6b6b78] font-mono mt-0.5">{sessionId.split('-')[0]}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-[#6b6b78] hover:text-[#e8e8ec] transition-colors text-lg leading-none cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-[#a89cf8] uppercase tracking-wider">Controller</span>
                        <span className="text-xs text-[#6b6b78]">full access</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#17171b] border border-[#2a2a30] rounded-lg px-3 py-2.5">
                        <p className="flex-1 font-mono text-xs text-[#e8e8ec] truncate">{controllerUrl}</p>
                        <button
                            onClick={() => copy(controllerUrl, 'Controller')}
                            className="text-xs text-[#a89cf8] hover:text-[#e8e8ec] transition-colors shrink-0 px-2 py-1 rounded border border-[#7c6af7]/30 hover:border-[#7c6af7] bg-[#131025] cursor-pointer"
                        >
                            copy
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-[#6b6b78] uppercase tracking-wider">Viewer</span>
                        <span className="text-xs text-[#6b6b78]">read only</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#17171b] border border-[#2a2a30] rounded-lg px-3 py-2.5">
                        <p className="flex-1 font-mono text-xs text-[#e8e8ec] truncate">{viewerUrl}</p>
                        <button
                            onClick={() => copy(viewerUrl, 'Viewer')}
                            className="text-xs text-[#6b6b78] hover:text-[#e8e8ec] transition-colors shrink-0 px-2 py-1 rounded border border-[#2a2a30] hover:border-[#6b6b78] cursor-pointer"
                        >
                            copy
                        </button>
                    </div>
                </div>

                <p className="text-xs text-[#6b6b78] text-center">
                    Anyone with the controller link can type in your terminal.
                </p>
            </div>
        </>
    )
}