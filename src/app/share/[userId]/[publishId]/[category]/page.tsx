import React from 'react';

import { notFound } from 'next/navigation';

import { getAppsByCustomUserId, getUserByCustomUserId } from '@/lib/firestore';
import type { AppCategoryType } from '@/types/category';

import SharedCategoryPageClient from './SharedCategoryPageClient';

type Params = Promise<{
    userId: string;
    publishId: string;
    category: AppCategoryType;
}>;

export default async function SharedCategoryPage(props: { params: Params }) {
    const { userId: customUserId, publishId, category } = await props.params;

    const userData = await getUserByCustomUserId(customUserId);

    if (!userData || !userData.isPublished) {
        notFound();
    }

    if (userData.lastPublishId !== publishId) {
        notFound();
    }

    const initialApps = await getAppsByCustomUserId(customUserId);

    try {
        return (
            <SharedCategoryPageClient
                category={category}
                initialApps={initialApps}
                userData={userData}
            />
        );
    } catch {
        return notFound();
    }
}
