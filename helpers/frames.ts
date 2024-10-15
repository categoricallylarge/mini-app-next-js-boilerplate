export async function fetchUser(fid: number): Promise<any> {
  const url = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`
  const options = {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'api_key': process.env.NEYNAR_API_KEY || ''
    }
  }

  try {
    const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data.users[0]
  } catch (error) {
    console.log('[helpers frames.ts] - Error fetching user:', error)
    return null
  }
}

export async function validateWithNeynar(messageBytes: string): Promise<any> {
  const requestBody = {
    cast_reaction_context: true,
    follow_context: false,
    signer_context: false,
    channel_follow_context: false,
    message_bytes_in_hex: messageBytes
  }
  console.log('[helpers frames.ts] - Neynar request body:', requestBody)

  const response = await fetch('https://api.neynar.com/v2/farcaster/frame/validate', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api_key': process.env.NEYNAR_API_KEY || '',
      'content-type': 'application/json'
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.log('[helpers frames.ts] - Neynar API response:', response.status, response.statusText, errorBody)
    throw new Error(`Neynar API error: ${response.status} ${response.statusText}. Body: ${errorBody}`)
  }

  return response.json()
}

export async function createFrame(params: string) {
  return `<!DOCTYPE html><html><head>
    <meta property="fc:frame" content="vNext" />
    ${params}
    <meta property="fc:frame:image:aspect_ratio" content="1:1" />
    </head></html>`
}