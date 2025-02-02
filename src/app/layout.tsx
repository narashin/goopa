import './globals.css';
import 'react-toastify/dist/ReactToastify.css';

import React from 'react';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { Goopa } from '../components/pages/Goopa';
import { AppProvider } from '../contexts/AppContext';
import { UserProvider } from '../contexts/UserContext';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'GOOPA',
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
                <UserProvider>
                    <AppProvider>
                        <Goopa>{children}</Goopa>
                    </AppProvider>
                </UserProvider>
            </body>
        </html>
    );
}
