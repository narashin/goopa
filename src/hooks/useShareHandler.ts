import { useCallback, useEffect, useState } from 'react';

import type { UserData } from '../lib/auth';
import {
    publishUser,
    subscribeToUserData,
    unpublishUser,
} from '../lib/firestore';

export function useShareHandler(user: UserData | null) {
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        if (!user) return;

        console.log('useShareHandler: 구독 시작');
        const unsubscribe = subscribeToUserData(user.uid, (data) => {
            console.log('useShareHandler: 실시간 데이터 업데이트', data);
            setUserData(data);
        });

        return () => {
            console.log('useShareHandler: 구독 해제');
            unsubscribe();
        };
    }, [user]);

    const handlePublish = useCallback(async () => {
        if (!user) return null;
        console.log('🟢 Publishing...');
        const newPublishId = await publishUser(user.uid);
        console.log('New publish ID in useShareHandler:', newPublishId);
        return newPublishId;
    }, [user]);

    const handleUnPublish = useCallback(async () => {
        if (!user) return false;
        console.log('🔴 Unpublishing...');
        const success = await unpublishUser(user.uid);
        if (success) {
            console.log('Unpublished successfully');
        } else {
            console.error('Failed to unpublish');
        }
        return success;
    }, [user]);

    // publishHistory의 마지막 항목을 확인하여 isPublished 상태를 결정
    const isPublished = userData?.publishHistory
        ? userData.publishHistory.length > 0 &&
          userData.publishHistory[userData.publishHistory.length - 1]
              .endedAt === null
        : false;

    // lastPublishId를 publishHistory에서 가져옴
    const lastPublishId =
        userData?.publishHistory && userData.publishHistory.length > 0
            ? userData.publishHistory[userData.publishHistory.length - 1]
                  .publishId
            : null;

    const publishUrl =
        isPublished && user?.customUserId && lastPublishId
            ? `/share/${user.customUserId}/${lastPublishId}`
            : '';

    return {
        isPublished,
        publishUrl,
        handlePublish,
        handleUnPublish,
        userData,
    };
}
