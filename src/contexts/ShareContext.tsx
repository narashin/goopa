'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useMemo } from 'react';

import { usePathname } from 'next/navigation';

import { useAuth } from '../hooks/useAuth';
import { useShare } from '../hooks/useShare';
import type { ShareGoopaData } from '../lib/firestore';
import { useShareStore } from '../stores/shareStore';

interface ShareContextType {
    isShared: boolean;
    shareUrl: string;
    lastShareId: string | null;
    isShareMode: boolean;
    shareHistory: ShareGoopaData[];
    handleShare: (uid: string) => Promise<void>;
    handleUnshare: (uid: string) => Promise<void>;
}

const ShareContext = createContext<ShareContextType | undefined>(undefined);

export function ShareProvider({ children }: { children: React.ReactNode }) {
    const { user, isEditMode } = useAuth();
    const pathname = usePathname();
    const shareStore = useShareStore();
    const {
        isShared,
        shareUrl,
        lastShareId,
        shareData,
        handleShare,
        handleUnshare,
    } = useShare(user?.uid || null);

    const isShareMode = useMemo(
        () => Boolean(pathname?.startsWith('/share/') && !isEditMode),
        [pathname, isEditMode]
    );

    useEffect(() => {
        shareStore.setShareMode(isShareMode);
    }, [isShareMode, shareStore]);

    useEffect(() => {
        if (shareData) {
            shareStore.setShareHistory(shareData.shareHistory || []);
        }
    }, [shareData, shareStore]);

    const contextValue = useMemo(
        () => ({
            isShared,
            shareUrl,
            lastShareId,
            isShareMode,
            shareHistory: shareStore.shareHistory,
            handleShare,
            handleUnshare,
        }),
        [
            isShared,
            shareUrl,
            lastShareId,
            isShareMode,
            shareStore.shareHistory,
            handleShare,
            handleUnshare,
        ]
    );

    return (
        <ShareContext.Provider value={contextValue}>
            {children}
        </ShareContext.Provider>
    );
}

export function useShareContext() {
    const context = useContext(ShareContext);
    if (context === undefined) {
        throw new Error('useShareContext must be used within a ShareProvider');
    }
    return context;
}
