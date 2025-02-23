import React, {
    createContext, ReactNode, useCallback, useContext, useState,
} from 'react';

import { AppCategoryType } from '../types/category';

interface NavigationContextType {
    currentCategory: AppCategoryType | null;
    setCurrentCategory: (category: AppCategoryType | null) => void;
}

const initialNavigationContext: NavigationContextType = {
    currentCategory: null,
    setCurrentCategory: () => {},
};

const NavigationContext = createContext<NavigationContextType>(
    initialNavigationContext
);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [currentCategory, setCurrentCategoryState] =
        useState<AppCategoryType | null>(null);

    const setCurrentCategory = useCallback(
        (category: AppCategoryType | null) => {
            setCurrentCategoryState(category);
        },
        []
    );

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
