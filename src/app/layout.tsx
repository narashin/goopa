'use client';

import './globals.css';
import 'react-toastify/dist/ReactToastify.css';

import type React from 'react';
import { useEffect, useState } from 'react';

import { Azeret_Mono as Geist_Mono, Geist } from 'next/font/google';
import { ToastContainer } from 'react-toastify';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { LaptopFrame } from '../components/layout/LaptopFrame';
import { TopNav } from '../components/layout/TopNav';
import { NavigationProvider } from '../contexts/navigationContext';
import { ShareProvider } from '../contexts/shareContext';
import { handleGoogleRedirect } from '../lib/auth';
import { AuthProvider } from './providers/AuthProvider';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime:
                process.env.NEXT_PUBLIC_ENV === 'development' ? 5000 : 60000,
        },
    },
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [ReactQueryDevtools, setReactQueryDevtools] =
        useState<React.ComponentType<{ initialIsOpen?: boolean }> | null>(null);

    useEffect(() => {
        handleGoogleRedirect();

        if (process.env.NODE_ENV === 'development') {
            import('@tanstack/react-query-devtools').then((module) => {
                setReactQueryDevtools(() => module.ReactQueryDevtools);
            });
        }
    }, []);

    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <NavigationProvider>
                            <ShareProvider>
                                <div className="h-screen fixed inset-0 bg-gradient-to-b from-gray-900 to-black p-8">
                                    <LaptopFrame>
                                        <div className="h-full flex flex-col bg-[#1a1b26]">
                                            <TopNav />
                                            {children}
                                        </div>
                                    </LaptopFrame>
                                </div>
                                <ToastContainer
                                    position="bottom-right"
                                    autoClose={3000}
                                    hideProgressBar={false}
                                    newestOnTop={false}
                                    closeOnClick
                                    rtl={false}
                                    pauseOnFocusLoss
                                    draggable
                                    pauseOnHover
                                    theme="dark"
                                    className="styled-toast-container"
                                    toastClassName="styled-toast"
                                />
                            </ShareProvider>
                        </NavigationProvider>
                    </AuthProvider>
                    {ReactQueryDevtools && (
                        <ReactQueryDevtools initialIsOpen={false} />
                    )}
                </QueryClientProvider>
            </body>
        </html>
    );
}
