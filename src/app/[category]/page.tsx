import React from 'react';

import { fetchAppsFromFirestore } from '../../lib/firestore';
import { AppCategoryType } from '../../types/category';
import CategoryPageClient from './CategoryPageClient';

type Params = Promise<{ category: AppCategoryType }>;

export default async function CategoryPage(props: { params: Params }) {
    const params = await props.params;
    const initialApps = await fetchAppsFromFirestore(params.category);

    return (
        <CategoryPageClient
            category={params.category}
            initialApps={initialApps}
        />
    );
}
