'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { NavigationProvider } from '../../contexts/NavigationContext';
import { LaptopFrame } from '../layout/LaptopFrame';
import { TopNav } from '../layout/TopNav';

export function Goopa({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const handleSearch = (query: string) => {
        if (query.trim() !== '') {
            router.push(`/search?query=${query}`);
        } else {
            router.push('/');
        }
    };
    return (
        <NavigationProvider>
            <div className="h-screen fixed inset-0 bg-gradient-to-b from-gray-900 to-black p-8">
                <LaptopFrame>
                    <div className="h-full flex flex-col bg-[#1a1b26]">
                        <TopNav onSearch={handleSearch} />
                        {children}
                    </div>
                </LaptopFrame>
            </div>
        </NavigationProvider>
    );
}
