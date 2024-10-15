import { fetchUser } from '@/helpers/frames'
import { ImageResponse } from 'next/og'

interface GenerateImageParams {
  fid: string
}
/*
  This function generates a custom image for Farcaster frames.

  Fetches user data from the Farcaster API using the FID
  Processes the user's profile picture URL for optimal display
  Constructs a custom image using Next.js ImageResponse
  Returns the generated image for use in a Farcaster frame
*/

export async function generateImage({ fid }: GenerateImageParams): Promise<ImageResponse> {
  const user = await fetchUser(parseInt(fid))
  if (!user) {
    throw new Error('Failed to fetch user data')
  }

  const username = user.username
  let pfpUrl = user.pfp_url

  // Modify URL based on the image host
  if (pfpUrl.includes("imagedelivery.net")) {
    pfpUrl = pfpUrl.replace(/\/[^/]+$/, '') + "/w=768,anim=false"
  } else if (pfpUrl.includes("imgur.com")) {
    pfpUrl = "https://wrpcd.net/cdn-cgi/image/anim=false/" + pfpUrl
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontSize: 42,
          color: "white",
          background: "black",
          width: "600px",
          height: "600px",
          padding: "0px 0px",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
        </div>
        <img
          src={pfpUrl}
          width={260}
          height={260}
          style={{
            position: "absolute",
            zIndex: 10,
            left: '50%',
            top: '47%',
            transform: 'translate(-50%, -50%)',
            width: "260px",
            height: "260px",
            borderRadius: "50%",
            boxShadow: "0 0 0 3px #E4428E",
            objectFit: "cover",
          }}
        />
        <p
          style={{
            position: "absolute",
            zIndex: 10,
            bottom: "58px",
            left: "33%",
            color: "#fff",
            fontSize: "18px",
            fontWeight: 400,
            fontFamily: "Pixle_Font",
            width: "100%",
          }}
        >username: {username}</p>
      </div>
    ),
    {
      width: 600,
      height: 600,
    }
  )
}

export function generateErrorImage(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontSize: 42,
          color: "white",
          background: "black",
          width: "600px",
          height: "600px",
          padding: "0px 0px",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <p>Error generating image</p>
      </div>
    ),
    {
      width: 600,
      height: 600,
    }
  )
}