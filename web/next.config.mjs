/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    typescript: {
        ignoreBuildErrors: true,
    },
    devIndicators: {
        appIsrStatus: false,
        buildActivity: false,
    },
};

export default nextConfig;
