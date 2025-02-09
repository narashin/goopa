'use client';

import React, { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import CategoryPageContent from '../../components/pages/CategoryPageContent';
import { SkeletonAppIconCard } from '../../components/ui/skeletons/SkeleotonAppIconCard';
import { useAuth } from '../../hooks/useAuth';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { useItems } from '../../hooks/useItem';
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
    const { addItem, deleteItem } = useItems();
    const queryClient = useQueryClient();
    const copyToClipboard = useCopyToClipboard();
    const { isLoading, getPublicItemsByCategory, getItemsByCategoryAndUserId } =
        useItems();

    const appsToDisplay = user
        ? getItemsByCategoryAndUserId(category)
        : getPublicItemsByCategory(category);

    const handleAddNewApp = useCallback(
        async (newApp: Omit<ITool, 'id'>) => {
            if (user) {
                await addItem(newApp);
                queryClient.invalidateQueries({
                    queryKey: ['itemsByCategory', category, user.uid],
                });
            } else {
                console.error('User must be logged in to add items');
            }
        },
        [addItem, category, user, queryClient]
    );

    const handleDeleteApp = useCallback(
        async (appId: string) => {
            if (user) {
                await deleteItem(appId);
                queryClient.invalidateQueries({
                    queryKey: ['itemsByCategory', category, user.uid],
                });
            } else {
                console.error('User must be logged in to delete items');
            }
        },
        [deleteItem, category, user, queryClient]
    );

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
                {[...Array(10)].map((_, index) => (
                    <SkeletonAppIconCard key={index} />
                ))}
            </div>
        );
    }

    return (
        <CategoryPageContent
            category={category}
            items={appsToDisplay ?? initialApps}
            isEditMode={isEditMode}
            onAddNewApp={handleAddNewApp}
            onDeleteApp={handleDeleteApp}
            copyToClipboard={copyToClipboard}
            isReadOnly={!user}
        />
    );
}
