'use client';

import { signIn, signUp } from "@/lib/auth-client";
import { useToastStore } from "@/store/toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AuthFormProps = {
    type: 'signin' | 'signup';
}

type UserData = {
    email: string;
    password: string;
    name: string;
}

export default function AuthForm({ type }: AuthFormProps) {

    const router = useRouter();

    const { showToast } = useToastStore();

    const [userData, setUserData] = useState<UserData>({
        email: '',
        password: '',
        name: ''
    });

    const [error, setError] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    const handleSubmit = async () => {
        if(type === 'signin') {
            const { error } = await signIn.email({ 
                email: userData.email,
                password: userData.password
            })
            console.log(error);
            if(!error) {
                router.push('/dashboard');
                showToast('success', 'User signed in');
            }
            else if(error.message) {
                setError(error.message);
                showToast('error', 'Error signing in');
            }
        }
        else if(type === 'signup') {
            const { error } = await signUp.email({ 
                email: userData.email,
                password: userData.password,
                name: userData.name
            })
            console.log(error);
            if(!error) {
                router.push('/dashboard');
                showToast('success', 'User signed up');
            }
            else if(error.message) {
                setError(error.message);
                showToast('error', 'Error signing up');
            }
        }
    }

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-100 flex items-center justify-center flex-col gap-2 border border-[#2A2A30] rounded-xl px-12 py-4 shadow-2xl shadow-[#7C6AF780] border-t-2 border-t-[#7C6AF7]">
                <div className="text-center">
                    <span className="font-mono text-[1.05rem] tracking-tight">
                        sh<span className="text-[#7c6af7]">&gt;</span>ltr
                    </span>
                    <div className="mt-4">
                        <p className="text-2xl font-bold">
                            {
                                type === 'signin'?
                                "Welcome back"
                                : "Welcome"
                            }
                        </p>
                        <p className="text-[#6B6B78]">
                            {
                                type === 'signin'?
                                "Sign in to your account"
                                : "Create new account"
                            }
                        </p>
                    </div>
                </div>

                <div className="border border-[#2A2A30] w-full"></div>
                
                <div className="w-full flex flex-col gap-2">
                    {
                        type === 'signup' &&
                        <Input name="name" type="text" label="Name" placeHolder="your name" handleChange={handleChange}/>
                    }
                    <Input name="email" type="email" label="Email Address" placeHolder="you@example.com" handleChange={handleChange}/>
                    <Input name="password" type="password" label="Password" placeHolder="password" handleChange={handleChange}/>
                    {
                        type === 'signin' && 
                        <a className="text-right text-sm text-[#A89CF8]">Forgot password?</a>
                    }
                    <button className="w-full p-2 bg-[#7C6AF7] rounded-md cursor-pointer" onClick={handleSubmit}>
                        {
                            type === 'signin'?
                            'Signin':
                            'Signup'
                        }
                    </button>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                </div>

                <div className="w-full flex items-center gap-2 text-[#2C2C2C]">
                    <div className="flex-1 h-px bg-[#2A2A30]" />
                    <span className="text-sm">or</span>
                    <div className="flex-1 h-px bg-[#2A2A30]" />
                </div>

                <div className="text-[#6B6B78]">
                    {
                        type === 'signin'?
                        'Don\'t have an account? ':
                        'Already have an account?'
                    }
                    <a href={`/auth/${type === 'signin'? 'signup': 'signin'}`}> {
                        type === 'signin'?
                        ' Signup':
                        ' Signin'
                    }</a>
                </div>

                <div className="pt-16 text-xs text-[#6B6B78]">
                    By signing {type === 'signin'? 'in': 'up'} you agree our Terms and Conditions
                </div>
            </div>
        </div>
    )
}

type InputProps = {
    name: string;
    type: string;
    label: string;
    placeHolder: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function Input({ name, type, label, placeHolder, handleChange }: InputProps) {
    return (
        <div className="flex flex-col text-[#6B6B78]">
            <label htmlFor="input" className="">{label}:</label>
            <input type={type} name={name} id={name} placeholder={placeHolder} className="p-2 border border-[#2A2A30] rounded-md bg-[#17171b] text-[#e8e8ec] placeholder:text-[#6b6b78] outline-none focus:border-[#7c6af7] transition-colors" onChange={handleChange}/>
        </div>
    )
}