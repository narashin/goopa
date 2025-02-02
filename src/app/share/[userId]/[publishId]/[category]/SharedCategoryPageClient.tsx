'use client';

import React, { useEffect, useState } from 'react';

import { notFound } from 'next/navigation';

import CategoryPageContent from '@/components/pages/CategoryPageContent';
import { useAppContext } from '@/contexts/AppContext';
import { ITool } from '@/types/app';
import { AppCategoryType } from '@/types/category';

import { UserData } from '../../../../../lib/auth';
import { subscribeToUserData } from '../../../../../lib/firestore';

interface SharedCategoryPageClientProps {
    category: AppCategoryType;
    initialApps: ITool[];
    userData: UserData;
}

export default function SharedCategoryPageClient({
    category,
    initialApps,
    userData: initialUserData,
}: SharedCategoryPageClientProps) {
    const { apps, setApps } = useAppContext();
    const [userData, setUserData] = useState(initialUserData);

    useEffect(() => {
        if (initialApps.length > 0 && apps.length === 0) {
            setApps(initialApps);
        }

        const unsubscribe = subscribeToUserData(
            initialUserData.uid,
            (updatedUserData) => {
                if (updatedUserData) {
                    setUserData(updatedUserData);
                    if (!updatedUserData.isPublished) {
                        setApps([]);
                    }
                }
            }
        );

        return () => unsubscribe();
    }, [initialApps, apps.length, setApps, initialUserData.uid]);

    if (!userData.isPublished) {
        return notFound();
    }
    return <CategoryPageContent category={category} isReadOnly={true} />;
}
