import React from 'react';

import { categoryColors } from '../../constants/category';

type Category = keyof typeof categoryColors;

interface CategoryIndexProps {
    selectedCategory: Category | null;
    setSelectedCategory: (category: Category | null) => void;
    categoryOrder: Category[];
}

const CategoryIndex: React.FC<CategoryIndexProps> = ({
    selectedCategory,
    setSelectedCategory,
    categoryOrder,
}) => {
    return (
        <div className="fixed right-[18%] top-1/2 -translate-y-1/2 space-y-2 z-50">
            {categoryOrder.map((category) => (
                <div
                    key={category}
                    className="relative w-24 h-10 flex items-center transform hover:-translate-x-2 transition-transform duration-200 overflow-hidden cursor-pointer"
                    onClick={() =>
                        setSelectedCategory(
                            category === selectedCategory ? null : category
                        )
                    }
                >
                    <div className="absolute inset-0 bg-white rounded-r-md" />
                    <span className="relative z-10 text-gray-800 text-xs font-medium capitalize pl-2">
                        {category}
                    </span>
                    <div
                        className={`absolute right-0 top-0 w-7 h-full ${
                            categoryColors[category]
                        } rounded-r-md ${
                            category === selectedCategory
                                ? 'opacity-100'
                                : 'opacity-50'
                        }`}
                    />
                </div>
            ))}
        </div>
    );
};

export default CategoryIndex;
