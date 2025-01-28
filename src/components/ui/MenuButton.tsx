import React from 'react';

import type { MenuType } from '../../types/menu';

interface MenuButtonProps {
    menu: MenuType;
    currentView: MenuType;
    onNavigate: (view: MenuType) => void;
}

export const MenuButton: React.FC<MenuButtonProps> = ({
    menu,
    currentView,
    onNavigate,
}) => (
    <button
        key={menu}
        className={`px-3 h-8 rounded-md transition-colors ${
            currentView === menu
                ? 'text-white bg-white/10'
                : 'text-white/70 hover:text-white'
        }`}
        onClick={() => onNavigate(menu)}
    >
        {menu
            .split('-')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')}
    </button>
);
