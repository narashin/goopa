'use client';

import React from 'react';

import { NavigationProvider } from '../../contexts/NavigationContext';
import { LaptopFrame } from '../layout/LaptopFrame';
import { TopNav } from '../layout/TopNav';

export function Goopa({ children }: { children: React.ReactNode }) {
    return (
        <NavigationProvider>
            <div className="h-screen fixed inset-0 bg-gradient-to-b from-gray-900 to-black p-8">
                <LaptopFrame>
                    <div className="h-full flex flex-col bg-[#1a1b26]">
                        <TopNav />
                        {children}
                    </div>
                </LaptopFrame>
            </div>
        </NavigationProvider>
    );
}

export default React.memo(Goopa);
