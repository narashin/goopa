import { useEffect } from 'react';

import {
    QueryObserver, useMutation, useQuery, useQueryClient,
} from '@tanstack/react-query';

import { signInWithGoogle, signOutWithGoogle } from '../lib/auth';
import { auth } from '../lib/firebase';
import {
    createUserIfNotExists, getUser, getUserByCustomUserId,
} from '../lib/firestore/users';
import { useAuthStore } from '../stores/authStore';
import { AuthenticatedUserData, UserData } from '../types/user';

export const useAuthQuery = () => {
    const setUser = useAuthStore((state) => state.setUser);
    const queryClient = useQueryClient();

    const query = useQuery<AuthenticatedUserData | null, Error>({
        queryKey: ['user'],
        queryFn: async () => {
            const firebaseUser = auth.currentUser;
            if (firebaseUser) {
                const userData = await getUser(firebaseUser.uid);
                return userData;
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
        mutationFn: async () => {
            const user = await signInWithGoogle();
            await createUserIfNotExists(user.uid, user); // ✅ Firestore에 사용자 문서 생성 (없으면)
            return user;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
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
