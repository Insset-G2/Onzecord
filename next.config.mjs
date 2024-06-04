/** @type {import('next').NextConfig} */
const nextConfig = {
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
