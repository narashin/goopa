import { useEffect } from 'react';

import { nanoid } from 'nanoid';

import { addSharedApp, deleteSharedApp } from '../lib/firestore';
import { getUser } from '../lib/firestore/users';
import { removeUndefinedFields } from '../lib/utils';
import {
    useAddItem,
    useDeleteItem,
    useGetItems as useItemsQuery,
    useItemsByCategoryAndUserId,
    useSharedItemsByCategory,
    useUpdateItem,
} from '../queries/itemQueries';
import { useItemStore } from '../stores/itemStore';
import { AppCategoryType, SubCategoryType } from '../types/category';
import type { ITool } from '../types/item';
import { AuthenticatedUserData } from '../types/user';
import { useAuth } from './useAuth';

export function useItems() {
    const { user } = useAuth();
    const userId = user?.uid ?? '';

    const { data: items, isLoading } = useItemsQuery(userId);
    const addItemMutation = useAddItem();
    const updateItemMutation = useUpdateItem();
    const deleteItemMutation = useDeleteItem();
    const itemsByCategoryAndUserIdResult = useItemsByCategoryAndUserId(
        AppCategoryType.General,
        SubCategoryType.None,
        userId
    );
    const { data: publicItems } = useSharedItemsByCategory(
        AppCategoryType.General
    );
    const { isEditMode, setIsEditMode, toggleEditMode, isShared, setIsShared } =
        useItemStore();

    // ✅ `isShared` 상태가 변경되면 Firestore 업데이트
    useEffect(() => {
        if (!user) return;

        const updateShareStatus = async () => {
            try {
                const userData = (await getUser(
                    userId
                )) as AuthenticatedUserData;
                if (!userData) {
                    return;
                }
                if (userData.isShared !== isShared) {
                    setIsShared(userData.isShared, userId);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        updateShareStatus();
    }, [isShared, userId]);

    // ✅ 앱 추가
    const handleAddItem = async (
        newItem: Omit<ITool, 'id' | 'starCount' | 'userId'>
    ): Promise<ITool | undefined> => {
        if (!user) return undefined;

        const completeItem: ITool = {
            ...newItem,
            id: nanoid(),
            starCount: 0,
            userId,
            category: newItem.category ?? AppCategoryType.General,
            subCategory: newItem.subCategory ?? SubCategoryType.None,
            icon: newItem.icon ?? null,
            tooltip: newItem.tooltip ?? '',
            installCommand: newItem.installCommand ?? '',
            zshrcCommand: newItem.zshrcCommand ?? '',
            isShared: isShared,
        };

        const cleanItem: ITool = {
            ...removeUndefinedFields(completeItem),
            id: nanoid(),
            name: completeItem.name ?? 'Unknown App',
            category: completeItem.category ?? AppCategoryType.General,
            subCategory: completeItem.subCategory ?? SubCategoryType.None,
            userId: completeItem.userId,
            createdAt: new Date().toISOString(),
            starCount: completeItem.starCount ?? 0,
        };

        const addedItem = await addItemMutation.mutateAsync(cleanItem);

        if (isShared) {
            await addSharedApp(addedItem);
        }

        return addedItem;
    };

    // ✅ 앱 업데이트
    const handleUpdateItem = async (
        appId: string,
        updatedFields: Partial<ITool>
    ) => {
        if (!user) return;

        updateItemMutation.mutate({ appId, updatedFields });

        if ('isShared' in updatedFields) {
            if (updatedFields.isShared) {
                const updatedApp: ITool = {
                    ...updatedFields,
                    id: appId,
                    userId,
                    name: updatedFields.name ?? 'Unknown App',
                    category: updatedFields.category ?? AppCategoryType.General,
                    subCategory:
                        updatedFields.subCategory ?? SubCategoryType.None,
                    starCount: updatedFields.starCount ?? 0,
                };
                await addSharedApp(updatedApp);
            } else {
                await deleteSharedApp(appId);
            }
        }
    };

    // ✅ 앱 삭제
    const handleDeleteItem = async (appId: string) => {
        if (!user) return;

        deleteItemMutation.mutate({ appId });

        // ✅ `apps` 컬렉션에서도 삭제
        if (publicItems && publicItems.some((item) => item.id === appId)) {
            await deleteSharedApp(appId);
        }
    };

    // ✅ 특정 유저의 앱 가져오기
    const getItemsByUserId = () => items ?? [];

    // ✅ 특정 유저의 특정 카테고리의 앱 가져오기
    const getItemsByCategoryAndUserId = (category: AppCategoryType) =>
        itemsByCategoryAndUserIdResult.data?.filter(
            (item) => item.category === category
        ) ?? [];

    // ✅ 공개된 특정 카테고리의 앱 가져오기
    const getPublicItemsByCategory = (category: AppCategoryType) => {
        const { data } = useSharedItemsByCategory(category);
        return data ?? [];
    };

    return {
        items,
        isLoading,
        addItem: handleAddItem,
        updateItem: handleUpdateItem,
        deleteItem: handleDeleteItem,
        getItemsByUserId,
        getItemsByCategoryAndUserId,
        getPublicItemsByCategory,
        addItemMutation,
        updateItemMutation,
        deleteItemMutation,
        isEditMode,
        setIsEditMode,
        toggleEditMode,
        isShared,
        setIsShared,
    };
}
