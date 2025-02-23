import { create } from 'zustand';

import { AppCategoryType, SubCategoryType } from '../types/category';

interface CategoryStore {
    category: AppCategoryType;
    selectedSubCategory: SubCategoryType | null;
    setCategory: (category: AppCategoryType) => void;
    setSelectedSubCategory: (subCategory: SubCategoryType | null) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
    category: AppCategoryType.General,
    selectedSubCategory: null,
    setCategory: (category) => set({ category, selectedSubCategory: null }),
    setSelectedSubCategory: (subCategory) =>
        set({
            category: AppCategoryType.Advanced,
            selectedSubCategory: subCategory,
        }),
}));
