'use client';

import type React from 'react';
import { createContext, useEffect, useState } from 'react';

import { useAuth } from '../../hooks/useAuth';
import { getUserShareStatus, ShareGoopaData } from '../../lib/firestore';
import { AuthenticatedUserData } from '../../types/user';

interface ShareContextType {
    isShared: boolean;
    shareHistory: ShareGoopaData[];
    lastShareId: string;
}

interface ShareProviderProps {
    children: React.ReactNode;
}

const ShareProvider: React.FC<ShareProviderProps> = ({ children }) => {
    const [isShared, setIsShared] = useState(false);
    const [shareHistory, setShareHistory] = useState<ShareGoopaData[]>([]);
    const [lastShareId, setLastShareId] = useState('');
    const { user } = useAuth() as { user: AuthenticatedUserData | null };
    const authenticatedUser = user as AuthenticatedUserData | null;

    useEffect(() => {
        const fetchShareStatus = async () => {
            if (
                authenticatedUser &&
                !authenticatedUser.isAnonymous &&
                authenticatedUser.customUserId
            ) {
                try {
                    const shareStatus = await getUserShareStatus(
                        authenticatedUser.customUserId
                    );
                    setIsShared(shareStatus.isShared);
                    setShareHistory(shareStatus.ShareHistory);
                    setLastShareId(shareStatus.lastShareId);
                } catch (error) {
                    console.error('Error loading user share status:', error);
                }
            }
        };

        fetchShareStatus();
    }, [authenticatedUser]); // Removed user from dependencies

    const value: ShareContextType = { isShared, shareHistory, lastShareId };

    return (
        <ShareContext.Provider value={value}>{children}</ShareContext.Provider>
    );
};

const ShareContext = createContext<ShareContextType>({
    isShared: false,
    shareHistory: [],
    lastShareId: '',
});

export { ShareContext, ShareProvider };
