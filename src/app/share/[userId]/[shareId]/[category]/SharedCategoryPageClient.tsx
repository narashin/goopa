'use client';
import React, { useEffect } from 'react';

import { notFound } from 'next/navigation';

import { AppCategoryType, SubCategoryType } from '@/types/category';
import type { ITool } from '@/types/item';

import CategoryPageContent from '../../../../../components/pages/CategoryPageContent';
import { AppIconCardSkeleton } from '../../../../../components/ui/skeletons/AppIconCardSkeleton';
import { successToast } from '../../../../../components/ui/Toast';
import { useUserByCustomUserId } from '../../../../../queries/authQueries';
import { useItemsByCustomUserId } from '../../../../../queries/itemQueries';
import { useCategoryStore } from '../../../../../stores/categoryStore';
import { AuthenticatedUserData } from '../../../../../types/user';

interface SharedCategoryPageClientProps {
    category: AppCategoryType;
    customUserId: string;
    shareId: string;
}

export default function SharedCategoryPageClient({
    category,
    customUserId,
    shareId,
}: SharedCategoryPageClientProps) {
    const { data: sharedUser, isLoading: isUserLoading } =
        useUserByCustomUserId(customUserId);
    const { selectedSubCategory, setCategory, setSelectedSubCategory } =
        useCategoryStore();
    const { data: items, isLoading } = useItemsByCustomUserId(
        customUserId,
        category,
        selectedSubCategory ?? SubCategoryType.None
    );
    const toolItems = items as ITool[] | undefined;

    useEffect(() => {
        setCategory(category);
        if (category === AppCategoryType.Advanced) {
            setSelectedSubCategory(null);
        }
    }, [category, setCategory, setSelectedSubCategory]);

    if (isLoading || isUserLoading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
                {[...Array(10)].map((_, index) => (
                    <AppIconCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    const authenticatedSharedUser = sharedUser as AuthenticatedUserData | null;
    if (
        !authenticatedSharedUser ||
        !authenticatedSharedUser.isShared ||
        authenticatedSharedUser.lastShareId !== shareId
    ) {
        notFound();
    }

    const handleAddNewApp = async () => {
        console.warn('Adding new apps is not allowed in read-only mode');
    };

    const handleDeleteApp = async () => {
        console.warn('Deleting apps is not allowed in read-only mode');
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        successToast('Copied URL to clipboard');
    };

    return (
        <CategoryPageContent
            category={category}
            subCategory={selectedSubCategory}
            items={toolItems ?? []}
            isEditMode={false}
            isReadOnly={true}
            onAddNewApp={handleAddNewApp}
            onDeleteApp={handleDeleteApp}
            copyToClipboard={copyToClipboard}
        />
    );
}
