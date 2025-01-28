import React from 'react';

import { categoryColors } from '../../constants/category';
import { SubCategoryType } from '../../types/category';

interface CategoryIndexProps {
    selectedCategory: SubCategoryType | null;
    setSelectedCategory: (category: SubCategoryType | null) => void;
    resetView: () => void;
    categoryOrder: SubCategoryType[];
}

const CategoryIndex: React.FC<CategoryIndexProps> = ({
    selectedCategory,
    setSelectedCategory,
    resetView,
    categoryOrder,
}) => {
    return (
        <div className="fixed right-[18%] top-1/2 -translate-y-1/2 space-y-2 z-50">
            {categoryOrder.map((category) => (
                <div
                    key={category}
                    className={`relative w-24 h-10 flex items-center transform transition-all duration-200 overflow-hidden cursor-pointer ${
                        category === selectedCategory
                            ? '-translate-x-2'
                            : 'hover:-translate-x-2'
                    }`}
                    onClick={() => {
                        if (category === selectedCategory) {
                            setSelectedCategory(null);
                            resetView();
                        } else {
                            setSelectedCategory(category);
                        }
                    }}
                >
                    <div
                        className={`absolute inset-0 bg-white rounded-md transition-colors ${
                            category === selectedCategory
                                ? categoryColors[category]
                                : 'bg-white'
                        } ${Object.values(categoryColors).join(' ')} `}
                    />
                    <div
                        className={`absolute right-0 top-0 w-7 h-full rounded-r-md transition-opacity ${
                            category === selectedCategory
                                ? 'opacity-0'
                                : 'opacity-100'
                        } ${categoryColors[category]} ${Object.values(categoryColors).join(' ')}`}
                    />
                    <span
                        className={`relative z-10 text-xs font-medium capitalize pl-2 transition-colors ${
                            category === selectedCategory
                                ? 'text-white'
                                : 'text-gray-800'
                        }`}
                    >
                        {category}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default CategoryIndex;
