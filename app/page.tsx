'use client'

import PageWrapper from "@/components/layout/PageWrapper"
import SIFC from "@/components/SIFC"
import FarcasterShare from "@/components/FarcasterShare"
import { useUserContext } from "@/context/UserContext"

export default function Home() {
  const { userProfile } = useUserContext()

  return (
    <PageWrapper >
      <div className="w-full h-full flex justify-start items-center flex-col px-6 gap-2">
        <div className="w-full h-full flex flex-col justify-center items-center gap-4">

          {userProfile &&
            <>
              <h1 className="text-xl max-w-xs font-black text-black text-center mt-32">YOU ARE SUCCESSFULLY LOGGED IN</h1>
              <SIFC />
              <FarcasterShare message="Check out this awesome app!" embeds={[process.env.NEXT_PUBLIC_URL || ""]}>
                <span className="text-white">Share on Farcaster</span>
              </FarcasterShare>
            </>
          }

        </div>
      </div>
    </PageWrapper>
  )
}