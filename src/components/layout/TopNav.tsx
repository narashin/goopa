import React from 'react';

import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { Menu, MenuType } from '../../types/menu';
import { Logo } from '../ui/Logo';

interface TopNavProps {
    onNavigate: (view: MenuType) => void;
    currentView: MenuType;
}

export function TopNav({ onNavigate, currentView }: TopNavProps) {
    return (
        <div className="flex items-center justify-between p-3 bg-black/20 backdrop-blur-sm border-b border-white/10">
            <div className="flex items-center space-x-3">
                <Logo />
            </div>
            <div className="flex space-x-4 text-sm">
                {Menu.map((view) => (
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
            <div className="flex items-center space-x-3">
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-white/50" />
                    <input
                        className="pl-9 bg-black/50 border border-white/20 rounded-md h-8 w-36 text-sm text-white/90 placeholder:text-white/30"
                        placeholder="Search..."
                    />
                </div>
                <button className="h-8 w-8 flex items-center justify-center text-white/70 hover:text-white transition-colors">
                    <XMarkIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
