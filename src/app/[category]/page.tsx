import React from 'react';

import { fetchAppsFromFirestore } from '../../lib/firestore';
import { AppCategoryType } from '../../types/category';
import CategoryPageClient from './CategoryPageClient';

type Params = Promise<{ category: AppCategoryType }>;

export default async function CategoryPage(props: { params: Params }) {
    const { category } = await props.params;
    const initialApps = await fetchAppsFromFirestore(category);

    return <CategoryPageClient category={category} initialApps={initialApps} />;
}
