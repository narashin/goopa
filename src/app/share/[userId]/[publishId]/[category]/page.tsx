import React from 'react';

import { notFound } from 'next/navigation';

import { getAppsByCustomUserId, getUserByCustomUserId } from '@/lib/firestore';
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
    const {
        userId: customUserId,
        publishId,
        category,
    } = await new Promise<Params>((resolve) => resolve(params));

    const userData = await getUserByCustomUserId(customUserId);
    console.log('customUserId', customUserId);
    console.log('userData', userData);

    if (!userData || !userData.isPublished) {
        notFound();
    }

    if (userData.lastPublishId !== publishId) {
        console.log('PublishId mismatch');
        notFound();
    }

    const initialApps = await getAppsByCustomUserId(customUserId);
    console.log(initialApps);

    try {
        return (
            <SharedCategoryPageClient
                category={category}
                initialApps={initialApps}
                userData={userData}
            />
        );
    } catch (error) {
        console.log('Error', error);
        return notFound();
    }
}
