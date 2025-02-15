'use client';
import React, { useCallback, useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import CategoryPageContent from '../../components/pages/CategoryPageContent';
import { AppIconCardSkeleton } from '../../components/ui/skeletons/AppIconCardSkeleton';
import { useAuth } from '../../hooks/useAuth';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { useItems } from '../../hooks/useItems';
import {
    useItemsByCategoryAndUserId,
    usePublicItemsByCategory,
} from '../../queries/itemQueries'; // ✅ 수정된 Hook 경로
import type { AppCategoryType } from '../../types/category';
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
    const { data: userItems } = useItemsByCategoryAndUserId(
        category,
        user?.uid ?? ''
    );
    const { isLoading, addItem, deleteItem } = useItems();
    const { data: publicItems } = usePublicItemsByCategory(category);
    const [items, setItems] = useState<ITool[]>(userItems ?? []);

    useEffect(() => {
        if (userItems !== undefined) {
            setItems(userItems);
        }
    }, [userItems]);

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

            console.log('🟢 handleAddNewApp 실행됨', newApp);

            const tempId = Date.now().toString(); // 임시 ID 생성
            const tempApp: ITool = { id: tempId, ...newApp };

            setItems((prevItems) => [...prevItems, tempApp]);

            try {
                const result = await addItem(newApp);
                console.log('🟢 Firestore 추가 성공:', result);

                if (!result) {
                    console.error('❌ Firestore 추가 실패 가능성 있음.');
                    return;
                }

                queryClient.setQueryData(
                    ['itemsByCategory', category, user.uid],
                    (oldData?: ITool[]) => {
                        if (!oldData) return [result];

                        return oldData.map((app) =>
                            app.id === tempId ? result : app
                        );
                    }
                );

                await queryClient.invalidateQueries({
                    queryKey: ['itemsByCategory', category, user.uid],
                });

                await queryClient.refetchQueries({
                    queryKey: ['itemsByCategory', category, user.uid],
                });
            } catch (error) {
                console.error('❌ handleAddItem 실행 중 오류 발생:', error);

                setItems((prevItems) =>
                    prevItems.filter((app) => app.id !== tempId)
                );
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
            await deleteItem(appId);
            queryClient.invalidateQueries({
                queryKey: ['itemsByCategory', category, user.uid],
            });
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
            items={user ? appsToDisplay : initialApps}
            isEditMode={isEditMode}
            onAddNewApp={handleAddNewApp}
            onDeleteApp={handleDeleteApp}
            copyToClipboard={copyToClipboard}
            isReadOnly={!user}
        />
    );
}
