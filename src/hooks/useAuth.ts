'use client';

import { useEffect } from 'react';

import { onAuthStateChanged, type User } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';

import { auth } from '../lib/firebase';
import {
    useAuthQuery,
    useSignInMutation,
    useSignOutMutation,
} from '../queries/authQueries';
import { useAuthStore } from '../stores/authStore';

export function useAuth() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const pathname = usePathname();
    const { data: user, isLoading } = useAuthQuery();
    const signIn = useSignInMutation();
    const signOut = useSignOutMutation();
    const isEditMode = useAuthStore((state) => state.isEditMode);
    const setIsEditMode = useAuthStore((state) => state.setIsEditMode);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (newUser) => {
            queryClient.setQueryData(['user'], newUser);

            if (!newUser && !pathname.startsWith('/share/')) {
                router.push('/');
            }
        });

        return () => unsubscribe();
    }, [queryClient, pathname]);

    const handleSignIn = async () => {
        try {
            await signIn.mutateAsync();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut.mutateAsync();
            router.push('/');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const setUser = (newUser: User | null) => {
        queryClient.setQueryData(['user'], newUser);
    };

    return {
        user,
        loading: isLoading,
        handleSignIn,
        handleSignOut,
        isEditMode,
        setIsEditMode,
        setUser,
    };
}
