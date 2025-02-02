'use client';

import React, { useEffect } from 'react';

import CategoryPageContent from '../../components/pages/CategoryPageContent';
import { useAppContext } from '../../contexts/AppContext';
import { ITool } from '../../types/app';
import { AppCategoryType } from '../../types/category';

interface CategoryPageClientProps {
    category: AppCategoryType;
    initialApps: ITool[];
}

export default function CategoryPageClient({
    category,
    initialApps,
}: CategoryPageClientProps) {
    const { apps, setApps } = useAppContext();

    useEffect(() => {
        if (initialApps.length > 0 && apps.length === 0) {
            setApps(initialApps);
        }
    }, [initialApps, apps.length, setApps]);

    return <CategoryPageContent category={category} />;
}
