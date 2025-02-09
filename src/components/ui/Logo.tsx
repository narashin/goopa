'use client';
import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuth } from '../../hooks/useAuth';
import { useShare } from '../../hooks/useShare';

interface LogoProps {
    isEditMode?: boolean;
}

export function Logo({ isEditMode = false }: LogoProps) {
    const { user } = useAuth();
    const { shareData } = useShare(user?.uid ?? null);
    const pathname = usePathname();
    const isSharePage = pathname?.startsWith('/share/');

    return (
        <Link href={shareData?.shareUrl || '/'} className="block">
            <div
                className={`w-32 h-8 overflow-hidden hover:opacity-90 transition-opacity ${isEditMode || (!user && isSharePage) ? 'opacity-50' : ''}`}
            >
                <div className="w-full h-full flex items-center justify-center">
                    <div className="w-[250px] h-[120px] relative">
                        <Image
                            src="/images/goopa-char-outlined-logo.png"
                            alt="GOOPA Logo"
                            fill
                            className={`object-contain transition-all duration-300 ${
                                isEditMode ? 'filter blur-[1px]' : ''
                            }`}
                            priority
                        />
                    </div>
                </div>
            </div>
            {isEditMode && (
                <div className="absolute top-[30%] left-[5.3%] bg-transparent border-x-2 border-green-500 text-green-500 px-2 py-1 rounded-md text-xs font-bold">
                    <span className="neon-text-outline">Edit mode</span>
                </div>
            )}
            {isSharePage && (
                <div className="absolute top-[30%] left-[2%] bg-transparent border-x-2 border-blue-500 text-blue-500 px-2 py-1 rounded-md text-xs font-bold">
                    <span className="neon-text-outline-blue">
                        Read Mode for Share
                    </span>
                </div>
            )}
        </Link>
    );
}
