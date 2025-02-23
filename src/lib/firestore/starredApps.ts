import {
    arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, increment,
    writeBatch,
} from 'firebase/firestore';

import { ITool } from '../../types/item';
import { firestore } from '../firebase';

// ✅ Star 추가
export const addStarToApp = async (
    userId: string,
    appId: string,
    appOwnerId: string
): Promise<void> => {
    const starRef = doc(firestore, 'users', userId, 'starredApps', appId);
    const userAppRef = doc(firestore, 'apps', appId);
    const appOwnerRef = doc(firestore, 'users', appOwnerId);

    const batch = writeBatch(firestore);

    const userAppSnap = await getDoc(userAppRef);
    const appOwnerSnap = await getDoc(appOwnerRef);

    if (!userAppSnap.exists()) {
        throw new Error(
            `App with ID ${appId} does not exist in apps collection.`
        );
    }

    if (!appOwnerSnap.exists()) {
        throw new Error(
            `User with ID ${appOwnerId} does not exist in users collection.`
        );
    }

    batch.update(userAppRef, { starCount: increment(1) });

    batch.update(appOwnerRef, { starCount: increment(1) });

    batch.update(userAppRef, {
        starredByUsers: arrayUnion(userId),
    });
    batch.set(starRef, { appId });

    try {
        await batch.commit();
    } catch (error) {
        console.error('❌ Error adding star:', error);
    }
};

// ✅ Star 제거
export const removeStarFromApp = async (
    userId: string,
    appId: string,
    appOwnerId: string
): Promise<void> => {
    const starRef = doc(firestore, 'users', userId, 'starredApps', appId);
    const userAppRef = doc(firestore, 'apps', appId);
    const appOwnerRef = doc(firestore, 'users', appOwnerId);

    const batch = writeBatch(firestore);

    const userAppSnap = await getDoc(userAppRef);
    if (!userAppSnap.exists()) {
        console.warn(
            `⚠️ App document ${appId} does not exist in 'apps' collection.`
        );
        return;
    }

    batch.delete(starRef); // B유저의 Star 목록에서 제거
    batch.update(userAppRef, { starCount: increment(-1) });
    batch.update(userAppRef, {
        starredByUsers: arrayRemove(userId),
    });

    batch.update(appOwnerRef, { starCount: increment(-1) });

    try {
        await batch.commit();
    } catch (error) {
        console.error('❌ Error removing star:', error);
    }
};

// ✅ Starred 앱 id들 가져오기
export const getStarredAppIds = async (userId: string): Promise<string[]> => {
    const snapshot = await getDocs(
        collection(firestore, 'users', userId, 'starredApps')
    );

    return snapshot.docs.map((doc) => doc.id);
};

// ✅ Starred 앱 가져오기
export const getStarredAppsByUser = async (
    userId: string
): Promise<ITool[]> => {
    if (!userId) return [];

    const starredAppIds = await getStarredAppIds(userId);

    const starredApps: ITool[] = [];

    for (const appId of starredAppIds) {
        const appRef = doc(firestore, 'apps', appId);
        const appSnap = await getDoc(appRef);

        if (appSnap.exists()) {
            const appData = { id: appSnap.id, ...appSnap.data() } as ITool;
            starredApps.push(appData);
        } else {
            console.warn(
                `App with ID ${appId} does not exist in 'apps' collection.`
            );
        }
    }

    return starredApps;
};
