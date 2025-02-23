'use client';
import React, { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { Transition } from '@headlessui/react';

import { Card } from '../../../../components/ui/Card';

export default function RedirectToHome() {
    const router = useRouter();

    useEffect(() => {
        const pathParts = window.location.pathname.split('/');
        if (pathParts.length >= 4) {
            const [, , userId, shareId] = pathParts;
            router.replace(`/share/${userId}/${shareId}/home`);
        }
    }, [router]);

    return (
        <div className="flex-1 p-4">
            <Card className="h-full bg-[#C5C6BD] border-white/10 backdrop-blur-sm overflow-hidden">
                <Transition
                    show={true}
                    enter="transition-opacity duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                >
                    <div className="relative w-full h-full flex flex-col items-center justify-center gap-4">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                        <div className="text-center">
                            <h2 className="text-lg font-semibold text-primary">
                                Redirecting
                            </h2>
                            <p className="text-sm text-muted-foreground mt-2">
                                Please wait...
                            </p>
                        </div>
                    </div>
                </Transition>
            </Card>
        </div>
    );
}
