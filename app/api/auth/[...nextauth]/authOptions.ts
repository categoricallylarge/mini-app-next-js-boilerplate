import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { NeynarAPIClient } from "@neynar/nodejs-sdk"
import CryptoJS from 'crypto-js'
import { createAppClient, viemConnector } from "@farcaster/auth-client"


export const authOptions: AuthOptions = {
    debug: true, // Enable debug mode for troubleshooting - set to false in production
    providers: [
        /* 
            "Authenticate with MiniApp"
            Authentication via MiniApp using encrypted Farcaster client data
        */
        CredentialsProvider({
            id: "miniApp", //id to be used by the frontend
            name: "Authenticate with MiniApp",
            credentials: {
                key: { label: "Farcaster Signed Message Bytes key", type: "text" },
                csrfToken: { label: "CSRF Token", type: "hidden" },
            },
            async authorize(credentials, req) {
                // Ensure required credentials and CSRF token are present
                if (!credentials || !credentials.key || !credentials.csrfToken) {
                    console.log("[authOptions.ts] - Missing Credentials or CSRF token")
                    return null
                }

                // Validate CSRF token
                const csrfTokenFromRequest = req.headers?.["x-csrf-token"] || req.body?.csrfToken
                if (credentials.csrfToken !== csrfTokenFromRequest) {
                    console.log(`[authOptions.ts] - Invalid CSRF token - Provided CSRF: ${credentials.csrfToken} - Received CSRF: ${csrfTokenFromRequest}`)
                    return null
                }

                // Using the encrypted key from api/launcher, we now have to switch the replaced symbols back to their original form
                // and decrypt the key back to the messageBytes
                const cleanKey = credentials.key.replace(/p1L2u3S/g, '+').replace(/s1L2a3S4h/g, '/').replace(/e1Q2u3A4l/g, '=')
                const decrypt: any = CryptoJS.AES.decrypt(cleanKey, `${process.env.AUTH_ENCRYPTION_KEY}`)
                const signedmessagebytes = decrypt.toString(CryptoJS.enc.Utf8)

                try {
                    // Validate the signedmessagebytes using NeynarAPIClient
                    const neynar = new NeynarAPIClient(process.env.NEYNAR_API_KEY!)
                    const user = await neynar.validateFrameAction(signedmessagebytes, {
                        castReactionContext: false,
                        followContext: false,
                        signerContext: false,
                    })


                    console.log('[authOptions.ts] - Neynar res user:', user)

                    // Check if the timestamp is within the valid window
                    const VALID_FOR = 1
                    const actionTimestamp = new Date(user.action.timestamp)
                    const now = new Date()
                    const timeDifference = (now.getTime() - actionTimestamp.getTime()) / (1000 * 60)

                    if (timeDifference <= VALID_FOR) {
                        const userData = user.action?.interactor

                        if (userData) {
                            // If user data is available, return it to the frontend
                            return {
                                id: userData.fid.toString(),
                                fid: userData.fid.toString(),
                                pfpUrl: userData.pfp_url ?? "",
                                username: userData.username ?? "",
                                displayName: userData?.display_name ?? "",
                                bio: userData?.profile?.bio?.text ?? "",
                                verifications: userData?.verifications as `0x${string}`[] ?? [],
                                timestamp: Date.now()
                            }
                        }
                        else {
                            console.log(`[authOptions.ts] - user object NOT FOUND`)
                            return null
                        }
                    } else {
                        console.log("[authOptions.ts] - Error: The action timestamp is outside the valid time window.")
                        return null
                    }

                } catch (error) {
                    console.log("[authOptions.ts] - Error in Farcaster Frame authorization:", error)
                    return null
                }
            },
        }),

        /* 
            "Sign in with Farcaster QR"
            Authenticate by scanning QR code and signing in via Farcaster client
        */
        CredentialsProvider({
            id: "farcasterQR", // id to be used by the frontend
            name: "Sign in with Farcaster QR",
            credentials: {
                message: { label: "Message", type: "text" },
                signature: { label: "Signature", type: "text" },
            },
            async authorize(credentials, req) {
                try {
                    // Ensure that credentials are present
                    if (!credentials) {
                        console.log("[authOptions.ts] - No credentials provided")
                        return null
                    }

                    const csrfToken = req.headers?.["x-csrf-token"] || req.body?.csrfToken
                    if (!csrfToken) {
                        console.log(`[authOptions.ts] - Invalid CSRF token - Provided CSRF: ${csrfToken}`)
                        return null
                    }

                    // Use app client to verify the sign-in message with the signature
                    const appClient = createAppClient({ ethereum: viemConnector() })
                    const verifyResponse = await appClient.verifySignInMessage({
                        message: credentials?.message as string,
                        signature: credentials?.signature as `0x${string}`,
                        domain: `${process.env.NEXT_PUBLIC_URL_SHORT}`,
                        nonce: csrfToken,
                    })

                    const { success, fid } = verifyResponse

                    if (!success) {
                        console.log("[authOptions.ts] - Verifying message was NOT successful")
                        return null
                    }

                    // Fetch the user's details using the verified FID
                    const neynar = new NeynarAPIClient(process.env.NEYNAR_API_KEY!)
                    const user = await neynar.fetchBulkUsers([fid])

                    const userData = user.users[0]

                    // If user data is available, return it to the frontend
                    if (userData) {
                        return {
                            id: userData.fid.toString(),
                            fid: userData.fid.toString(),
                            pfpUrl: userData.pfp_url ?? "",
                            username: userData.username ?? "",
                            displayName: userData?.display_name ?? "",
                            bio: userData?.profile?.bio?.text ?? "",
                            verifications: userData?.verifications as `0x${string}`[] ?? [],
                            timestamp: Date.now()
                        }
                    }
                    else {
                        console.log(`[authOptions.ts] - user object NOT FOUND`)
                        return null
                    }
                } catch (error) {
                    console.log("[authOptions.ts] - Error in Farcaster QR authorization:", error)
                    return null
                }
            },
        })
    ],
    callbacks: {
        async jwt({ token, user }) {

            if (user) {
                // Encrypt the user object, so the cipheredParams can be used to call the backend safely without the worry of data injection
                var cipheredParams = CryptoJS.AES.encrypt(JSON.stringify(user), `${process.env.AUTH_ENCRYPTION_KEY}`)?.toString()

                // Assign user details to the token
                token.fid = user.fid
                token.pfpUrl = user.pfpUrl
                token.username = user.username
                token.displayName = user.displayName
                token.bio = user.bio
                token.cipheredParams = cipheredParams
                token.verifications = user.verifications
            }
            return token
        },
        async session({ session, token }) {
            // Pass token data to the session
            session.user.fid = token.fid as string
            session.user.pfpUrl = token.pfpUrl as string
            session.user.username = token.username as string
            session.user.displayName = token.displayName as string
            session.user.bio = token.bio as string
            session.cipheredParams = token.cipheredParams as string
            session.verifications = token.verifications as `0x${string}`[]

            return session
        },
    },
    cookies: {
        sessionToken: {
            name: "__Secure-next-auth.session-token",
            options: {
                httpOnly: true,
                sameSite: "none",
                path: "/",
                secure: true,
            },
        },
        csrfToken: {
            name: "__Secure-next-auth.csrf-token",
            options: {
                httpOnly: true,
                sameSite: "none",
                secure: true,
            },
        },
    },
}
