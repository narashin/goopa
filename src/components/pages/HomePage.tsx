'use client';
import React from 'react';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { Card } from '../../components/ui/Card';
import { useAuth } from '../../hooks/useAuth';
import { useUserByCustomUserId } from '../../queries/authQueries';

export function HomePage() {
    const { user } = useAuth();
    const pathname = usePathname();

    const isSharePage = pathname.startsWith('/share/');

    const pathSegments = pathname.split('/');
    const customUserId = pathSegments[2];

    const { data: sharedUser, isLoading } = useUserByCustomUserId(customUserId);

    const getGreeting = () => {
        if (
            isSharePage &&
            customUserId &&
            sharedUser &&
            'displayName' in sharedUser
        ) {
            if (isLoading) {
                return 'Loading...'; // 로딩 중 표시
            }
            return `${sharedUser?.displayName}'s Goopa!`;
        }

        if (user && 'displayName' in user) {
            return `Hello, ${user.displayName}!`;
        }

        return 'Start Your Personal Setup!';
    };

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
                            {getGreeting()}
                        </h1>
                        <p className="text-sm text-white/70">
                            {
                                'Show off your personal setup apps by customizing them! 😏'
                            }
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
