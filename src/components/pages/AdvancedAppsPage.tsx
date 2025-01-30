// AdvancedDev.tsx
import React, { useCallback, useEffect, useState } from 'react';

import Image from 'next/image';

import { ClipboardIcon } from '@heroicons/react/24/outline';

import { categoryColors, categoryOrder } from '../../constants/category';
import { ITool } from '../../types/app';
import { SubCategoryType } from '../../types/category';
import AdditionalAppsPage from './AdditionalToolsPage';
import RequirementAppsPage from './RequirementAppsPage';
import ZshPluginsPage from './ZshPluginsPage';

interface AdvancedDevProps {
    initialCategory?: SubCategoryType;
    apps: ITool[];
    onAddNewApp: (newApp: ITool) => void;
}

const AdvancedDevAppPage = ({
    initialCategory: initialSubCategory,
    apps,
    onAddNewApp,
}: AdvancedDevProps) => {
    const [selectedCategory, setSelectedCategory] =
        useState<SubCategoryType | null>(null);
    const [selectedItems, setSelectedItems] = useState<ITool[]>([]);

    const handleHomebrewClick = () => {
        window.open('https://brew.sh/', '_blank', 'noopener,noreferrer');
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard');
        });
    };

    const isItemSelected = (id: string) =>
        selectedItems.some((item) => item.id === id);

    const toggleItem = (item: ITool) => {
        setSelectedItems((prev) =>
            prev.some((i) => i.id === item.id)
                ? prev.filter((i) => i.id !== item.id)
                : [...prev, item]
        );
    };

    const renderCategoryContent = useCallback(
        (category: SubCategoryType) => {
            switch (category) {
                case SubCategoryType.Requirement:
                    return (
                        <RequirementAppsPage
                            apps={apps}
                            onAddNewApp={onAddNewApp}
                            isItemSelected={isItemSelected}
                            toggleItem={toggleItem}
                            copyToClipboard={copyToClipboard}
                        />
                    );
                case SubCategoryType.ZshPlugin:
                    return (
                        <ZshPluginsPage
                            onAddNewApp={onAddNewApp}
                            apps={apps}
                            isItemSelected={isItemSelected}
                            toggleItem={toggleItem}
                            copyToClipboard={copyToClipboard}
                        />
                    );
                case SubCategoryType.Additional:
                    return (
                        <AdditionalAppsPage
                            onAddNewApp={onAddNewApp}
                            apps={apps}
                            isItemSelected={isItemSelected}
                            toggleItem={toggleItem}
                            copyToClipboard={copyToClipboard}
                        />
                    );
                default:
                    return null;
            }
        },
        [copyToClipboard, isItemSelected, toggleItem]
    );

    useEffect(() => {
        if (initialSubCategory && categoryOrder.includes(initialSubCategory)) {
            setSelectedCategory(initialSubCategory);
        }
    }, [initialSubCategory]);

    return (
        <>
            <div className="flex-1 overflow-auto relative h-full">
                {selectedCategory ? (
                    renderCategoryContent(selectedCategory)
                ) : (
                    <div className="p-6">
                        <div className="mb-8">
                            <div
                                className="max-w-2xl mx-auto bg-[#2d2c27] rounded-lg p-6 cursor-pointer hover:bg-[#353430] transition-colors"
                                onClick={handleHomebrewClick}
                            >
                                <div className="flex items-center justify-center mb-4">
                                    <Image
                                        src="/icons/homebrew_icon.png"
                                        alt="Homebrew"
                                        width={100}
                                        height={100}
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-[#f5b700] text-center mb-2">
                                    Homebrew
                                </h3>
                                <p className="text-white/80 text-center mb-4">
                                    The Missing Package Manager for macOS
                                </p>
                                <div className="bg-black/50 rounded p-3 font-mono text-sm text-white/90 overflow-x-auto relative">
                                    <code>
                                        {
                                            '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
                                        }
                                    </code>
                                    <button
                                        onClick={() =>
                                            copyToClipboard(
                                                '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
                                            )
                                        }
                                        className="absolute top-2 right-2 text-white/60 hover:text-white/90"
                                    >
                                        <ClipboardIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="fixed right-[16%] top-1/2 -translate-y-1/2 space-y-2 z-50">
                {categoryOrder.map((category) => (
                    <div
                        key={category}
                        className={`relative w-24 h-10 flex items-center transform transition-transform duration-200 overflow-hidden cursor-pointer ${
                            category === selectedCategory
                                ? '-translate-x-2'
                                : 'hover:-translate-x-2'
                        }`}
                        onClick={() =>
                            setSelectedCategory(
                                category === selectedCategory ? null : category
                            )
                        }
                    >
                        <div
                            className={`absolute inset-0 rounded-r-md transition-colors ${
                                category === selectedCategory
                                    ? categoryColors[category]
                                    : 'bg-white'
                            }`}
                        />
                        <span
                            className={`relative z-10 text-gray-800 text-xs font-medium capitalize pl-2 transition-colors ${
                                category === selectedCategory
                                    ? 'text-white'
                                    : ''
                            }`}
                        >
                            {category}
                        </span>
                        <div
                            className={`absolute right-0 top-0 w-7 h-full ${categoryColors[category]} rounded-r-md ${
                                category === selectedCategory
                                    ? 'opacity-100'
                                    : 'opacity-50'
                            }`}
                        />
                    </div>
                ))}
            </div>
        </>
    );
};

export default AdvancedDevAppPage;
