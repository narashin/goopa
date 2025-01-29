import { signInWithPopup, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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

const saveUserToFirestore = async (user: User) => {
    const { uid, displayName, email, photoURL } = user;

    const userRef = doc(firestore, 'users', uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
        try {
            await setDoc(userRef, {
                uid,
                displayName,
                email,
                photoURL,
                createdAt: new Date(),
            });
            console.log('User data saved successfully');
        } catch (error) {
            console.error('Failed to save User data:', error);
        }
    } else {
        console.log('User already exists in Firestore');
    }
};
