import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
    isEditMode?: boolean;
}

export function Logo({ isEditMode = false }: LogoProps) {
    return (
        <Link href="/" className="block">
            <div
                className={`w-32 h-8 overflow-hidden hover:opacity-90 transition-opacity ${isEditMode ? 'opacity-50' : ''}`}
            >
                <div className="w-full h-full flex items-center justify-center">
                    <Image
                        src="/images/goopa-char-outlined-logo.png"
                        alt="GOOPA Logo"
                        layout="intrinsic"
                        width={250}
                        height={120}
                        className={`w-full h-full object-contain transition-all duration-300 ${isEditMode ? 'filter blur-[1px]' : ''}`}
                        priority
                    />
                </div>
            </div>
            {isEditMode && (
                <div className="absolute top-[30%] left-[5.3%] bg-transparent border-x-2 border-green-500 text-green-500 px-2 py-1 rounded-md text-xs font-bold">
                    <span className="neon-text-outline">Edit mode</span>
                </div>
            )}
        </Link>
    );
}
