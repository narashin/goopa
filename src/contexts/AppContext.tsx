'use client';

import React, { createContext, ReactNode, useContext, useState } from 'react';

import { User } from 'firebase/auth';

interface AppContextType {
    isEditMode: boolean;
    setIsEditMode: (mode: boolean) => void;
    user: User | null;
    setUser: (user: User | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    return (
        <AppContext.Provider
            value={{ isEditMode, setIsEditMode, user, setUser }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
