import React from 'react';

import { getPublicAppsByCategory } from '../../lib/server/categoryData';
import { AppCategoryType } from '../../types/category';
import CategoryPageClient from './CategoryPageClient';

type Params = Promise<{ category: AppCategoryType }>;

export default async function CategoryPage(props: { params: Params }) {
    const { category } = await props.params;

    return (
        <CategoryPageClient
            category={category}
            initialApps={getPublicAppsByCategory(category)}
        />
    );
}
