import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

import { firestore } from '../firebase';

// ✅ 유저 공유 활성화
export const enableUserSharing = async (userId: string): Promise<void> => {
    const shareRef = doc(firestore, 'users', userId, 'settings', 'share');
    await setDoc(shareRef, { isShared: true }, { merge: true });
};

// ✅ 유저 공유 비활성화
export const disableUserSharing = async (userId: string): Promise<void> => {
    const shareRef = doc(firestore, 'users', userId, 'settings', 'share');
    await updateDoc(shareRef, { isShared: false });
};

// ✅ 특정 유저의 공유 상태 가져오기
export const getUserShareStatus = async (userId: string): Promise<boolean> => {
    const shareRef = doc(firestore, 'users', userId, 'settings', 'share');
    const shareSnap = await getDoc(shareRef);
    return shareSnap.exists() ? shareSnap.data().isShared : false;
};
