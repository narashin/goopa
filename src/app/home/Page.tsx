import React from 'react';

import Image from 'next/image';

import { Card } from '../../components/ui/Card';

export function Home() {
    return (
        <div className="flex-1 p-4">
            <Card className="h-full bg-black/20 border-white/10 backdrop-blur-sm overflow-hidden">
                <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                        src="/images/goopa-main.png"
                        alt="Start Your Mac Setup Quest"
                        width={800}
                        height={450}
                        className="rounded-lg shadow-2xl"
                        priority
                    />
                </div>
            </Card>
        </div>
    );
}
