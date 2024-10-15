import NextAuth from "next-auth"
import { authOptions } from "./authOptions"

export const GET = NextAuth(authOptions)
export const POST = NextAuth(authOptions)

//Do not edit