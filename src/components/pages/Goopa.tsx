'use client';

import React, { useEffect } from 'react';

import { ToastContainer } from 'react-toastify';

import { NavigationProvider } from '../../contexts/NavigationContext';
import { ShareProvider } from '../../contexts/ShareContext';
import { TooltipProvider } from '../../contexts/TooltipContext';
import { handleGoogleRedirect } from '../../lib/auth';
import { LaptopFrame } from '../layout/LaptopFrame';
import { TopNav } from '../layout/TopNav';

export function Goopa({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        handleGoogleRedirect();
    }, []);

    return (
        <NavigationProvider>
            <TooltipProvider>
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
            </TooltipProvider>
        </NavigationProvider>
    );
}

export default React.memo(Goopa);
