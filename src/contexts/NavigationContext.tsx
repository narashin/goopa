// src/contexts/NavigationContext.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';

import { AppCategoryType } from '../types/category';

interface NavigationContextType {
    currentCategory: AppCategoryType | null;
    setCurrentCategory: (category: AppCategoryType | null) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
    undefined
);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [currentCategory, setCurrentCategory] =
        useState<AppCategoryType | null>(null);

    return (
        <NavigationContext.Provider
            value={{ currentCategory, setCurrentCategory }}
        >
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigationContext = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error(
            'useNavigationContext must be used within NavigationProvider'
        );
    }
    return context;
};
