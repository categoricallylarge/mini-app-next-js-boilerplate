'use client'

import { useCallback, useState } from 'react'
import { useSession, signIn, getCsrfToken, signOut } from "next-auth/react"
import { AuthKitProvider, SignInButton } from '@farcaster/auth-kit'
import '@farcaster/auth-kit/styles.css'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Image from 'next/image'
import FarcasterShare from './FarcasterShare'
import { devLog } from '@/helpers/devLog'
import { useAuthContext } from '@/context/AuthContext'

interface Props { }

const config = {
    relay: "https://relay.farcaster.xyz",
    rpcUrl: "https://mainnet.optimism.io",
    siweUri: `${process.env.NEXT_PUBLIC_URL}`,
    domain: `${process.env.NEXT_PUBLIC_URL_SHORT}`,
}

export default function SIFC({ }: Props) {

    const { data: session } = useSession()
    const { authError, setAuthError } = useAuthContext()
    const [qrScanned, setQrScanned] = useState<boolean>(false)

    const getNonce = useCallback(async () => {
        const nonce = await getCsrfToken()
        if (!nonce) throw new Error("Unable to generate nonce")
        return nonce
    }, [])

    const successfulQR = async (data: any) => {
        setQrScanned(true)

        if (!data.fid) return

        try {
            // Call the 'farcasterQR' method in auth/[...nextAuth]
            // From the QR code scan - we must pass the message and signature - for validation in [...nextAuth]
            // This is vital to authenticate the user
            const result = await signIn("farcasterQR", {
                message: data.message,
                signature: data.signature,
                redirect: false,
                json: true
            })

            if (result?.error) {
                setAuthError("Unexpected error occurred during sign-in.")
                devLog('SIFC.tsx', 'Error occurred during sign-in.', result?.error)
            } else {
                setAuthError(null)
                devLog('SIFC.tsx', 'Successfully signed in', null)
            }
        } catch (error) {
            setAuthError("Unexpected error occurred during sign-in.")
            devLog('SIFC.tsx', 'Unexpected error occurred during sign-in.', error)
        }
    }

    console.log('[SIFC.tsx] - session :', session)

    return (
        <AuthKitProvider config={config}>
            {session === undefined &&
                <div className='w-[132px] h-[53px] px-2 py-2 bg-zinc-900 aspect-square rounded-lg animate-pulse flex justify-start gap-2 items-center'>
                    <div className='min-w-[40px] w-[40px] h-[40px] px-4 py-2 bg-zinc-800/30 aspect-square rounded-full ' />
                    <div className='w-full h-full flex flex-col justify-start items-start gap-1'>
                        <div className='w-full rounded-sm bg-zinc-800/30 h-[14px]' />
                        <div className='w-[52px] rounded-sm bg-zinc-800/30 h-[10px]' />
                    </div>
                </div>
            }

            {!qrScanned && !session && session !== undefined &&
                <div className='flex flex-col justify-start items-center gap-1 w-full'>
                    <SignInButton
                        nonce={getNonce}
                        onError={(error: any) => { console.log('[SIFC.tsx] - error :', error.message) }}
                        onSuccess={(res: any) => { console.log('[SIFC.tsx] - success :', res), successfulQR(res) }}
                    />
                    {authError && <p className='text-white text-xxs'>Error, please try again</p>}
                </div>
            }

            {qrScanned && !session && session !== undefined &&
                <div className='w-[132px] h-[53px] px-2 py-2 bg-zinc-900 aspect-square rounded-lg animate-pulse flex justify-start gap-2 items-center' />
            }

            {session && session !== undefined &&
                <Menu as="div" className="relative ">
                    <MenuButton className='w-[132px] h-[53px] px-2 py-2 bg-zinc-800/80 border border-zinc-700/20 shadow-zinc-900/40 shadow-sm hover:shadow-md active:shadow-none aspect-square rounded-lg  flex justify-start gap-2 items-center'>
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <div className='min-w-[36px] w-[36px] h-[36px]  bg-zinc-500 aspect-square rounded-full  ' >
                            {/* NOTE - you can use session or userProfile from the userContext - both are the same */}
                            {session.user?.pfpUrl &&
                                <Image
                                    src={session.user?.pfpUrl}
                                    alt={`${session.user?.username}'s profile image`}
                                    width={54}
                                    height={54}
                                    style={{
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                    }}
                                />
                            }
                            {!session.user?.pfpUrl &&
                                <div className='w-full h-full bg-zinc-600 animate-pulse rounded-full overflow-hidden' />
                            }
                        </div>
                        <div className='w-full h-full flex flex-col justify-center items-start gap-1 overflow-hidden'>
                            <div className='w-full h-[14px] flex justify-start items-center ' >
                                <p className='text-xs text-white font-semibold truncate w-full text-left'>@{session.user.username}</p>
                            </div>
                            <div className='w-[52px] h-[10px] flex justify-start items-center' >
                                <p className='text-xxs text-white/80 '>{session.user.fid}</p>
                            </div>
                        </div>
                    </MenuButton>

                    <MenuItems
                        transition
                        className="absolute left-0 z-[100] mt-2 w-48 origin-top-right rounded-md bg-zinc-800/80 py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                        <MenuItem>
                            <a href="#" className="w-full gap-2 flex justify-start items-center px-4 py-2 text-sm text-white/80 hover:text-white data-[focus]:bg-zinc-700/10">
                                <svg width="14" height="14" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_5_879)">
                                        <path fill="currentColor" d="M29.968 27.791C29.336 24.834 27.726 23.292 25.504 21.888C24.886 21.497 24.114 21.187 23.296 20.858C21.777 20.248 20.056 19.556 19.693 18.413C19.456 17.663 19.763 16.624 20.617 15.307C23.223 11.113 23.689 7.511 22 4.597C20.696 2.344 18.46 1 16.003 1C13.554 1 11.312 2.344 10.006 4.597C8.31799 7.511 8.78399 11.113 11.4 15.321C12.242 16.62 12.549 17.659 12.312 18.407C11.949 19.553 10.223 20.245 8.70099 20.856C7.87999 21.185 7.10499 21.496 6.48799 21.886C4.26499 23.291 2.65499 24.833 2.02299 27.79C1.91399 28.3 2.21499 28.808 2.71399 28.957C2.85499 29 6.28899 29.994 16 30C25.711 29.994 29.136 29 29.277 28.958C29.776 28.809 30.077 28.301 29.968 27.791Z" />
                                    </g>
                                    <defs><clipPath id="clip0_5_879">  <rect width="32" height="32" fill="white" /></clipPath></defs>
                                </svg>
                                Your Profile
                            </a>
                        </MenuItem>

                        <MenuItem>
                            <div className='w-full flex justify-start items-center px-4 py-2 text-sm text-white/80 hover:text-white data-[focus]:bg-zinc-700/10'>
                                <FarcasterShare message='Check out' embeds={[""]} customClass='w-full flex justify-start items-center'>
                                    <div className='w-full flex justify-start items-center gap-2'>
                                        <svg width="14" height="14" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className='-translate-x-0.5'>
                                            <path fill="currentColor" d="M31.8719 25.0002C29.9687 25.0002 28.2451 25.7747 27.0012 27.026L14.9956 20.7089C15.0021 20.5613 15.0027 20.6948 14.9956 20.5416L27.918 13.7424C29.0374 14.5321 30.3985 15.0002 31.8719 15.0002C35.6695 15.0002 38.7505 11.9204 38.7505 8.12399C38.7505 4.32637 35.6695 1.25024 31.8719 1.25024C27.8409 1.25024 24.8608 4.68649 25.0054 8.21312L12.0842 15.0112C10.9636 14.2196 9.59886 13.7502 8.12186 13.7502C4.32661 13.7502 1.25049 16.8264 1.25049 20.624C1.25049 24.4204 4.32661 27.5002 8.12186 27.5002C9.59761 27.5002 10.9624 27.0309 12.083 26.2386L25.1152 33.096C25.6914 36.3089 28.4941 38.7502 31.8719 38.7502C35.6695 38.7502 38.7505 35.6704 38.7505 31.874C38.7505 28.0764 35.6695 25.0002 31.8719 25.0002Z" />
                                        </svg>
                                        Share
                                    </div>
                                </FarcasterShare>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <button onClick={() => { signOut() }} className="w-full flex justify-start items-center px-4 py-2 text-sm text-red-300/80 hover:text-red-300 data-[focus]:bg-zinc-700/10">
                                Sign out
                            </button>
                        </MenuItem>
                    </MenuItems>
                </Menu >
            }
        </AuthKitProvider>
    )
}