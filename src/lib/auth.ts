import { getRedirectResult, signInWithPopup, User } from 'firebase/auth';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';

import { auth, firestore, googleProvider } from './firebase';

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        await saveUserToFirestore(user);

        return user;
    } catch (error) {
        console.error('Error during Google sign-in:', error);
        throw new Error('Authentication failed');
    }
};

export const handleGoogleRedirect = async () => {
    try {
        const result = await getRedirectResult(auth);
        if (result) {
            const user = result.user;
            await saveUserToFirestore(user);
            return user;
        }
    } catch (error) {
        console.error('Error handling Google redirect:', error);
        throw new Error('Authentication failed');
    }
};

export const saveUserToFirestore = async (user: User): Promise<string> => {
    const { uid, displayName, email, photoURL } = user;

    const usersCollectionRef = collection(firestore, 'users');

    // Firestore에서 기존 사용자 찾기 (uid 기반으로 검색)
    const userRef = doc(usersCollectionRef, uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
        try {
            const customUserId = nanoid();

            const newUserRef = await addDoc(usersCollectionRef, {
                uid,
                displayName,
                email,
                photoURL,
                createdAt: new Date().toISOString(),
                customUserId,
            });

            console.log(
                `User data saved successfully with ID: ${newUserRef.id}`
            );
            return newUserRef.id;
        } catch (error) {
            console.error('Failed to save User data:', error);
            throw error;
        }
    } else {
        console.log('User already exists in Firestore');
        return userRef.id; // 기존 사용자의 Firestore ID 반환
    }
};
