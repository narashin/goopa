import {
    collection,
    doc,
    FirestoreDataConverter,
    getDoc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore';
import { nanoid } from 'nanoid';

import {
    AnonymousUserData,
    AuthenticatedUserData,
    UserData,
} from '../../types/user';
import { firestore } from '../firebase';

export const userConverter: FirestoreDataConverter<UserData> = {
    toFirestore: (userData: UserData) => {
        if (!userData.isAnonymous) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { shareHistory, ...dataToStore } = userData;
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
                shareHistory: data.ShareHistory || [],
            } as AuthenticatedUserData;
        }
    },
};

export const createUserIfNotExists = async (
    userId: string,
    userData: Partial<AuthenticatedUserData>
) => {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        const newUser: AuthenticatedUserData = {
            uid: userId,
            isAnonymous: false,
            customUserId: nanoid(),
            displayName: userData.displayName ?? '',
            email: userData.email ?? '',
            isShared: false,
            lastShareId: '',
            photoURL: userData.photoURL ?? '',
            shareHistory: [],
            emailVerified: userData.emailVerified ?? false,
            metadata: {
                creationTime: userData.metadata?.creationTime ?? '',
                lastSignInTime: userData.metadata?.lastSignInTime ?? '',
            },
            createdAt: new Date().toISOString(),
        };

        await setDoc(userRef, newUser);
    }
};

// ✅ Firestore에 사용자 데이터 저장
export const saveUser = async (user: AuthenticatedUserData): Promise<void> => {
    const userRef = doc(firestore, 'users', user.uid).withConverter(
        userConverter
    );
    await setDoc(userRef, user);
};

// ✅ Firestore에서 특정 유저의 `isShared` 상태 업데이트
export const updateUserShareStatus = async (
    userId: string,
    isShared: boolean
): Promise<void> => {
    const userRef = doc(firestore, 'users', userId);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
        throw new Error(`User with ID ${userId} not found.`);
    }

    await updateDoc(userRef, { isShared });
};

// ✅ Firestore에서 사용자 데이터 가져오기
export const getUser = async (uid: string): Promise<UserData> => {
    const userRef = doc(firestore, 'users', uid).withConverter(userConverter);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
        throw new Error('User not found');
    }

    return userSnapshot.data();
};

// ✅ Firestore에서 사용자 customUserId 가져오기
export const getCustomUserIdByUserId = async (uid: string): Promise<string> => {
    const user = await getUser(uid);
    if (user.isAnonymous) {
        throw new Error('Anonymous users do not have a customUserId');
    }
    return user.customUserId;
};

// ✅ customUserId를 이용해 userId 가져오기
export const getUserIdByCustomUserId = async (
    customUserId: string
): Promise<string | null> => {
    const usersQuery = query(
        collection(firestore, 'users'),
        where('customUserId', '==', customUserId)
    );
    const usersSnapshot = await getDocs(usersQuery);
    return usersSnapshot.empty ? null : usersSnapshot.docs[0].id;
};

// ✅ Firestore에서 `customUserId`로 사용자 전체 정보 가져오기
export const getUserByCustomUserId = async (
    customUserId: string
): Promise<UserData | null> => {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('customUserId', '==', customUserId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    return querySnapshot.docs[0].data() as UserData;
};
