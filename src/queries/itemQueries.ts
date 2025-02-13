import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
    addAppToFirestore,
    deleteAppFromFirestore,
    getAppsByCategoryAndUserIdFromFirestore,
    getAppsByCustomUserId,
    getAppsFromFirestore,
    updateAppInFirestore,
} from '../lib/firestore';
import { getPublicAppsByCategory } from '../lib/server/categoryData';
import type { AppCategoryType } from '../types/category';
import type { ITool } from '../types/item';

export const useGetItems = (userId: string) => {
    return useQuery({
        queryKey: ['items', userId],
        queryFn: () => getAppsFromFirestore(userId),
    });
};

export const useAddItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newItem: ITool) => addAppToFirestore(newItem),
        onSuccess: (data) => {
            queryClient.setQueryData<ITool[]>(
                ['items', data.userId],
                (oldData) => (oldData ? [...oldData, data] : [data])
            );
        },
    });
};

export const useUpdateItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            userId,
            updatedItem,
        }: {
            userId: string;
            updatedItem: ITool;
        }) => updateAppInFirestore(userId, updatedItem),
        onSuccess: (_, variables) => {
            queryClient.setQueryData<ITool[]>(
                ['items', variables.userId],
                (oldData) => {
                    if (!oldData) return [variables.updatedItem];
                    return oldData.map((item) =>
                        item.id === variables.updatedItem.id
                            ? variables.updatedItem
                            : item
                    );
                }
            );
        },
    });
};
export const useDeleteItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, itemId }: { userId: string; itemId: string }) =>
            deleteAppFromFirestore(userId, itemId),
        onSuccess: (_, variables) => {
            queryClient.setQueryData<ITool[]>(
                ['items', variables.userId],
                (oldData) => {
                    return oldData
                        ? oldData.filter((item) => item.id !== variables.itemId)
                        : [];
                }
            );
        },
    });
};

export const useItemsByCustomUserId = (customUserId: string) => {
    return useQuery({
        queryKey: ['itemsByCustomUserId', customUserId],
        queryFn: () => getAppsByCustomUserId(customUserId),
    });
};

export const useItemsByCategoryAndUserId = (
    category: AppCategoryType,
    userId: string
) => {
    return useQuery({
        queryKey: ['itemsByCategory', category, userId],
        queryFn: () =>
            getAppsByCategoryAndUserIdFromFirestore(category, userId),
        enabled: !!userId,
    });
};

export const usePublicItemsByCategory = (category: AppCategoryType) => {
    return useQuery({
        queryKey: ['publicItemsByCategory', category],
        queryFn: () => getPublicAppsByCategory(category),
    });
};
