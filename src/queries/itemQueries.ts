import { collection, doc, setDoc } from 'firebase/firestore';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { firestore } from '../lib/firebase';
import {
    deleteApp,
    getAppsByCustomUserId,
    getSharedApps,
    getUserApps,
    getUserAppsByCategory,
    updateApp,
} from '../lib/firestore/apps';
import { AppCategoryType, SubCategoryType } from '../types/category';
import { ITool } from '../types/item';

// ✅ 특정 유저의 앱 가져오기
export const useGetItems = (userId: string) => {
    return useQuery({
        queryKey: ['itemsByCategory', userId],
        queryFn: async () => {
            const apps = await getUserApps(userId);
            return apps.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateB - dateA;
            });
        },
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
            return data.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateB - dateA;
            });
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
            const appRef = doc(collection(firestore, 'apps'), newApp.id);
            await setDoc(appRef, newApp);
            return newApp;
        },
        onSuccess: (addedItem) => {
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
            appId,
            updatedFields,
        }: {
            appId: string;
            updatedFields: Partial<ITool>;
        }) => updateApp(appId, updatedFields),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['items', variables.appId],
            });
        },
    });
};

// ✅ 아이템 삭제
export const useDeleteItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ appId }: { appId: string }) => deleteApp(appId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['items', variables.appId],
            });
        },
    });
};
