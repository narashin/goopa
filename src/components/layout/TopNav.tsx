import React, { useState } from 'react';

import { MenuType } from '../../types/menu';
import { Logo } from '../ui/Logo';
import { SearchInput } from '../ui/SearchInput';

interface TopNavProps {
    onNavigate: (view: MenuType) => void;
    currentView: MenuType;
    onSearch: (query: string) => void;
}

export function TopNav({ onNavigate, currentView, onSearch }: TopNavProps) {
    const views: MenuType[] = ['home', 'general', 'dev', 'advanced'];
    const [searchQuery, setSearchQuery] = useState('');
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        onSearch(query);
    };

    const clearSearch = () => {
        setSearchQuery('');
        onSearch('');
    };

    return (
        <div className="flex items-center justify-between p-3 bg-black/20 backdrop-blur-sm border-b border-white/10">
            <div className="flex items-center space-x-3">
                <Logo />
            </div>
            <div className="flex space-x-4 text-sm">
                {views.map((view) => (
                    <button
                        key={view}
                        className={`px-3 h-8 rounded-md transition-colors ${
                            currentView === view
                                ? 'text-white bg-white/10'
                                : 'text-white/70 hover:text-white'
                        }`}
                        onClick={() => onNavigate(view)}
                    >
                        {view
                            .split('-')
                            .map(
                                (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(' ')}
                    </button>
                ))}
            </div>
            <div className="flex items-center space-x-3 relative">
                <SearchInput
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onClear={clearSearch}
                />
            </div>
        </div>
    );
}
