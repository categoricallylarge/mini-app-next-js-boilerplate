import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import CryptoJS from 'crypto-js'

//NOTE - you might want to remove the console logs in production

/*
  Handle the POST request, validates the Farcaster message,
  Create an auth link, and respond with the necessary form of metadata
*/

export async function POST(req: NextRequest) {
  const data = await req.json()
  console.log("[launcher route.ts] - Received data:", data)

  try {
    // Validate the trustedData.messageBytes using Neynar API
    console.log("[launcher route.ts] - Attempting to validate Farcaster message")
    const validationResult = await validateFarcasterMessage(data.trustedData.messageBytes)

    if (!validationResult.valid) {
      console.log("[launcher route.ts] - Validation failed")
      return NextResponse.json({ error: 'User validation failed' }, { status: 400 })
    }

    // Once validation is successful, create an auth link 
    // Encrypt the data.trustedData.messageBytes using AES encryption to prevent injection attacks
    var cipheredBytes = CryptoJS.AES.encrypt(data.trustedData.messageBytes, `${process.env.AUTH_ENCRYPTION_KEY}`)?.toString()
    const cleanedBytes = cipheredBytes.replace(/\+/g, 'p1L2u3S').replace(/\//g, 's1L2a3S4h').replace(/=/g, 'e1Q2u3A4l')
    const authLink = `${process.env.NEXT_PUBLIC_URL}/auth/?key=${cleanedBytes}&mini=${true}`

    console.log("[launcher route.ts] - Auth link created:", authLink)

    // Return the success response with the auth link
    console.log("[launcher route.ts] - Returning success response")
    return NextResponse.json({ type: "form", title: `${process.env.NEXT_PUBLIC_APP_NAME}`, url: authLink, }, { status: 200 })

  } catch (error: any) {
    // Return a fallback error response
    console.log(`[launcher route.ts] - Error in launcher:`, error?.response ? error.response.data : error.message)
    return NextResponse.json({ type: "form", title: "Error", url: `${process.env.NEXT_PUBLIC_URL}`, }, { status: 500 })
  }
}

/*
  Handle the GET request, return metadata about the mini-app
*/
export async function GET() {
  return NextResponse.json(
    {
      type: "composer",
      name: `${process.env.NEXT_PUBLIC_APP_NAME}`,
      icon: "zap",
      description: `${process.env.NEXT_PUBLIC_APP_DESCRIPTION_SHORT}`,
      aboutUrl: `${process.env.NEXT_PUBLIC_URL}`,
      imageUrl: `${process.env.NEXT_PUBLIC_URL}/imgUrl.png`,
      action: {
        type: "post",
      },
    },
    { status: 200 }
  )
}

/**
  Validate the Farcaster message by sending it to the Neynar API
*/
async function validateFarcasterMessage(messageBytes: string) {
  const options = {
    method: "POST",
    url: "https://api.neynar.com/v2/farcaster/frame/validate",
    headers: {
      accept: "application/json",
      api_key: process.env.NEYNAR_API_KEY,
      "content-type": "application/json",
    },
    data: {
      message_bytes_in_hex: messageBytes,
      cast_reaction_context: true,
      follow_context: false,
      signer_context: false,
      channel_follow_context: false,
    },
  }

  const response = await axios.request(options)
  return response.data
}