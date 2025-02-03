// app/share/[userId]/[publishId]/page.tsx
'use client';
import React, { useEffect } from 'react';

import { useRouter } from 'next/navigation';

export default function RedirectToHome() {
    const router = useRouter();

    useEffect(() => {
        const pathParts = window.location.pathname.split('/');
        if (pathParts.length >= 4) {
            const [, , userId, publishId] = pathParts;
            router.replace(`/share/${userId}/${publishId}/home`);
        }
    }, [router]);

    return <div>Redirecting...</div>;
}
