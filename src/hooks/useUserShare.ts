'use client';

import { useEffect, useState } from 'react';

import type { AuthenticatedUserData } from '../types/user';
import { useAuth } from './useAuth';

interface UseUserShareReturn {
    isUserShared: boolean;
    isAnonymous: boolean;
}

export function useUserShare(): UseUserShareReturn {
    const [isUserShared, setIsUserShared] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(true);
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            setIsAnonymous(user.isAnonymous);
            if (!user.isAnonymous) {
                setIsUserShared(
                    (user as AuthenticatedUserData).isShared || false
                );
            } else {
                setIsUserShared(false);
            }
        } else {
            setIsAnonymous(true);
            setIsUserShared(false);
        }
    }, [user, loading]);

    return { isUserShared, isAnonymous };
}
