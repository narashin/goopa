import { CategoryType } from '../types/advanced-category';

export const categoryColors: Record<CategoryType, string> = {
    [CategoryType.Requirement]: 'bg-purple-500',
    [CategoryType.ZshPlugin]: 'bg-orange-400',
    [CategoryType.Additional]: 'bg-green-400',
    [CategoryType.None]: 'bg-gray-400', // 실제로 쓰일 일은 없음
};

export const categoryOrder: CategoryType[] = [
    CategoryType.Requirement,
    CategoryType.ZshPlugin,
    CategoryType.Additional,
];
