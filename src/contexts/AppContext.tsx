'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import { onAuthStateChanged, type User } from 'firebase/auth';

import { auth } from '../lib/firebase';
import { addAppToFirestore, getAppsFromFirestore } from '../lib/firestore';
import type { ITool } from '../types/app';

interface AppContextType {
    addApp: (newApp: ITool) => void;
    apps: ITool[];
    isEditMode: boolean;
    setApps: React.Dispatch<React.SetStateAction<ITool[]>>;
    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    user: User | null;
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

        // Cleanup 함수
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            getAppsFromFirestore(user.uid).then(setApps);
        } else {
            setApps([]); // 사용자가 로그아웃하면 앱 목록을 초기화
        }
    }, [user]);

    const addApp = async (newApp: ITool) => {
        if (user) {
            try {
                const addedApp = await addAppToFirestore(newApp, user.uid);
                setApps((prevApps) => [...prevApps, addedApp]);
            } catch (error) {
                console.error('Error adding app:', error);
                // TODO: 여기에 사용자에게 오류 메시지를 표시하는 로직을 추가할 수 있습니다.
            }
        } else {
            console.error('User is not logged in');
            // 여기에 사용자에게 로그인이 필요하다는 알림을 추가할 수 있습니다.
        }
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
