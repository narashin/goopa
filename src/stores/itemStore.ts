import { create } from 'zustand';

import { updateUserShareStatus } from '../lib/firestore/users';

interface ItemState {
    isEditMode: boolean;
    isShared: boolean;
    setIsEditMode: (isEditMode: boolean, userId?: string) => void;
    toggleEditMode: () => void;
    setIsShared: (isShared: boolean, userId?: string) => Promise<void>;
}

export const useItemStore = create<ItemState>((set) => ({
    isEditMode: false,
    isShared: false,
    setIsEditMode: (isEditMode, userId) => {
        set({ isEditMode });
        if (userId) {
            localStorage.setItem('isEditMode', JSON.stringify(isEditMode));
        } else {
            localStorage.removeItem('isEditMode');
        }
    },
    toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),

    setIsShared: async (isShared, userId) => {
        if (!userId) return;

        try {
            await updateUserShareStatus(userId, isShared);
            set({ isShared });
            localStorage.setItem('isShared', JSON.stringify(isShared));
        } catch (error) {
            console.error('❌ Failed to update share status:', error);
        }
    },
}));
