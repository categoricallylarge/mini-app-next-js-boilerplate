import { useAuthContext } from '@/context/AuthContext'
import Link from 'next/link'
import { ReactNode } from 'react'

interface ShareButtonProps {
    message: string,
    embeds?: string[]
    customClass?: string
    children?: ReactNode
}

const shareButton = "inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#5B3FA0] to-[#8667D2] text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-150 ease-in-out transform hover:scale-105 active:scale-100"

export default function FarcasterShare({ message, embeds, customClass, children }: ShareButtonProps) {
    const { isMini } = useAuthContext()

    const encodedText = encodeURIComponent(message)
    const embedURL = encodeURIComponent(embeds?.[0] || "")

    const shareCast = async () => {
        window.parent.postMessage({
            type: "createCast",
            data: {
                cast: {
                    parent: "0x",
                    text: message,
                    embeds: embeds || [""]
                }
            }
        }, "*")
    }

    const buttonContent = (
        <>
            {children || (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                    Share on Farcaster
                </>
            )}
        </>
    )

    return (
        <>
            {!isMini ? (
                <Link href={`https://warpcast.com/~/compose?text=${encodedText}&embeds[]=${embedURL}`} target="_blank" className={`${customClass || shareButton}`}>
                    {buttonContent}
                </Link>
            ) : (
                <button className={`${customClass || shareButton}`} onClick={shareCast}>
                    {buttonContent}
                </button>
            )}
        </>
    )
}