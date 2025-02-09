import type { AppCategoryType } from '../../types/category';
import type { ITool } from '../../types/item';

export function getPublicAppsByCategory(category: AppCategoryType): ITool[] {
    return [
        {
            id: '1',
            name: 'Public App 1',
            category: category,
            userId: 'public',
            icon: '/placeholder.svg',
            url: 'https://example.com/app1',
            starCount: 10,
        },
        {
            id: '2',
            name: 'Public App 2',
            category: category,
            userId: 'public',
            icon: '/placeholder.svg',
            url: 'https://example.com/app2',
            starCount: 5,
        },
    ];
}
