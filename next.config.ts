import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        domains: [
            'firebasestorage.googleapis.com',
            'lh3.googleusercontent.com',
            'goopa.s3.amazonaws.com',
        ],
    },
    reactStrictMode: true,
    env: {
        NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
            process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        NEXT_PUBLIC_FIREBASE_PROJECT_ID:
            process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
            process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
            process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:
            process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    },
};
module.exports = nextConfig;
