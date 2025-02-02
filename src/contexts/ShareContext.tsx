import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import { doc, onSnapshot } from 'firebase/firestore';

import { useAuth } from '../hooks/useAuth';
import { firestore } from '../lib/firebase';

interface ShareContextType {
    isPublished: boolean;
    setIsPublished: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShareContext = createContext<ShareContextType | undefined>(undefined);

export function ShareProvider({ children }: { children: React.ReactNode }) {
    const [isPublished, setIsPublished] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        const userDocRef = doc(firestore, 'users', user.uid);
        const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                setIsPublished(userData.isPublished || false);
            }
        });

        return () => unsubscribe();
    }, [user]);

    return (
        <ShareContext.Provider value={{ isPublished, setIsPublished }}>
            {children}
        </ShareContext.Provider>
    );
}

export function useShare() {
    const context = useContext(ShareContext);
    if (context === undefined) {
        throw new Error('useShare must be used within a ShareProvider');
    }
    return context;
}
