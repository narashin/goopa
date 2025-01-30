import React from 'react';

import { fetchAppsFromFirestore } from '../../../lib/firestore';
import { AppCategoryType } from '../../../types/category';
import CategoryPageClient from './CategoryPageClient';

interface CategoryPageProps {
    params: { category: AppCategoryType };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { category } = params;
    const initialApps = await fetchAppsFromFirestore(category);

    return <CategoryPageClient category={category} initialApps={initialApps} />;
}
