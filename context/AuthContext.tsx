"use client"

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from "react"
import { getCsrfToken, signIn, useSession } from "next-auth/react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { devLog } from "@/helpers/devLog"

interface IContext {
    authError: string | null,
    setAuthError: React.Dispatch<React.SetStateAction<string | null>>,
    isMini: boolean,
    setIsMini: React.Dispatch<React.SetStateAction<boolean>>,
}

const defaultValue: IContext = {
    authError: null,
    setAuthError: () => { },
    isMini: false,
    setIsMini: () => { },
}

const AuthContext = createContext<IContext>(defaultValue)

interface ProviderProps {
    children: ReactNode
}

const AuthContextProvider = ({ children }: ProviderProps) => {
    const { data: session } = useSession()

    //NOTE - isMini is used to see if the user came through composer or not, true means YES - used for linking out etc...
    const [isMini, setIsMini] = useState<boolean>(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    useEffect(() => {
        devLog('AuthContext.tsx', 'isMini', isMini)
    }, [])

    useEffect(() => {
        if (!pathname.includes('auth') && session === null) {
            // If there is no session we push the user to the auth page
            router.push('/auth')
        }
    }, [session, pathname])

    const [authError, setAuthError] = useState<string | null>(null)

    // Handle sign-in process for Farcaster Mini-App
    const handleSignIn = useCallback(async (key: string) => {
        try {
            const csrfToken = await getCsrfToken()
            // Call the 'miniApp' method in auth/[...nextAuth]
            // Pass in the detected key from the url params into the auth/[...nextAuth] method
            const result = await signIn("miniApp", {
                key,
                csrfToken,
                redirect: false,
                json: true
            })

            if (result?.error) {
                setAuthError("Unexpected error occurred during sign-in.")
                devLog('AuthContext.tsx', 'Error occurred during sign-in.', result?.error)
            } else {
                setAuthError(null)
                devLog('AuthContext.tsx', 'Successfully signed in', null)
            }
        } catch (error) {
            setAuthError("Unexpected error occurred during sign-in.")
            devLog('AuthContext.tsx', 'Unexpected error occurred during sign-in.', error)
        }
    }, [])

    const scheduling = async (key: string) => {
        await handleSignIn(key)
        router.replace(pathname)
    }

    useEffect(() => {
        const key = searchParams.get("key")
        const mini = searchParams.get("mini")

        if (key) {
            // If key is detected fire scheduling() - so it can fire handleSignIn()
            // We do it this way, as the URL wants to be replaced after login to clear it from all params
            scheduling(key)
        }
        if (mini) {
            setIsMini(true)
        }
    }, [handleSignIn, searchParams])


    //-----------------------------------------------------------------------------------------------------------
    const contextValue: IContext = {
        authError,
        setAuthError,
        isMini,
        setIsMini
    }

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => useContext(AuthContext)
export default AuthContextProvider
