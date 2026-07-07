"use client";

import { signOut, useSession } from "@/lib/auth-client";
import { useToastStore } from "@/store/toast";
import { useRouter } from "next/navigation";

export default function NavbarActions() {

    const router = useRouter();

    const { showToast } = useToastStore();

    const { data: session } = useSession();
    const initial = session?.user?.name?.[0].toUpperCase() ?? '?';

    return (
        <>
            <button className="text-[#6B6B78] cursor-pointer px-2" onClick={async () => {
                await signOut();
                showToast('success', 'Signed out')
                router.push('/auth/signin');
            }}>
                sign out
            </button>

            <div className="w-8 h-8 bg-[#131025] rounded-full flex items-center justify-center cursor-pointer">
                {initial}
            </div>
        </>
    )
}