'use client';
import React from 'react';

import { notFound } from 'next/navigation';

import type { AppCategoryType } from '@/types/category';
import type { ITool } from '@/types/item';

import CategoryPageContent from '../../../../../components/pages/CategoryPageContent';
import { useUserByCustomUserId } from '../../../../../queries/authQueries';
import { useItemsByCustomUserId } from '../../../../../queries/itemQueries';
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
    const { data: items, isLoading } = useItemsByCustomUserId(customUserId);

    const toolItems = items as ITool[] | undefined;

    if (isLoading || isUserLoading) {
        return <div>로딩 중...</div>;
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
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard');
        });
    };

    return (
        <CategoryPageContent
            category={category}
            items={toolItems ?? []}
            isEditMode={false}
            isReadOnly={true}
            onAddNewApp={handleAddNewApp}
            onDeleteApp={handleDeleteApp}
            copyToClipboard={copyToClipboard}
        />
    );
}
