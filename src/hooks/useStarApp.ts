import { useCallback, useEffect, useState } from 'react';

import {
    addStarToApp,
    getStarCountForApp,
    hasUserStarredApp,
    removeStarFromApp,
} from '../lib/firestore';
import { ITool } from '../types/item';
import { useAuth } from './useAuth';

export function useStarApp(app: ITool | null) {
    const [isStarred, setIsStarred] = useState(false);
    const [starCount, setStarCount] = useState(app?.starCount || 0);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const { user, handleSignIn } = useAuth();

    useEffect(() => {
        const loadStarCount = async () => {
            if (app && user) {
                try {
                    const count = await getStarCountForApp(user.uid, app.id);
                    setStarCount(count);
                } catch (error) {
                    console.error('별표 수를 가져오는 중 오류 발생:', error);
                    setStarCount(app.starCount || 0);
                }
            }
        };
        loadStarCount();
    }, [app?.id, user?.uid]);

    useEffect(() => {
        const checkIfStarred = async () => {
            if (user && app) {
                const starred = await hasUserStarredApp(user.uid, app.id);
                setIsStarred(starred);
            }
        };
        checkIfStarred();
    }, [app?.id, user?.uid]);

    const toggleStar = useCallback(async () => {
        if (!user || !app) {
            setShowLoginPrompt(true);
            return;
        }

        try {
            if (isStarred) {
                await removeStarFromApp(user.uid, app.id);
                setStarCount((prev) => prev - 1);
            } else {
                await addStarToApp(user.uid, app.id);
                setStarCount((prev) => prev + 1);
            }
            setIsStarred(!isStarred);
        } catch (error) {
            console.error('Error toggling star:', error);
        }
    }, [user, app, isStarred]);

    const handleLogin = useCallback(async () => {
        try {
            await handleSignIn();
            setShowLoginPrompt(false);
            await toggleStar();
        } catch (error) {
            console.error('Error signing in:', error);
        }
    }, [handleSignIn, toggleStar]);

    return {
        isStarred,
        starCount,
        toggleStar,
        showLoginPrompt,
        setShowLoginPrompt,
        handleLogin,
    };
}
