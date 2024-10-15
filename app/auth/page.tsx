'use client'

import SIFC from "@/components/SIFC"
import { useSession } from "next-auth/react"
import { useLayoutEffect } from "react"
import { useRouter } from "next/navigation"

export default function Auth() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useLayoutEffect(() => {
        if (status === "authenticated" && session) {
            router.push('/')
        }
    }, [session, status])


    return (
        <div className="w-[100dvw] h-[100dvh] p-8 flex flex-col justify-center items-center bg-slate-950">
            <div className="w-full h-full flex flex-col justify-center items-center relative z-[5] gap-4">
                <h1 className="text-white font-black text-6xl">Auth Page</h1>
                <p className="text-md font-semibold text-white">Continue with</p>
                <SIFC />
            </div>           
        </div>
    )
}