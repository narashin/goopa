import React from 'react';

import { notFound } from 'next/navigation';

import type { AppCategoryType } from '@/types/category';

import SharedCategoryPageClient from './SharedCategoryPageClient';

type Params = Promise<{
    userId: string;
    shareId: string;
    category: AppCategoryType;
}>;

export default async function SharedCategoryPage(props: { params: Params }) {
    const { userId: customUserId, shareId, category } = await props.params;

    try {
        return (
            <SharedCategoryPageClient
                category={category}
                customUserId={customUserId}
                shareId={shareId}
            />
        );
    } catch {
        return notFound();
    }
}
