import AuthForm from "@/app/components/AuthForm";
import Navbar from "@/app/components/Navbar";

export default function Home() {
    return (
        <main className="min-w-screen h-screen flex flex-col bg-[#0c0c0e] text-[#e8e8ec] font-sans antialiased overflow-hidden">
            <Navbar type='normal'/>
            <div className='w-full h-full flex overflow-hidden py-2 px-4'>
                <AuthForm type="signup"/>
            </div>
        </main>
    )
}