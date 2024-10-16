import { Inter } from "next/font/google"
import "./globals.css"
import CustomAuthWrapper from "./(AppWrap)/CustomAuthWrapper"
import UserContextProvider from "@/context/UserContext"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en">
      <head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
        <meta name="description" content={process.env.NEXT_PUBLIC_APP_DESCRIPTION} />
        <link rel="icon" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover' />
        <meta name="theme-color" content="#724DBD" />

        {/* //NOTE - here are the initial buttons */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image:aspect_ratio" content="1:1" />
        <meta name="fc:frame:image" content={`${process.env.NEXT_PUBLIC_URL}/miniappscover.png`} />
        <meta name="fc:frame:button:1" content="Build" />

        {/* <meta name="fc:frame:button:1:post_url" content={`${process.env.NEXT_PUBLIC_URL}/api/frame/home`} /> */}
        <meta name="fc:frame:button:1:action" content="link" />
        <meta name="fc:frame:button:1:target" content="https://github.com/categoricallylarge/mini-app-next-js-boilerplate" />
        <meta name="fc:frame:button:2" content="Launch (requires approval)" />
        <meta name="fc:frame:button:2:action" content="link" />
        <meta name="fc:frame:button:2:target" content={`https://warpcast.com/~/composer-action?url=https%3A%2F%2F${process.env.NEXT_PUBLIC_URL_SHORT}%2Fapi%2Flauncher`} />

        {/* //NOTE - twitter meta tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content={`${process.env.NEXT_PUBLIC_URL}`} />
        <meta name="twitter:title" content={process.env.NEXT_PUBLIC_APP_NAME} />
        <meta name="twitter:description" content={process.env.NEXT_PUBLIC_APP_DESCRIPTION} />
        <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_URL}/og.png`} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={process.env.NEXT_PUBLIC_APP_NAME} />
        <meta property="og:description" content={process.env.NEXT_PUBLIC_APP_DESCRIPTION} />
        <meta property="og:site_name" content={process.env.NEXT_PUBLIC_APP_NAME} />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_URL}`} />
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_URL}/og.png`} />
      </head>

      <body className={`${inter.className} w-[100dvw] h-[100dvh] overflow-hidden flex flex-col justify-center items-center bg-slate-300 `}>
        <CustomAuthWrapper>
          <UserContextProvider>
            {children}
          </UserContextProvider>
        </CustomAuthWrapper>
      </body>
    </html>
  )
}