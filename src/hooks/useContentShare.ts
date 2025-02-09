'use client';

import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

interface UseContentShareReturn {
    isContentShared: boolean;
}

export function useContentShare(): UseContentShareReturn {
    const [isContentShared, setIsContentShared] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const checkIsContentShared = () => {
            const isSharePath = pathname?.startsWith('/share/');
            setIsContentShared(isSharePath);
        };

        checkIsContentShared();
    }, [pathname]);

    return { isContentShared };
}
