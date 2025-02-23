// app/RootLayoutClient.tsx (클라이언트 컴포넌트)
'use client';

import './globals.css';
import 'react-toastify/dist/ReactToastify.css';

import type React from 'react';
import { useEffect, useState } from 'react';

import { ToastContainer } from 'react-toastify';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { LaptopFrame } from '../components/layout/LaptopFrame';
import { TopNav } from '../components/layout/TopNav';
import { NavigationProvider } from '../contexts/NavigationContext';
import { handleGoogleRedirect } from '../lib/auth';
import { AuthProvider } from './providers/AuthProvider';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime:
                process.env.NEXT_PUBLIC_ENV === 'development' ? 5000 : 60000,
        },
    },
});

export default function RootLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
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
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <NavigationProvider>
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
                </NavigationProvider>
            </AuthProvider>
            {ReactQueryDevtools && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    );
}
