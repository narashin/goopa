import { getRedirectResult, signInWithPopup, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';

import { auth, firestore, googleProvider } from './firebase';
import { PublishData } from './firestore';

export interface UserData {
    createdAt: string;
    customUserId: string;
    displayName: string;
    email: string;
    isPublished?: boolean;
    lastPublishId?: string;
    photoURL: string;
    publishHistory: PublishData[];
    uid: string;
}

const mapFirebaseUserToUserData = async (user: User): Promise<UserData> => {
    const userRef = doc(firestore, 'users', user.uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
        return userSnapshot.data() as UserData;
    }

    // Firestore에 사용자 정보가 없으면 새로 생성
    const customUserId = nanoid();
    const userData: UserData = {
        uid: user.uid,
        customUserId,
        displayName: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || '',
        createdAt: new Date(new Date().getTime() + 9 * 60 * 60 * 1000)
            .toISOString()
            .replace('Z', '+09:00'),
        publishHistory: [],
    };

    await setDoc(userRef, userData);
    return userData;
};

// 🔹 Google 로그인 (Firestore 저장 후 `UserData` 반환)
export const signInWithGoogle = async (): Promise<UserData> => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return await mapFirebaseUserToUserData(result.user);
    } catch (error) {
        console.error('Error during Google sign-in:', error);
        throw new Error('Authentication failed');
    }
};

// 🔹 Google Redirect 처리 (Firestore 저장 후 `UserData` 반환)
export const handleGoogleRedirect = async (): Promise<UserData | null> => {
    try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
            return await mapFirebaseUserToUserData(result.user);
        }
        return null;
    } catch (error) {
        console.error('Error handling Google redirect:', error);
        throw new Error('Authentication failed');
    }
};

// 🔹 Firestore에서 `UserData` 가져오기
export const getUser = async (uid: string): Promise<UserData> => {
    const userRef = doc(firestore, 'users', uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
        throw new Error('User not found');
    }

    return userSnapshot.data() as UserData;
};

export const getCustomUserId = async (uid: string): Promise<string> => {
    const user = await getUser(uid);
    return user.customUserId;
};
