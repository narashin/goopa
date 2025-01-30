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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [apps, setApps] = useState<ITool[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            getAppsFromFirestore(user.uid).then(setApps);
        } else {
            setApps([]);
        }
    }, [user]);

    const addApp = async (newApp: ITool) => {
        if (user) {
            try {
                const addedApp = await addAppToFirestore(newApp, user.uid);
                setApps((prevApps) => [...prevApps, addedApp]);
            } catch (error) {
                console.error('Error adding app:', error);
                // TODO: 여기에 사용자에게 오류 메시지를 표시하는 로직을 추가
            }
        } else {
            console.error('User is not logged in');
            // TODO: 여기에 사용자에게 로그인이 필요하다는 알림을 추가
        }
    };

    const updateApp = async (updatedApp: ITool) => {
        if (user) {
            await updateAppInFirestore(user.uid, updatedApp);
            setApps((prevApps) =>
                prevApps.map((app) =>
                    app.id === updatedApp.id ? updatedApp : app
                )
            );
        } else {
            console.error('User is not logged in');
        }
    };

    const deleteApp = async (appId: string) => {
        if (user) {
            await deleteAppFromFirestore(user.uid, appId);
            setApps((prevApps) => prevApps.filter((app) => app.id !== appId));
        } else {
            console.error('User is not logged in');
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
