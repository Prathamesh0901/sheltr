'use client';

import { useState } from "react";
import { generateApiKey } from "../actions/apiKey";
import { useToastStore } from "@/store/toast";

export default function ApiKeyCard({ apiKey }: { apiKey: string | null }) {

    const [key, setKey] = useState<string | null>(apiKey);

    const { showToast } = useToastStore();

    const handleCopy = () => {
        navigator.clipboard.writeText(`SHELTR_API_KEY=${key} npx @sheltr_/agent`);
        showToast('success', 'Command copied to clipboard')
    }

    const handleGenerate = async () => {
        const key = await generateApiKey()
        setKey(key)
        showToast('success', 'API key generated')
    }

    return (
        <>
            {
                key ?
                    <>
                        <p className="font-mono text-sm text-[#6B6B78]">SHELTR_API_KEY={key.slice(0, 8)}... npx @sheltr_/agent</p>
                        <div className="flex flex-col">
                            <button className="text-sm bg-[#7C6AF7] px-4 py-2 rounded-md cursor-pointer" onClick={handleCopy}>Copy</button>
                            <a className="text-sm text-[#6B6B78] cursor-pointer" onClick={handleGenerate}> {'\u21BB'} regenerate key</a>
                        </div>
                    </> :
                    <>
                        <p className="text-md text-[#6B6B78]">Generate an API key to get started</p>
                        <button className="text-sm bg-[#7C6AF7] px-4 py-2 rounded-md cursor-pointer" onClick={handleGenerate}>Generate Key</button>
                    </>
            }
        </>
    )
}