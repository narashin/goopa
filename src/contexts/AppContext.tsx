'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import {
    addAppToFirestore,
    deleteAppFromFirestore,
    getAppsByCustomUserId,
    getAppsFromFirestore,
    updateAppInFirestore,
} from '../lib/firestore';
import { ITool } from '../types/app';
import { useUserContext } from './UserContext';

interface AppContextType {
    addApp: (newApp: ITool) => Promise<void>;
    apps: ITool[];
    setApps: React.Dispatch<React.SetStateAction<ITool[]>>;
    deleteApp: (appId: string) => Promise<void>;
    error: string | null;
    isEditMode: boolean;
    isLoading: boolean;
    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    toggleEditMode: () => void;
    updateApp: (updatedApp: ITool) => Promise<void>;
    fetchAppsByCustomUserId: (customUserId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [apps, setApps] = useState<ITool[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUserContext();

    const [isEditMode, setIsEditMode] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('isEditMode');
            return stored !== null ? JSON.parse(stored) : false;
        }
        return false;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('isEditMode', JSON.stringify(isEditMode));
        } else {
            setIsEditMode(false);
            localStorage.removeItem('isEditMode');
        }
    }, [isEditMode, user]);

    useEffect(() => {
        const fetchApps = async () => {
            if (user) {
                const appsData = await getAppsFromFirestore(user.uid);
                setApps(appsData);
            }
        };

        if (user) {
            fetchApps();
        }
    }, [user]);

    const toggleEditMode = () => {
        setIsEditMode((prevMode) => !prevMode);
    };

    const addApp = async (newApp: ITool) => {
        if (!user) {
            setError('You need to be logged in.');
            return;
        }
        if (!newApp) return;
        setIsLoading(true);
        try {
            await addAppToFirestore(user.uid, newApp);
            setApps((prevApps) => [...prevApps, newApp]);
        } catch (error) {
            console.error('Error adding app:', error);
            setError('Error adding app.');
        } finally {
            setIsLoading(false);
        }
    };

    const updateApp = async (updatedApp: ITool) => {
        if (!user) {
            setError('You need to be logged in.');
            return;
        }
        if (!updatedApp) return;
        setIsLoading(true);
        try {
            await updateAppInFirestore(user.uid, updatedApp);
            setApps((prevApps) =>
                prevApps.map((app) =>
                    app.id === updatedApp.id ? updatedApp : app
                )
            );
        } catch (error) {
            console.error('Error updating app:', error);
            setError('Error updating app:');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteApp = async (appId: string) => {
        if (!user) {
            setError('You need to be logged in.');
            return;
        }
        setIsLoading(true);
        try {
            await deleteAppFromFirestore(user.uid, appId);
            setApps((prevApps) => prevApps.filter((app) => app.id !== appId));
        } catch (error) {
            console.error('Error deleting app:', error);
            setError('Error deleting app.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAppsByCustomUserId = async (customUserId: string) => {
        setIsLoading(true);
        try {
            const appsData = await getAppsByCustomUserId(customUserId);
            setApps(appsData);
        } catch (error) {
            console.error('customUserId로 앱 가져오기 중 오류 발생:', error);
            setError('앱을 가져오는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppContext.Provider
            value={{
                apps,
                setApps,
                isEditMode,
                setIsEditMode,
                isLoading,
                error,
                addApp,
                updateApp,
                deleteApp,
                toggleEditMode,
                fetchAppsByCustomUserId,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
