import { create } from 'zustand';

import { UserData } from '../types/user';

interface AuthState {
    user: UserData | null;
    setUser: (user: UserData | null) => void;
    isEditMode: boolean;
    setIsEditMode: (isEditMode: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    isEditMode: false,
    setIsEditMode: (isEditMode) => set({ isEditMode }),
}));
