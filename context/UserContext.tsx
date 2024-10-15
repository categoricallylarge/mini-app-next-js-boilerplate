"use client"

import React, { createContext, useContext, ReactNode, useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface IContext {
    userProfile: T_UserProfile | null,
    setUserProfile: React.Dispatch<React.SetStateAction<T_UserProfile | null>>
}

const value: IContext = {
    userProfile: null,
    setUserProfile: () => { },
}

const Context = createContext<IContext>(value)

interface ProviderProps {
    children: ReactNode
}

const UserContextProvider = ({ children }: ProviderProps) => {
    const { data: session, status } = useSession()

    const [userProfile, setUserProfile] = useState<T_UserProfile | null>(null)

    const fetchUser = async () => {
        //NOTE - fetch the user from your database
        // for this example we will use the details from the session provided by our nextAuth
        
        // Or - before returning session from [...nextAuth] - you can fetch your user data from a DB and assign it to the session

        setUserProfile({
            fid: session?.user.fid!,
            username: session?.user.username!,
            pfpUrl: session?.user.pfpUrl!,
            displayName: session?.user.displayName!,
            bio: session?.user.bio!,
            verifications: session?.user.verifications!
        })
    }

    useEffect(() => {
        if (status === "authenticated" && session && userProfile === null) {
            fetchUser()
        }
    }, [status, session, userProfile])


    // --------------------------------------------------------------------------------------------
    const exposed: IContext = {
        userProfile,
        setUserProfile,
    }

    return <Context.Provider value={exposed}>{children}</Context.Provider>
}

export const useUserContext = () => useContext(Context)
export default UserContextProvider