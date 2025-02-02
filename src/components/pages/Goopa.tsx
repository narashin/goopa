'use client';

import React, { useEffect } from 'react';

import { ToastContainer } from 'react-toastify';

import { NavigationProvider } from '../../contexts/NavigationContext';
import { TooltipProvider } from '../../contexts/TooltipContext';
import { useAuth } from '../../hooks/useAuth';
import { useShareHandler } from '../../hooks/useShareHandler';
import { handleGoogleRedirect } from '../../lib/auth';
import { LaptopFrame } from '../layout/LaptopFrame';
import { TopNav } from '../layout/TopNav';

export function Goopa({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const { isPublished } = useShareHandler(user);

    useEffect(() => {
        handleGoogleRedirect();
    }, []);

    return (
        <NavigationProvider>
            <TooltipProvider>
                <div className="h-screen fixed inset-0 bg-gradient-to-b from-gray-900 to-black p-8">
                    <LaptopFrame isPublished={isPublished}>
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
            </TooltipProvider>
        </NavigationProvider>
    );
}

export default React.memo(Goopa);
