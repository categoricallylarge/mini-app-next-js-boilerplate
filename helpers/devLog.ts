export const devLog = async (loc: string, log: string, val: any) => {
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === "development") {
        console.log(`DEV: [${loc}] ${log}`, val)
    }
}