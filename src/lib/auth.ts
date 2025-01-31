import { getRedirectResult, signInWithPopup, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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

    const userRef = doc(firestore, 'users', uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
        try {
            const customUserId = nanoid();
            await setDoc(userRef, {
                uid,
                displayName,
                email,
                photoURL,
                createdAt: new Date().toISOString(),
                customUserId,
            });

            console.log(`User data saved successfully with UID: ${uid}`);
            return uid;
        } catch (error) {
            console.error('Failed to save User data:', error);
            throw error;
        }
    } else {
        console.log('User already exists in Firestore');
        return uid;
    }
};

export const getUser = async (uid: string) => {
    const userRef = doc(firestore, 'users', uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
        return userSnapshot.data();
    } else {
        throw new Error('User not found');
    }
};
