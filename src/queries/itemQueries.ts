import { collection, doc, setDoc } from 'firebase/firestore';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { firestore } from '../lib/firebase';
import {
    deleteUserApp, getAppsByCustomUserId, getSharedApps, getUserApps,
    getUserAppsByCategory, updateUserApp,
} from '../lib/firestore/apps';
import { AppCategoryType, SubCategoryType } from '../types/category';
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
    subCategory: SubCategoryType,
    userId: string
) => {
    return useQuery({
        queryKey: ['items', userId, category, subCategory],
        queryFn: async () => {
            const data = await getUserAppsByCategory(
                userId,
                category,
                subCategory
            );
            return data;
        },
        enabled: !!userId && !!category,
    });
};

// ✅ 공개된 특정 카테고리의 앱 가져오기
export const useSharedItemsByCategory = (category: AppCategoryType) => {
    return useQuery({
        queryKey: ['publicItems', category],
        queryFn: () => getSharedApps(),
    });
};

// ✅ 특정 유저의 customUserId 기반으로 앱 가져오기
export const useItemsByCustomUserId = (
    customUserId: string,
    category: AppCategoryType,
    subCategory?: SubCategoryType | null
) => {
    return useQuery({
        queryKey: ['itemsByCustomUserId', customUserId, category, subCategory],
        queryFn: async () => {
            const data = await getAppsByCustomUserId(
                customUserId,
                category,
                subCategory
            );
            return data;
        },
        enabled: !!customUserId,
    });
};

// ✅ 아이템 추가
export const useAddItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newApp: ITool) => {
            console.log('🟢 Firestore에 추가할 데이터:', newApp);

            try {
                // Firestore에 앱을 추가하는 작업
                const appRef = doc(collection(firestore, 'apps'), newApp.id);
                await setDoc(appRef, newApp);

                console.log('🟢 Firestore 추가 성공:', newApp);
                return newApp; // 추가된 앱 반환
            } catch (error) {
                console.error('❌ Firestore 추가 실패:', error);
                throw error;
            }
        },
        onSuccess: (addedItem) => {
            console.log('🟢 Firestore 추가 성공 - UI 업데이트:', addedItem);

            // 쿼리 업데이트
            queryClient.setQueryData(
                ['itemsByCategory', addedItem.userId],
                (oldData?: ITool[]) => {
                    return oldData ? [...oldData, addedItem] : [addedItem];
                }
            );

            // 쿼리 무효화 및 리패칭
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
