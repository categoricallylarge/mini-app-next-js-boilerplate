import Link from "next/link"

export default function Notfound() {
  return (
    <>
      <div className="w-[100dvw] h-[100dvh] flex flex-col justify-center items-center bg-slate-50">
        <div className="w-full h-full z-[50] flex flex-col justify-center items-center px-6">
          <div className="relative bg-slate-700 w-full max-w-lg rounded-[32px] p-6 flex flex-col text-white overflow-hidden">
            <div className="relative z-[10] w-full h-full flex flex-col justify-between gap-2">
              <div className="flex flex-col justify-start gap-2">
                <h2 className="font-black text-2xl">PAGE NOT FOUND</h2>
                <p className="font-medium">
                  This page does not exist. Please return home.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link href="/" className="w-full rounded-xl bg-slate-950 flex justify-center items-center gap-1 p-3 px-4">
                  <p className="font-medium">Return Home</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}