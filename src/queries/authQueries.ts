import { useEffect } from 'react';

import {
    QueryObserver,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import { getUser, signInWithGoogle, signOutWithGoogle } from '../lib/auth';
import { auth } from '../lib/firebase';
import { getUserByCustomUserId } from '../lib/firestore';
import { useAuthStore } from '../stores/authStore';
import { UserData } from '../types/user';

export const useAuthQuery = () => {
    const setUser = useAuthStore((state) => state.setUser);
    const queryClient = useQueryClient();

    const query = useQuery<UserData | null, Error>({
        queryKey: ['user'],
        queryFn: async () => {
            const firebaseUser = auth.currentUser;
            if (firebaseUser) {
                return await getUser(firebaseUser.uid);
            }
            return null;
        },
    });

    useEffect(() => {
        const observer = new QueryObserver(queryClient, { queryKey: ['user'] });

        const unsubscribe = observer.subscribe((result) => {
            if (result.data !== undefined) {
                setUser(result.data as UserData | null);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [queryClient, setUser]);

    return query;
};

export const useSignInMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: signInWithGoogle,
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['user'] });
        },
    });
};

export const useSignOutMutation = () => {
    const queryClient = useQueryClient();
    const setUser = useAuthStore((state) => state.setUser);
    const setIsEditMode = useAuthStore((state) => state.setIsEditMode);

    return useMutation({
        mutationFn: () => signOutWithGoogle(),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['user'] });
            setUser(null);
            setIsEditMode(false);
            queryClient.setQueryData(['user'], null);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            window.location.reload();
        },
    });
};

export const useUserByCustomUserId = (customUserId: string) => {
    return useQuery<UserData | null, Error>({
        queryKey: ['userByCustomUserId', customUserId],
        queryFn: () => getUserByCustomUserId(customUserId),
        enabled: !!customUserId,
    });
};
