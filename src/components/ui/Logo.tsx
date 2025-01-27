import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
    return (
        <Link href="/" className="block">
            <div className="w-32 h-8 overflow-hidden hover:opacity-90 transition-opacity">
                <div className="w-full h-full flex items-center justify-center">
                    <Image
                        src="/images/goopa-logo.png"
                        alt="GOOPA Logo"
                        width={128}
                        height={32}
                        className="w-full h-full object-contain"
                        priority
                    />
                </div>
            </div>
        </Link>
    );
}
