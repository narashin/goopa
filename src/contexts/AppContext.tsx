'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import { onAuthStateChanged, type User } from 'firebase/auth';

import { auth } from '../lib/firebase';
import {
    addAppToFirestore,
    deleteAppFromFirestore,
    getAppsFromFirestore,
    updateAppInFirestore,
} from '../lib/firestore';
import type { ITool } from '../types/app';

interface AppContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    apps: ITool[];
    setApps: React.Dispatch<React.SetStateAction<ITool[]>>;
    addApp: (newApp: ITool) => Promise<void>;
    updateApp: (updatedApp: ITool) => Promise<void>;
    deleteApp: (appId: string) => Promise<void>;
    isEditMode: boolean;
    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    isLoading: boolean;
    error: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [apps, setApps] = useState<ITool[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            setIsLoading(true);
            getAppsFromFirestore(user.uid)
                .then(setApps)
                .catch((err) => setError(err.message))
                .finally(() => setIsLoading(false));
        } else {
            setApps([]);
        }
    }, [user]);

    const addApp = async (newApp: ITool) => {
        if (user) {
            setIsLoading(true);
            try {
                const addedApp = await addAppToFirestore(newApp, user.uid);
                setApps((prevApps) => [...prevApps, addedApp]);
            } catch (error) {
                console.error('Error adding app:', error);
                setError('앱 추가 중 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        } else {
            setError('로그인이 필요합니다.');
        }
    };

    const updateApp = async (updatedApp: ITool) => {
        if (user) {
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
                setError('앱 업데이트 중 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        } else {
            setError('로그인이 필요합니다.');
        }
    };

    const deleteApp = async (appId: string) => {
        if (user) {
            setIsLoading(true);
            try {
                await deleteAppFromFirestore(user.uid, appId);
                setApps((prevApps) =>
                    prevApps.filter((app) => app.id !== appId)
                );
            } catch (error) {
                console.error('Error deleting app:', error);
                setError('앱 삭제 중 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        } else {
            setError('로그인이 필요합니다.');
        }
    };

    return (
        <AppContext.Provider
            value={{
                user,
                setUser,
                apps,
                setApps,
                addApp,
                updateApp,
                deleteApp,
                isEditMode,
                setIsEditMode,
                isLoading,
                error,
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
