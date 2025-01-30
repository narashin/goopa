import React, { JSX, Suspense } from 'react';

import CategoryPageContent from '../../../components/pages/CategoryPageContent';
import { fetchAppsFromFirestore } from '../../../lib/firestore';
import { AppCategoryType } from '../../../types/category';

interface CategoryPageProps {
    params: { category: string };
}

export default async function CategoryPage({
    params,
}: CategoryPageProps): Promise<JSX.Element> {
    const category = params.category as AppCategoryType;
    const apps = await fetchAppsFromFirestore(category);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CategoryPageContent category={category} initialApps={apps} />
        </Suspense>
    );
}
