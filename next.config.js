const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'images.stockcake.com',
            },
            {
                protocol: 'https',
                hostname: '*.public.blob.vercel-storage.com',
            },
        ],
    },
};

module.exports = withNextIntl(nextConfig);
