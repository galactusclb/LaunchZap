import path from 'path';

import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const REDIS_CLIENT_URL = process.env.REDIS_CLIENT_URL;

if (!REDIS_CLIENT_URL) {
    console.warn(
        '[cache] REDIS_CLIENT_URL is not set — falling back to Next.js v16 default file-system cache.'
    );
}

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
    /* config options here */
    output: 'standalone',
    cacheComponents: true,
    ...(REDIS_CLIENT_URL && {
        cacheHandlers: {
            default: path.resolve('./src/lib/redis/index.mjs'),
        },
    }),
    reactCompiler: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.cloudfront.net',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '**',
            },
        ],
    },
    headers: () => {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=60, stale-while-revalidate=30',
                    },
                ],
            },
            {
                source: '/_next/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
};

export default withBundleAnalyzer(nextConfig);
