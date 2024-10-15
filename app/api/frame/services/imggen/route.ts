import { NextRequest } from 'next/server'
import { generateImage, generateErrorImage } from './imggen'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fid = searchParams.get('fid')
  
    if (!fid) {
      return new Response('Missing parameter: fid', { status: 400 })
    }

    return await generateImage({ fid })
  } catch (e: any) {
    console.log(`[services imggen.ts] - Error generating image: ${e.message}`)
    return generateErrorImage()
  }
}