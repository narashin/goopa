import { getRedirectResult, signInWithPopup, User } from 'firebase/auth';
import {
    doc,
    FirestoreDataConverter,
    getDoc,
    setDoc,
} from 'firebase/firestore';
import { nanoid } from 'nanoid';

import {
    AnonymousUserData,
    AuthenticatedUserData,
    UserData,
} from '../types/user';
import { auth, firestore, googleProvider } from './firebase';

export const userConverter: FirestoreDataConverter<UserData> = {
    toFirestore: (userData: UserData) => {
        if (!userData.isAnonymous) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { ShareHistory, ...dataToStore } = userData;
            return dataToStore;
        }
        return userData;
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        if (data.isAnonymous) {
            return {
                uid: snapshot.id,
                isAnonymous: true,
                createdAt: data.createdAt,
            } as AnonymousUserData;
        } else {
            return {
                ...data,
                uid: snapshot.id,
                isAnonymous: false,
                ShareHistory: data.ShareHistory || [],
            } as AuthenticatedUserData;
        }
    },
};

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
        ShareHistory: [],
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
        const userRef = doc(firestore, 'users', result.user.uid).withConverter(
            userConverter
        );
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
            const newUserData = createUserData(result.user);
            await setDoc(userRef, newUserData);
            return newUserData;
        }

        return userSnapshot.data() as AuthenticatedUserData;
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
                const userRef = doc(
                    firestore,
                    'users',
                    result.user.uid
                ).withConverter(userConverter);
                const userSnapshot = await getDoc(userRef);

                if (!userSnapshot.exists()) {
                    const newUserData = createUserData(result.user);
                    await setDoc(userRef, newUserData);
                    return newUserData;
                }

                return userSnapshot.data() as AuthenticatedUserData;
            }
            return null;
        } catch (error) {
            console.error('Error handling Google redirect:', error);
            throw new Error('Authentication failed');
        }
    };

export const getUser = async (uid: string): Promise<UserData> => {
    const userRef = doc(firestore, 'users', uid).withConverter(userConverter);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
        throw new Error('User not found');
    }

    return userSnapshot.data();
};

export const getCustomUserId = async (uid: string): Promise<string> => {
    const user = await getUser(uid);
    if (user.isAnonymous) {
        throw new Error('Anonymous users do not have a customUserId');
    }
    return user.customUserId;
};
