import { collection, doc, setDoc } from 'firebase/firestore';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { firestore } from '../lib/firebase';
import {
    deleteUserApp,
    getAppsByCustomUserId,
    getPublicApps,
    getUserApps,
    getUserAppsByCategory,
    updateUserApp,
} from '../lib/firestore/apps';
import { AppCategoryType } from '../types/category';
import { ITool } from '../types/item';

// ✅ 특정 유저의 앱 가져오기
export const useGetItems = (userId: string) => {
    return useQuery({
        queryKey: ['itemsByCategory', userId],
        queryFn: async () => getUserApps(userId),
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });
};

// ✅ 특정 유저의 특정 카테고리의 앱 가져오기
export const useItemsByCategoryAndUserId = (
    category: AppCategoryType,
    userId: string
) => {
    return useQuery({
        queryKey: ['items', userId, category],
        queryFn: async () => {
            const data = await getUserAppsByCategory(userId, category);
            console.log(`📢 ${category} 데이터 로드됨:`, data);
            return data;
        },
        enabled: !!userId,
    });
};

// ✅ 공개된 특정 카테고리의 앱 가져오기
export const usePublicItemsByCategory = (category: AppCategoryType) => {
    return useQuery({
        queryKey: ['publicItems', category],
        queryFn: () => getPublicApps(),
    });
};

// ✅ 특정 유저의 customUserId 기반으로 앱 가져오기
export const useItemsByCustomUserId = (customUserId: string) => {
    return useQuery({
        queryKey: ['itemsByCustomUserId', customUserId],
        queryFn: () => getAppsByCustomUserId(customUserId),
    });
};

// ✅ 아이템 추가
export const useAddItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newApp: ITool) => {
            console.log('🟢 Firestore에 추가할 데이터:', newApp);

            try {
                const appRef = doc(
                    collection(firestore, 'users', newApp.userId, 'apps'),
                    newApp.id
                );
                await setDoc(appRef, newApp);

                console.log('🟢 Firestore 추가 성공:', newApp);
                return newApp; // ✅ Firestore에 추가된 데이터 반환
            } catch (error) {
                console.error('❌ Firestore 추가 실패:', error);
                throw error;
            }
        },
        onSuccess: (addedItem) => {
            console.log('🟢 Firestore 추가 성공 - UI 업데이트:', addedItem);

            queryClient.setQueryData(
                ['itemsByCategory', addedItem.userId],
                (oldData?: ITool[]) => {
                    return oldData ? [...oldData, addedItem] : [addedItem];
                }
            );

            queryClient.invalidateQueries({
                queryKey: ['itemsByCategory', addedItem.userId],
            });
            queryClient.refetchQueries({
                queryKey: [
                    'itemsByCategory',
                    addedItem.category,
                    addedItem.userId,
                ],
            });
        },
    });
};

// ✅ 아이템 업데이트
export const useUpdateItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            userId,
            appId,
            updatedFields,
        }: {
            userId: string;
            appId: string;
            updatedFields: Partial<ITool>;
        }) => updateUserApp(userId, appId, updatedFields),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['items', variables.userId],
            });
        },
    });
};

// ✅ 아이템 삭제
export const useDeleteItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, appId }: { userId: string; appId: string }) =>
            deleteUserApp(userId, appId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['items', variables.userId],
            });
        },
    });
};
