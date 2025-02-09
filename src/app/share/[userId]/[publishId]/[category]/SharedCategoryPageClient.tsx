'use client';
import React from 'react';

import { notFound } from 'next/navigation';

import type { AppCategoryType } from '@/types/category';
import type { ITool } from '@/types/item';
import type { AuthenticatedUserData } from '@/types/user';

import CategoryPageContent from '../../../../../components/pages/CategoryPageContent';
import { useUserByCustomUserId } from '../../../../../queries/authQueries';
import { useItemsByCustomUserId } from '../../../../../queries/itemQueries';

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
    const { data: user, isLoading: isUserLoading } =
        useUserByCustomUserId(customUserId);
    const { data: items, isLoading } = useItemsByCustomUserId(customUserId);

    const authenticatedUser = user as AuthenticatedUserData | null;
    const toolItems = items as ITool[] | undefined;

    if (isLoading || isUserLoading) {
        return <div>로딩 중...</div>;
    }

    if (
        !authenticatedUser ||
        authenticatedUser.isAnonymous ||
        !authenticatedUser.isShared ||
        !authenticatedUser.lastShareId ||
        authenticatedUser.lastShareId !== shareId
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
