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

    // Firestore에서 starCount를 가져오고 UI 상태 설정
    useEffect(() => {
        if (!app) return;

        const fetchStarCount = async () => {
            // 비로그인 유저는 `publicApps/{appId}`에서 starCount 가져오기
            if (!user) {
                const publicAppRef = doc(firestore, 'publicApps', app.id);
                const docSnap = await getDoc(publicAppRef);
                if (docSnap.exists()) {
                    setStarCount(docSnap.data().starCount || 0);
                }
                return;
            }

            // 로그인한 유저는 `users/{userId}/starredApps/{appId}`에 추가된 앱만 조회
            const starredAppsRef = doc(
                firestore,
                'users',
                user.uid,
                'starredApps',
                app.id
            );
            const docSnap = await getDoc(starredAppsRef);
            setIsStarred(docSnap.exists()); // 스타한 앱인지 여부 확인
        };

        fetchStarCount();
    }, [app, user]);

    // Star 토글 처리
    const toggleStar = useCallback(async () => {
        if (!user || !app) {
            setShowLoginPrompt(true); // 비로그인 시 로그인 프롬프트 표시
            return;
        }

        const newStarredState = !isStarred;
        setIsStarred(newStarredState); // UI 상태에서 바로 반영
        setStarCount((prev) => (newStarredState ? prev + 1 : prev - 1)); // UI 상태에서 바로 반영

        try {
            const ownerId = app.userId;
            // 스타 추가 또는 제거
            if (newStarredState) {
                await addStarToApp(user.uid, app.id, ownerId);
            } else {
                await removeStarFromApp(user.uid, app.id);
            }

            // Firestore에서 starCount를 다시 가져와서 상태 갱신
            const appRef = doc(firestore, 'publicApps', app.id);
            const appSnap = await getDoc(appRef);
            if (appSnap.exists()) {
                setStarCount(appSnap.data().starCount); // 최신 starCount 반영
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
