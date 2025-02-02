import React from 'react';

import { notFound } from 'next/navigation';

import { fetchAppsFromFirestore, getUserByCustomUserId } from '@/lib/firestore';
import type { AppCategoryType } from '@/types/category';

import SharedCategoryPageClient from './SharedCategoryPageClient';

interface Params {
    userId: string;
    publishId: string;
    category: AppCategoryType;
}

export default async function SharedCategoryPage({
    params,
}: {
    params: Params;
}) {
    const { userId, publishId, category } = await new Promise<Params>(
        (resolve) => resolve(params)
    );

    const userData = await getUserByCustomUserId(userId);

    if (!userData || !userData.isPublished) {
        notFound();
    }

    if (userData.lastPublishId !== publishId) {
        console.log('PublishId mismatch');
        notFound();
    }

    const initialApps = await fetchAppsFromFirestore(category);

    try {
        return (
            <SharedCategoryPageClient
                category={category}
                initialApps={initialApps}
                userData={userData}
            />
        );
    } catch (error) {
        console.error('Error in SharedCategoryPage:', error);
        return notFound();
    }
}
