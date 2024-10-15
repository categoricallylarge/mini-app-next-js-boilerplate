/** @type {import('next').NextConfig} */
const nextConfig = {
    //NOTE - a simple way to allow all images to be used by Next.js - you can modify this to only allow certain images if you want
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
            {
                protocol: "http",
                hostname: "**",
            }
        ],
    },
}

export default nextConfig