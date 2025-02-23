import {
    collection, doc, getDoc, getDocs, updateDoc, writeBatch,
} from 'firebase/firestore';

import { firestore } from '../firebase';

// ✅ 유저 공유 활성화
export const enableUserSharing = async (userId: string): Promise<void> => {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, { isShared: true });

    // 유저의 모든 앱에 대해 isShared를 true로 설정
    const appsRef = collection(firestore, 'apps');
    const appsSnapshot = await getDocs(appsRef);
    const batch = writeBatch(firestore);

    appsSnapshot.forEach((docSnap) => {
        const appData = docSnap.data();
        if (appData.userId === userId) {
            const appRef = doc(firestore, 'apps', docSnap.id);
            batch.update(appRef, { isShared: true });
        }
    });

    await batch.commit();
};

// ✅ 유저 공유 비활성화
export const disableUserSharing = async (userId: string): Promise<void> => {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, { isShared: false });

    // 유저의 모든 앱에 대해 isShared를 false로 설정
    const appsRef = collection(firestore, 'apps');
    const appsSnapshot = await getDocs(appsRef);
    const batch = writeBatch(firestore);

    appsSnapshot.forEach((docSnap) => {
        const appData = docSnap.data();
        if (appData.userId === userId) {
            const appRef = doc(firestore, 'apps', docSnap.id);
            batch.update(appRef, { isShared: false });
        }
    });

    await batch.commit();
};

// ✅ 특정 유저의 공유 상태 가져오기
export const getUserShareStatus = async (userId: string): Promise<boolean> => {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data().isShared : false;
};
