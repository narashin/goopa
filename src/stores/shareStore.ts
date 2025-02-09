import { create } from 'zustand';

import type { ShareGoopaData } from '../lib/firestore';

interface ShareState {
    isShared: boolean;
    shareUrl: string;
    lastShareId: string | null;
    isShareMode: boolean;
    shareHistory: ShareGoopaData[];
    setIsShared: (isShared: boolean) => void;
    setShareUrl: (url: string) => void;
    setLastShareId: (id: string | null) => void;
    setShareMode: (mode: boolean) => void;
    setShareHistory: (history: ShareGoopaData[]) => void;
}

export const useShareStore = create<ShareState>((set) => ({
    isShared: false,
    shareUrl: '',
    lastShareId: null,
    isShareMode: false,
    shareHistory: [],
    setIsShared: (isShared) =>
        set((state) => {
            if (state.isShared !== isShared) {
                return { isShared };
            }
            return state;
        }),
    setShareUrl: (shareUrl) =>
        set((state) => {
            if (state.shareUrl !== shareUrl) {
                return { shareUrl };
            }
            return state;
        }),
    setLastShareId: (lastShareId) =>
        set((state) => {
            if (state.lastShareId !== lastShareId) {
                return { lastShareId };
            }
            return state;
        }),
    setShareMode: (isShareMode) =>
        set((state) => {
            if (state.isShareMode !== isShareMode) {
                return { isShareMode };
            }
            return state;
        }),
    setShareHistory: (shareHistory) =>
        set((state) => {
            if (
                JSON.stringify(state.shareHistory) !==
                JSON.stringify(shareHistory)
            ) {
                return { shareHistory };
            }
            return state;
        }),
}));
