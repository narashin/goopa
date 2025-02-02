'use client';

import React, { useEffect } from 'react';

import CategoryPageContent from '@/components/pages/CategoryPageContent';
import { useAppContext } from '@/contexts/AppContext';
import { ITool } from '@/types/app';
import { AppCategoryType } from '@/types/category';

import { UserData } from '../../../../../lib/auth';

interface SharedCategoryPageClientProps {
    category: AppCategoryType;
    initialApps: ITool[];
    userData: UserData;
}

export default function SharedCategoryPageClient({
    category,
    initialApps,
}: SharedCategoryPageClientProps) {
    const { apps, setApps } = useAppContext();

    useEffect(() => {
        if (initialApps.length > 0 && apps.length === 0) {
            setApps(initialApps);
        }
    }, [initialApps, apps.length, setApps]);

    return <CategoryPageContent category={category} isReadOnly={true} />;
}
