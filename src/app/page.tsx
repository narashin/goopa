'use client';

import React, { useState } from 'react';

import { LaptopFrame } from '../components/layout/LaptopFrame';
import { TopNav } from '../components/layout/TopNav';
import { useSearch } from '../hooks/use-search';
import { CategoryType } from '../types/advanced-category';
import { MenuType } from '../types/menu';
import AdvancedDev from './advanced-apps/Index';
import { DevApps } from './dev-apps/Index';
import { GeneralApps } from './general-apps/Index';
import { Home } from './home/Index';
import { SearchResultsPage } from './search/SearchResultPage';

export default function Goopa() {
    const [currentView, setCurrentView] = useState<MenuType>('home');
    const [searchQuery, setSearchQuery] = useState('');
    const [initialCategory, setInitialCategory] = useState<CategoryType>(
        CategoryType.None
    );
    const searchResults = useSearch(searchQuery);

    const handleNavigation = (
        view: MenuType,
        itemId?: string,
        category?: CategoryType
    ) => {
        setCurrentView(view);
        if (view === 'advanced' && category) {
            setInitialCategory(category);
        }
        if (itemId) {
            console.log(`Navigating to ${view} with itemId: ${itemId}`);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim() !== '') {
            setCurrentView('search');
        } else {
            setCurrentView('home');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
            <LaptopFrame>
                <div className="h-full flex flex-col bg-[#1a1b26]">
                    <TopNav
                        onNavigate={handleNavigation}
                        currentView={currentView}
                        onSearch={handleSearch}
                    />
                    {currentView === 'home' && <Home />}
                    {currentView === 'general' && <GeneralApps />}
                    {currentView === 'dev' && <DevApps />}
                    {currentView === 'advanced' && (
                        <AdvancedDev initialCategory={initialCategory} />
                    )}
                    {currentView === 'search' && (
                        <SearchResultsPage
                            results={searchResults}
                            onNavigate={handleNavigation}
                        />
                    )}
                </div>
            </LaptopFrame>
        </div>
    );
}
