import React from 'react';

import { Metadata } from 'next';
import { Azeret_Mono as Geist_Mono, Geist } from 'next/font/google';

import RootLayoutClient from './RootLayoutClient';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: {
        default: 'Goopa',
        template: '%s | Goopa',
    },
    description: 'What is your must install app?',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <RootLayoutClient>{children}</RootLayoutClient>
            </body>
        </html>
    );
}
