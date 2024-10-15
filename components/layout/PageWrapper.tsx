import { ReactNode } from 'react'

interface PageWrapperProps {
    children: ReactNode
}

export default function PageWrapper({ children }: PageWrapperProps) {
    return (
        <>
            <main className='w-[100dvw] h-[100dvh] relative z-[50] flex flex-col justify-start items-center overflow-x-hidden overflow-y-auto'>
                <div className='relative z-[20] w-full pb-28 '>
                    {children}
                </div>
            </main>
        </>
    )
}