import { useCallback, useEffect, useState } from 'react';

import { doc, onSnapshot } from 'firebase/firestore';

import { errorToast, successToast } from '../components/ui/Toast';
import { useShare } from '../contexts/ShareContext';
import type { UserData } from '../lib/auth';
import { firestore } from '../lib/firebase';
import { publishUser, unpublishUser } from '../lib/firestore';

export function useShareHandler(user: UserData | null) {
    const { setIsPublished } = useShare();
    const [publishUrl, setPublishUrl] = useState<string>('');
    const [lastPublishId, setLastPublishId] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;
        const userDocRef = doc(firestore, 'users', user.uid);
        const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                setIsPublished(userData.isPublished || false);
                setLastPublishId(userData.lastPublishId || null);
                if (
                    userData.isPublished &&
                    userData.customUserId &&
                    userData.lastPublishId
                ) {
                    setPublishUrl(
                        `/share/${userData.customUserId}/${userData.lastPublishId}`
                    );
                } else {
                    setPublishUrl('');
                }
            }
        });

        return () => unsubscribe();
    }, [user]);

    const handlePublish = useCallback(async () => {
        if (!user) {
            errorToast('User not found');
            return null;
        }
        try {
            const newPublishId = await publishUser(user.uid);
            if (newPublishId) {
                setLastPublishId(newPublishId);
                if (user.customUserId) {
                    setPublishUrl(
                        `/share/${user.customUserId}/${newPublishId}`
                    );
                }
                successToast('Goopa successfully published');
                return newPublishId;
            } else {
                throw new Error('Publish failed');
            }
        } catch (error) {
            console.error('Publish error:', error);
            errorToast('Failed to publish goopa :(');
            return null;
        }
    }, [user]);

    const handleUnPublish = useCallback(async () => {
        if (!user) {
            errorToast('User not found');
            return false;
        }

        try {
            const success = await unpublishUser(user.uid);
            if (success) {
                setIsPublished(false);
                setPublishUrl('');
                setLastPublishId(null);
                successToast('Goopa unpublished successfully');
            } else {
                throw new Error('Unpublish failed');
            }
            return success;
        } catch (error) {
            console.error('Unpublish error:', error);
            errorToast('Failed to unpublish goopa :(');
            return false;
        }
    }, [user]);

    return {
        isPublished: useShare().isPublished,
        publishUrl,
        lastPublishId,
        handlePublish,
        handleUnPublish,
    };
}
