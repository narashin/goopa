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
    console.log('Received params:', params);
    const { userId, publishId, category } = await new Promise<Params>(
        (resolve) => resolve(params)
    );
    console.log('Resolved params:', { userId, publishId, category });

    const userData = await getUserByCustomUserId(userId);
    console.log('Fetched userData:', userData);

    if (!userData || !userData.isPublished) {
        console.log('User not found or not published');
        notFound();
    }

    if (userData.lastPublishId !== publishId) {
        console.log('PublishId mismatch');
        notFound();
    }

    const initialApps = await fetchAppsFromFirestore(category);
    console.log('Fetched initialApps:', initialApps);

    try {
        console.log('SharedCategoryPage: Rendering SharedCategoryPageClient');
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
