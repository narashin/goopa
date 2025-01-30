'use client';

import type React from 'react';
import { createContext, useContext, useState } from 'react';

import type { User } from 'firebase/auth';

import type { ITool } from '../types/app';

interface AppContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    isEditMode: boolean;
    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    apps: ITool[];
    setApps: React.Dispatch<React.SetStateAction<ITool[]>>;
    addApp: (newApp: ITool) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [apps, setApps] = useState<ITool[]>([]);

    const addApp = (newApp: ITool) => {
        setApps((prevApps) => [...prevApps, newApp]);
    };

    return (
        <AppContext.Provider
            value={{
                user,
                setUser,
                isEditMode,
                setIsEditMode,
                apps,
                setApps,
                addApp,
            }}
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
