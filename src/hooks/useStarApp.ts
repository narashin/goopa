import { useCallback, useEffect, useState } from 'react';

import { doc, getDoc } from 'firebase/firestore';

import { firestore } from '../lib/firebase';
import { addStarToApp, removeStarFromApp } from '../lib/firestore/starredApps';
import { ITool } from '../types/item';
import { useAuth } from './useAuth';

export function useStarApp(app: ITool | null) {
    const { user, handleSignIn } = useAuth();
    const [isStarred, setIsStarred] = useState(false);
    const [starCount, setStarCount] = useState(app?.starCount || 0);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    useEffect(() => {
        if (!app) return;

        const fetchStarCount = async () => {
            const appRef = doc(firestore, 'apps', app.id);
            const docSnap = await getDoc(appRef);
            if (docSnap.exists()) {
                setStarCount(docSnap.data().starCount || 0);
            }

            if (user) {
                const starredAppsRef = doc(
                    firestore,
                    'users',
                    user.uid,
                    'starredApps',
                    app.id
                );
                const starredSnap = await getDoc(starredAppsRef);
                setIsStarred(starredSnap.exists());
            }
        };

        fetchStarCount();
    }, [app, user]);

    const toggleStar = useCallback(async () => {
        if (!user || !app) {
            setShowLoginPrompt(true);
            return;
        }

        const newStarredState = !isStarred;
        setIsStarred(newStarredState);
        setStarCount((prev) => (newStarredState ? prev + 1 : prev - 1));

        try {
            const ownerId = app.userId;

            if (newStarredState) {
                await addStarToApp(user.uid, app.id, ownerId);
            } else {
                await removeStarFromApp(user.uid, app.id, ownerId);
            }

            const appRef = doc(firestore, 'apps', app.id);
            const appSnap = await getDoc(appRef);
            if (appSnap.exists()) {
                setStarCount(appSnap.data().starCount);
            }
        } catch (error) {
            console.error('Error toggling star:', error);
            // 실패 시 UI 상태 복구
            setIsStarred(!newStarredState);
            setStarCount((prev) => (newStarredState ? prev - 1 : prev + 1));
        }
    }, [user, app, isStarred]);

    const handleLogin = useCallback(async () => {
        try {
            await handleSignIn();
            setShowLoginPrompt(false);
        } catch (error) {
            console.error('Error signing in:', error);
        }
    }, [handleSignIn]);

    return {
        isStarred,
        starCount,
        toggleStar,
        showLoginPrompt,
        setShowLoginPrompt,
        handleLogin,
    };
}
