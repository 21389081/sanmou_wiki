import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        minimumCacheTTL: 2678400,
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.supabase.co',
            },
        ],
    },
};

export default nextConfig;
