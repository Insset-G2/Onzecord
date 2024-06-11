/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverMinification: false,
    },
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                hostname: "avatar.vercel.sh",
            },
        ],
    },
};

export default nextConfig;
