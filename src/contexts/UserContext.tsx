'use client';

import type React from 'react';
import { createContext, useContext, useEffect } from 'react';

import { onAuthStateChanged, type User } from 'firebase/auth';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { auth } from '../lib/firebase';

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const queryClient = useQueryClient();

    const { data: user, isLoading } = useQuery<User | null>({
        queryKey: ['user'],
        queryFn: () => Promise.resolve(null),
        initialData: null,
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (newUser) => {
            queryClient.setQueryData(['user'], newUser);
        });
        return () => unsubscribe();
    }, [queryClient]);

    const setUser = (newUser: User | null) => {
        queryClient.setQueryData(['user'], newUser);
    };

    return (
        <UserContext.Provider value={{ user, setUser, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};
