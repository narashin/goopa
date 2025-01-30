'use client';

import React, { Suspense, useEffect } from 'react';

import CategoryPageContent from '../../../components/pages/CategoryPageContent';
import { useAppContext } from '../../../contexts/AppContext';
import type { ITool } from '../../../types/app';
import type { AppCategoryType } from '../../../types/category';

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
    }, [initialApps, apps, setApps]);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CategoryPageContent category={category} initialApps={apps} />
        </Suspense>
    );
}
