'use client'

import { ReactNode, Suspense } from 'react'
import { SessionProvider } from "next-auth/react"
import AuthContextProvider from '@/context/AuthContext'
import Loading from '@/components/views/Loading'
import AuthLoader from './AuthLoader'

interface CustomAuthWrapperProps {
    children: ReactNode
}

export default function CustomAuthWrapper({ children }: CustomAuthWrapperProps) {
    return (
        <>
            <SessionProvider>
                <Suspense fallback={<Loading />}>
                    <AuthContextProvider>
                        <AuthLoader>
                            {children}
                        </AuthLoader>
                    </AuthContextProvider>
                </Suspense>
            </SessionProvider>
        </>
    )
}