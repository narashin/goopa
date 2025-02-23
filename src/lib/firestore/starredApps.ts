import {
    arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, increment,
    writeBatch,
} from 'firebase/firestore';

import { ITool } from '../../types/item';
import { firestore } from '../firebase';

// ✅ Star 추가
export const addStarToApp = async (
    userId: string, // B유저의 `uid`는 그대로 사용
    appId: string,
    appOwnerId: string // A유저의 `uid` 추가
): Promise<void> => {
    const starRef = doc(firestore, 'users', userId, 'starredApps', appId); // B유저의 starredApps에 추가
    const userAppRef = doc(firestore, 'users', appOwnerId, 'apps', appId); // A유저의 앱 정보
    const publicAppRef = doc(firestore, 'publicApps', appId); // 공개 앱 컬렉션

    const batch = writeBatch(firestore);

    const publicAppSnap = await getDoc(publicAppRef);
    const userAppSnap = await getDoc(userAppRef);

    if (!publicAppSnap.exists()) {
        throw new Error(
            `App with ID ${appId} does not exist in publicApps collection.`
        );
    }

    if (!userAppSnap.exists()) {
        throw new Error(
            `App with ID ${appId} does not exist in users/${appOwnerId}/apps.`
        );
    }

    // A유저의 앱에서 starCount 증가
    batch.update(userAppRef, { starCount: increment(1) });

    batch.update(publicAppRef, {
        starCount: increment(1), // Public 앱에서도 starCount 증가
        starredByUsers: arrayUnion(userId), // 스타한 유저를 배열에 추가
    });
    batch.set(starRef, { appId }); // B유저의 starredApps 컬렉션에 추가

    await batch.commit();
};

// ✅ Star 제거
export const removeStarFromApp = async (
    userId: string,
    appId: string
): Promise<void> => {
    const starRef = doc(firestore, 'users', userId, 'starredApps', appId);
    const userAppRef = doc(firestore, 'users', userId, 'apps', appId); // userId 하위로 앱 정보 저장
    const publicAppRef = doc(firestore, 'publicApps', appId); // 공개 앱 컬렉션

    const batch = writeBatch(firestore);

    // 🔥 먼저 `publicApps/{appId}` 문서가 존재하는지 확인
    const publicAppSnap = await getDoc(publicAppRef);
    if (!publicAppSnap.exists()) {
        console.warn(`⚠️ Public app document ${appId} does not exist.`);
        return; // Public 앱이 존재하지 않으면 업데이트하지 않음
    }

    batch.delete(starRef); // 사용자의 Star 목록에서 제거
    batch.update(userAppRef, { starCount: increment(-1) }); // 유저 앱의 starCount 감소
    batch.update(publicAppRef, {
        starCount: increment(-1), // Public 앱에서 starCount 감소
        starredByUsers: arrayRemove(userId), // 스타한 유저에서 제거
    });

    await batch.commit();
};

// ✅ Starred 앱 id들 가져오기
export const getStarredAppIds = async (userId: string): Promise<string[]> => {
    console.log(`Fetching starred apps for user: ${userId}`); // 🔍 디버깅 추가

    const snapshot = await getDocs(
        collection(firestore, 'users', userId, 'starredApps')
    );

    console.log('Firestore snapshot size:', snapshot.size); // 🔍 몇 개의 문서를 가져왔는지 확인
    snapshot.forEach((doc) => {
        console.log('Fetched starred app ID:', doc.id); // 🔍 개별 ID 출력
    });

    return snapshot.docs.map((doc) => doc.id);
};

// ✅ Starred 앱 가져오기
export const getStarredAppsByUser = async (
    userId: string
): Promise<ITool[]> => {
    if (!userId) return [];

    // 1. 앱 ID들 가져오기
    const starredAppIds = await getStarredAppIds(userId);
    console.log('Fetched starred app IDs:', starredAppIds); // 앱 ID 확인

    const starredApps: ITool[] = [];

    for (const appId of starredAppIds) {
        console.log(`Fetching app data for appId: ${appId}`);

        // 2. 앱 데이터 가져오기 (publicApps 컬렉션에서 앱 데이터 찾기)
        const appRef = doc(firestore, 'publicApps', appId); // `publicApps`에서 앱 정보 가져오기
        const appSnap = await getDoc(appRef);

        console.log(`Document exists for appId ${appId}:`, appSnap.exists());

        if (appSnap.exists()) {
            const appData = { id: appSnap.id, ...appSnap.data() } as ITool;
            console.log('Fetched app data:', appData); // 앱 데이터 확인
            starredApps.push(appData);
        } else {
            console.warn(
                `App with ID ${appId} does not exist in 'publicApps' collection.`
            );
        }
    }

    console.log('Final starred apps:', starredApps); // 최종 앱 리스트 확인
    return starredApps;
};
