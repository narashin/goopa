'use client';
import React, { useCallback, useEffect, useState } from 'react';

import { nanoid } from 'nanoid';

import { useQueryClient } from '@tanstack/react-query';

import CategoryPageContent from '../../components/pages/CategoryPageContent';
import {
    AppIconCardSkeleton,
} from '../../components/ui/skeletons/AppIconCardSkeleton';
import { useAuth } from '../../hooks/useAuth';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { useItems } from '../../hooks/useItems';
import {
    useItemsByCategoryAndUserId, useSharedItemsByCategory,
} from '../../queries/itemQueries';
import { useCategoryStore } from '../../stores/categoryStore';
import { AppCategoryType, SubCategoryType } from '../../types/category';
import type { ITool } from '../../types/item';

interface CategoryPageClientProps {
    category: AppCategoryType;
    initialApps: ITool[];
}

export default function CategoryPageClient({
    category,
    initialApps,
}: CategoryPageClientProps) {
    const { user, isEditMode } = useAuth();
    const queryClient = useQueryClient();
    const copyToClipboard = useCopyToClipboard();
    const { selectedSubCategory, setCategory, setSelectedSubCategory } =
        useCategoryStore();
    const { data: userItems, refetch } = useItemsByCategoryAndUserId(
        category,
        selectedSubCategory ?? SubCategoryType.None,
        user?.uid ?? ''
    );
    const { isLoading, addItem, deleteItem } = useItems();
    const { data: publicItems } = useSharedItemsByCategory(category);
    const [items, setItems] = useState<ITool[]>(userItems ?? []);

    useEffect(() => {
        if (user && userItems) {
            setItems(userItems);
        } else if (!user) {
            setItems(publicItems ?? initialApps);
        }
    }, [
        user,
        userItems,
        publicItems,
        initialApps,
        category,
        selectedSubCategory,
    ]);

    useEffect(() => {
        setCategory(category);
        if (category === AppCategoryType.Advanced) {
            setSelectedSubCategory(null);
        }

        if (user) {
            queryClient.invalidateQueries({
                queryKey: ['itemsByCategory', category, user.uid],
            });
        }
    }, [category, setCategory, setSelectedSubCategory, user, queryClient]);

    const appsToDisplay = user
        ? items !== undefined
            ? items.length > 0
                ? items
                : []
            : []
        : (publicItems ?? []);

    const handleAddNewApp = useCallback(
        async (newApp: Omit<ITool, 'id'>) => {
            if (!user) {
                console.error('❌ User must be logged in to add items');
                return;
            }

            const tempApp: ITool = { id: nanoid(), ...newApp };

            setItems((prevItems) => [...prevItems, tempApp]);

            try {
                const result = await addItem(newApp);

                if (!result) {
                    console.error('❌ Firestore update failed');
                    return;
                }

                setItems((prevItems) =>
                    prevItems.map((app) =>
                        app.id === tempApp.id ? result : app
                    )
                );

                queryClient.setQueryData(
                    ['itemsByCategory', category, user.uid],
                    (oldData?: ITool[]) => {
                        if (!oldData) return [result];
                        return [
                            ...oldData.filter((item) => item.id !== result.id),
                            result,
                        ];
                    }
                );

                await queryClient.invalidateQueries({
                    queryKey: ['itemsByCategory', category, user.uid],
                });

                await refetch();
            } catch (error) {
                console.error('❌ Error:', error);
            }
        },
        [addItem, category, queryClient, user]
    );

    const handleDeleteApp = useCallback(
        async (appId: string) => {
            if (!user) {
                console.error('User must be logged in to delete items');
                return;
            }

            setItems((prevItems) =>
                prevItems.filter((app) => app.id !== appId)
            );

            try {
                await deleteItem(appId);

                // 캐시 직접 업데이트
                queryClient.setQueryData(
                    ['itemsByCategory', category, user.uid],
                    (oldData?: ITool[]) => {
                        if (!oldData) return [];
                        return oldData.filter((item) => item.id !== appId);
                    }
                );

                await queryClient.invalidateQueries({
                    queryKey: ['itemsByCategory', category, user.uid],
                });

                await refetch();
            } catch (error) {
                console.error('❌ Error deleting item:', error);
                await refetch();
            }
        },
        [deleteItem, category, queryClient]
    );

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
                {[...Array(10)].map((_, index) => (
                    <AppIconCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    return (
        <CategoryPageContent
            category={category}
            subCategory={selectedSubCategory}
            items={user ? appsToDisplay : initialApps}
            isEditMode={isEditMode}
            onAddNewApp={handleAddNewApp}
            onDeleteApp={handleDeleteApp}
            copyToClipboard={copyToClipboard}
            isReadOnly={!user}
        />
    );
}
