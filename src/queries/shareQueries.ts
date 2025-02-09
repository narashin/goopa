import { doc, type DocumentReference, onSnapshot } from 'firebase/firestore';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { firestore } from '../lib/firebase';
import { shareUser, unshareUser } from '../lib/firestore';
import type { ShareData } from '../types/share';

export const useShareDataQuery = (userId: string | null) =>
    useQuery<ShareData | null, Error>({
        queryKey: ['shareData', userId],
        queryFn: () =>
            new Promise<ShareData | null>((resolve) => {
                if (!userId) {
                    resolve(null);
                    return;
                }
                const userDocRef: DocumentReference = doc(
                    firestore,
                    'users',
                    userId
                );
                const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const userData = docSnapshot.data() as ShareData;
                        resolve(userData);
                    } else {
                        resolve(null);
                    }
                    unsubscribe();
                });
            }),
        enabled: !!userId,
    });

export const useShareMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<string, Error, string>({
        mutationFn: shareUser,
        onSuccess: (newShareId, uid) => {
            queryClient.invalidateQueries({ queryKey: ['shareData', uid] });
        },
    });
};

export const useUnshareMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: unshareUser,
        onSuccess: (_, uid) => {
            queryClient.invalidateQueries({ queryKey: ['shareData', uid] });
        },
    });
};
