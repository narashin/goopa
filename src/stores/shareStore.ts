import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface ShareState {
    isShared: boolean;
    shareUrl: string;
    lastShareId: string | null;
    isShareMode: boolean;
    setIsShared: (isShared: boolean) => void;
    setShareUrl: (url: string) => void;
    setLastShareId: (id: string | null) => void;
}

export const useShareStore = create(
    subscribeWithSelector<ShareState>((set, get) => ({
        isShared: false,
        shareUrl: '',
        lastShareId: null,
        isShareMode: false,
        setIsShared: (isShared) => {
            if (get().isShared !== isShared) set({ isShared });
        },
        setShareUrl: (shareUrl) => {
            if (get().shareUrl !== shareUrl) set({ shareUrl });
        },
        setLastShareId: (lastShareId) => {
            if (get().lastShareId !== lastShareId) set({ lastShareId });
        },
    }))
);
