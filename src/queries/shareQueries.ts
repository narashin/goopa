import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { firestore } from '../lib/firebase';
import { updateUserShareStatus } from '../lib/firestore/users';
import type { ShareData, ShareHistoryData } from '../types/share';

// ✅ Firestore에서 사용자 공유 상태 가져오기 (ShareHistory 포함)
export const useShareDataQuery = (userId: string | null) =>
    useQuery<ShareData | null, Error>({
        queryKey: ['shareData', userId],
        queryFn: async () => {
            if (!userId) return null;

            const userDocRef = doc(firestore, 'users', userId);
            const userSnap = await getDoc(userDocRef);
            if (userSnap.exists()) {
                return userSnap.data() as ShareData;
            }
            return null;
        },
        enabled: !!userId,
    });

// ✅ 공유 활성화 (ShareHistory 반영)
export const useShareMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userId: string) => {
            await updateUserShareStatus(userId, true);
            const newShareId = nanoid();
            const startedAt = new Date().toISOString();

            const userDocRef = doc(firestore, 'users', userId);
            const userSnap = await getDoc(userDocRef);

            if (userSnap.exists()) {
                const data = userSnap.data() as ShareData;
                const updatedHistory: ShareHistoryData[] = [
                    ...(data.shareHistory ?? []),
                    { ShareId: newShareId, startedAt, endedAt: null },
                ];
                await updateDoc(userDocRef, {
                    isShared: true,
                    lastShareId: newShareId,
                    shareHistory: updatedHistory,
                });
            }

            return newShareId;
        },
        onSuccess: (_, userId) => {
            queryClient.invalidateQueries({ queryKey: ['shareData', userId] });
        },
    });
};

// ✅ 공유 비활성화 (ShareHistory 반영)
export const useUnshareMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userId: string) => {
            await updateUserShareStatus(userId, false);
            const userDocRef = doc(firestore, 'users', userId);
            const userSnap = await getDoc(userDocRef);

            if (userSnap.exists()) {
                const data = userSnap.data() as ShareData;

                const updatedHistory = (
                    Array.isArray(data.shareHistory) ? data.shareHistory : []
                ).map((entry) =>
                    entry.ShareId === data.lastShareId
                        ? { ...entry, endedAt: new Date().toISOString() }
                        : entry
                );

                await updateDoc(userDocRef, {
                    isShared: false,
                    lastShareId: null,
                    shareHistory: updatedHistory,
                });
            }
        },
        onSuccess: (_, userId) => {
            queryClient.invalidateQueries({ queryKey: ['shareData', userId] });
        },
    });
};
