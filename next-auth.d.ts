import NextAuth, { DefaultSession } from "next-auth"

// This is our User object
interface UserBase {
    fid: string
    pfpUrl: string
    username: string
    displayName: string
    bio: string
    verifications: `0x${string}`[]
}

declare module "next-auth" {
    interface User extends UserBase {
        timestamp: number
    }

    interface Session {
        user: UserBase & DefaultSession["user"]
        cipheredParams: string
        verifications: `0x${string}`[]
    }

    interface JWT extends UserBase {
        cipheredParams: string
    }
}
