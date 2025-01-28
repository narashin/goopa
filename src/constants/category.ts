import { SubCategoryType } from '../types/category';

export const categoryColors: Record<SubCategoryType, string> = {
    [SubCategoryType.Requirement]: 'bg-purple-500',
    [SubCategoryType.ZshPlugin]: 'bg-orange-400',
    [SubCategoryType.Additional]: 'bg-green-400',
    [SubCategoryType.None]: 'bg-gray-400', // 실제로 쓰일 일은 없음
};

export const categoryOrder: SubCategoryType[] = [
    SubCategoryType.Requirement,
    SubCategoryType.ZshPlugin,
    SubCategoryType.Additional,
];
