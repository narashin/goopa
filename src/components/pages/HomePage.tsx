import React from 'react';

import Image from 'next/image';

import { Card } from '../../components/ui/Card';

export function HomePage() {
    return (
        <div className="flex-1 p-4">
            <Card className="h-full bg-[#C5C6BD] border-white/10 backdrop-blur-sm overflow-hidden">
                <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                        src="/images/goopa-character-only-logo.png"
                        alt="Start Your Mac Setup"
                        layout="intrinsic"
                        width={300}
                        height={350}
                        priority
                    />
                    <div className="absolute bottom-4 left-4 right-4 text-center">
                        <h1 className="text-4xl font-bold text-white">
                            Start Your Mac Setup
                        </h1>
                        <p className="text-sm text-white/70">
                            {
                                "I've gathered the applications for My personal MacBook setup for now."
                            }
                        </p>
                        <p className="text-xs text-white/70">
                            {
                                ' Additional featureswill be added to allow user-specific settings. 😉'
                            }
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
