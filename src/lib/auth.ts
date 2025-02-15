import { getRedirectResult, signInWithPopup, User } from 'firebase/auth';
import { nanoid } from 'nanoid';

import { AuthenticatedUserData } from '../types/user';
import { auth, googleProvider } from './firebase';
import { getUser, saveUser } from './firestore/users';

const createUserData = (user: User): AuthenticatedUserData => {
    return {
        uid: user.uid,
        isAnonymous: false,
        customUserId: nanoid(),
        displayName: user.displayName || '',
        email: user.email || '',
        isShared: false,
        photoURL: user.photoURL || '',
        createdAt: new Date(new Date().getTime() + 9 * 60 * 60 * 1000)
            .toISOString()
            .replace('Z', '+09:00'),
        shareHistory: [],
        emailVerified: user.emailVerified,
        metadata: {
            creationTime: user.metadata.creationTime || '',
            lastSignInTime: user.metadata.lastSignInTime || '',
        },
    };
};

export const signInWithGoogle = async (): Promise<AuthenticatedUserData> => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        let userData = await getUser(result.user.uid).catch(() => null);

        if (!userData) {
            userData = createUserData(result.user);
            await saveUser(userData);
        }

        return userData as AuthenticatedUserData;
    } catch (error) {
        console.error('Error during Google sign-in:', error);
        throw new Error('Authentication failed');
    }
};

export const signOutWithGoogle = async (): Promise<void> => {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Error during Google sign-out:', error);
        throw new Error('Sign-out failed');
    }
};

export const handleGoogleRedirect =
    async (): Promise<AuthenticatedUserData | null> => {
        try {
            const result = await getRedirectResult(auth);
            if (result?.user) {
                let userData = await getUser(result.user.uid).catch(() => null);

                if (!userData) {
                    userData = createUserData(result.user);
                    await saveUser(userData);
                }

                return userData as AuthenticatedUserData;
            }
            return null;
        } catch (error) {
            console.error('Error handling Google redirect:', error);
            throw new Error('Authentication failed');
        }
    };
