import {
    collection,
    deleteDoc,
    deleteField,
    doc,
    DocumentData,
    FirestoreDataConverter,
    getDoc,
    getDocs,
    increment,
    onSnapshot,
    query,
    setDoc,
    updateDoc,
    where,
    writeBatch,
} from 'firebase/firestore';
import { nanoid } from 'nanoid';

import { AppCategoryType } from '../types/category';
import { ITool } from '../types/item';
import { AuthenticatedUserData, UserData } from '../types/user';
import { userConverter } from './auth';
import { firestore } from './firebase';

export const addAppToFirestore = async (
    userId: string,
    appData: Omit<ITool, 'starCount'>
): Promise<ITool> => {
    try {
        const userDocRef = doc(firestore, 'users', userId);
        const appsCollectionRef = collection(userDocRef, 'apps');
        const newAppDocRef = doc(appsCollectionRef, appData.id);
        const newApp: ITool = { ...appData, starCount: 0 };
        await setDoc(newAppDocRef, newApp);

        return newApp;
    } catch (error) {
        console.error('Error adding app:', error);
        throw error;
    }
};

export const getAppsFromFirestore = async (
    userId: string
): Promise<ITool[]> => {
    try {
        const userDocRef = doc(firestore, 'users', userId);
        const appsCollection = collection(userDocRef, 'apps');
        const appsSnapshot = await getDocs(appsCollection);
        const apps: ITool[] = [];

        appsSnapshot.forEach((doc) => {
            const appData = doc.data() as ITool;
            apps.push({ ...appData, id: doc.id });
        });

        return apps;
    } catch (error) {
        console.error('Error fetching apps from Firestore: ', error);
        return [];
    }
};

const appConverter: FirestoreDataConverter<ITool> = {
    toFirestore: (app: ITool) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...data } = app;
        return data;
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return { id: snapshot.id, ...data } as ITool;
    },
};

export const updateAppInFirestore = async (
    userId: string,
    updatedApp: ITool
): Promise<void> => {
    try {
        const appDocRef = doc(
            firestore,
            'users',
            userId,
            'apps',
            updatedApp.id
        ).withConverter(appConverter);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...updateData } = updatedApp;

        await updateDoc(appDocRef, updateData);
    } catch (error) {
        console.error('Error updating app:', error);
        throw error;
    }
};

export const getAppsByCategoryAndUserIdFromFirestore = async (
    category: AppCategoryType,
    userId: string
): Promise<ITool[]> => {
    try {
        const userDocRef = doc(firestore, 'users', userId);
        const appsCollection = collection(userDocRef, 'apps');
        const querySnapshot = await getDocs(
            query(appsCollection, where('category', '==', category))
        );

        const apps: ITool[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return { id: doc.id, ...data } as ITool;
        });

        return apps;
    } catch (error) {
        console.error('Error fetching apps by category and userId:', error);
        return [];
    }
};

export const getAppsByCategoryAndCustomUserIdFromFirestore = async (
    category: AppCategoryType,
    customUserId: string
): Promise<ITool[]> => {
    const usersRef = collection(firestore, 'users');
    const userQuery = query(
        usersRef,
        where('customUserId', '==', customUserId)
    );
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
        console.error('User not found with the given customUserId');
        return [];
    }

    const userId = userSnapshot.docs[0].id;

    const appsRef = collection(firestore, 'users', userId, 'apps');
    const appsQuery = query(appsRef, where('category', '==', category));

    const querySnapshot = await getDocs(appsQuery);
    const userApps: ITool[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name,
            category: data.category,
            userId: userId,
            icon: data.icon,
            url: data.url,
            isShared: data.isShared || false,
            starCount: data.starCount || 0,
        };
    });

    return userApps;
};

export const getAppsByCustomUserId = async (
    customUserId: string
): Promise<ITool[]> => {
    try {
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('customUserId', '==', customUserId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return [];
        }

        const userDoc = querySnapshot.docs[0];
        const uid = userDoc.id;

        const userAppsRef = collection(firestore, 'users', uid, 'apps');
        const appsSnapshot = await getDocs(userAppsRef);

        const apps = appsSnapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as ITool
        );

        return apps;
    } catch (error) {
        console.error('Error fetching apps by customUserId:', error);
        return [];
    }
};

export const deleteAppFromFirestore = async (userId: string, appId: string) => {
    try {
        const appDocRef = doc(firestore, 'users', userId, 'apps', appId);
        await deleteDoc(appDocRef);
    } catch (error) {
        console.error('Error deleting app:', error);
        throw error;
    }
};

export const searchAppsByCustomUserId = async (
    searchQuery: string,
    customUserId: string
): Promise<ITool[]> => {
    try {
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('customUserId', '==', customUserId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return [];
        }

        const userDoc = querySnapshot.docs[0];
        const uid = userDoc.id;

        const userAppsRef = collection(firestore, 'users', uid, 'apps');
        const appsSnapshot = await getDocs(userAppsRef);

        const apps = appsSnapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as ITool
        );

        return filterApps(apps, searchQuery);
    } catch (error) {
        console.error('Error searching apps by customUserId:', error);
        return [];
    }
};

export const searchAppsByUserId = async (
    searchQuery: string,
    userId: string
): Promise<ITool[]> => {
    try {
        const userAppsRef = collection(firestore, 'users', userId, 'apps');
        const appsSnapshot = await getDocs(userAppsRef);

        const apps = appsSnapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as ITool
        );

        const filteredApps = filterApps(apps, searchQuery);

        return filteredApps;
    } catch (error) {
        console.error('Error searching apps by userId:', error);
        return [];
    }
};

const filterApps = (apps: ITool[], searchQuery: string): ITool[] => {
    const lowercaseQuery = searchQuery.toLowerCase();
    return apps.filter((app) => {
        const nameMatch = app.name.toLowerCase().includes(lowercaseQuery);
        const descriptionMatch =
            app.description &&
            app.description.toLowerCase().includes(lowercaseQuery);
        const urlMatch =
            app.url && app.url.toLowerCase().includes(lowercaseQuery);

        return nameMatch || descriptionMatch || urlMatch;
    });
};

/*
 * ---------------------------------- Share를 위한 Firestore 메서드
 */

/**
 * 공개 이력을 위한 타입
 */
export interface ShareGoopaData {
    ShareId: string;
    startedAt: string;
    endedAt: string | null;
}

export interface ShareDocData {
    ShareHistory: ShareGoopaData[];
    lastShareId: string;
    isShared: boolean;
}

export interface UserSettings {
    ShareDocData: ShareDocData;
}
export interface UserShareStatus {
    isShared: boolean;
    ShareHistory: ShareGoopaData[];
    lastShareId: string;
}

export async function getUidByCustomUserId(
    customUserId: string
): Promise<string | null> {
    if (!customUserId) {
        return null;
    }

    try {
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('customUserId', '==', customUserId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        // 첫 번째 일치하는 문서의 ID (uid)를 반환
        return querySnapshot.docs[0].id;
    } catch (error) {
        console.error('uid를 찾는 중 오류 발생:', error);
        return null;
    }
}

export const getUserShareStatus = async (
    customUserId: string
): Promise<UserShareStatus> => {
    try {
        const user = await getUserByCustomUserId(customUserId);
        if (!user) {
            console.error('customUserId에 해당하는 사용자를 찾을 수 없습니다.');
            return {
                isShared: false,
                ShareHistory: [],
                lastShareId: '',
            };
        }

        const userSettingsRef = doc(
            firestore,
            'users',
            user.uid,
            'settings',
            'Share'
        );
        const docSnap = await getDoc(userSettingsRef);

        if (!docSnap.exists()) {
            return {
                isShared: false,
                ShareHistory: [],
                lastShareId: '',
            };
        }

        const data = docSnap.data();
        return {
            isShared: data.isShared ?? false,
            ShareHistory: data.ShareHistory ?? [],
            lastShareId: data.latestShareId ?? '',
        };
    } catch (error) {
        console.error('Error fetching user Share status:', error);
        throw error;
    }
};

export async function getUserAllShareData(
    uid: string
): Promise<UserData | null> {
    if (!uid) {
        return null;
    }

    try {
        const userDocRef = doc(firestore, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            return null;
        }

        return userDocSnap.data() as UserData;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

export async function getUserByCustomUserId(
    customUserId: string
): Promise<AuthenticatedUserData | null> {
    const usersRef = collection(firestore, 'users').withConverter(
        userConverter
    );
    const q = query(usersRef, where('customUserId', '==', customUserId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    const userData = querySnapshot.docs[0].data();

    if (userData.isAnonymous) {
        console.error('익명 사용자는 customUserId를 가질 수 없습니다.');
        return null;
    }

    const authenticatedUserData = userData as AuthenticatedUserData;

    return authenticatedUserData;
}

export async function getUserShareDataByShareId(
    customUserId: string,
    ShareId: string
): Promise<AuthenticatedUserData | null> {
    if (!customUserId || !ShareId) {
        return null;
    }

    const user = await getUserByCustomUserId(customUserId);
    if (!user) {
        console.error('customUserId에 해당하는 사용자를 찾을 수 없습니다.');
        return null;
    }

    try {
        const userDocRef = doc(firestore, 'users', user.uid).withConverter(
            userConverter
        );
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            return null;
        }

        const userData = userDocSnap.data();

        if (userData.isAnonymous) {
            console.error('익명 사용자는 공유 데이터를 가질 수 없습니다.');
            return null;
        }

        const authenticatedUserData = userData as AuthenticatedUserData;

        if (!Array.isArray(authenticatedUserData.ShareHistory)) {
            console.error('ShareHistory가 배열이 아닙니다.');
            return null;
        }

        const currentShare = authenticatedUserData.ShareHistory.find(
            (p: ShareGoopaData) => p.ShareId === ShareId
        );

        if (!currentShare) {
            console.error(
                '해당 ShareId를 가진 공유 데이터를 찾을 수 없습니다.'
            );
            return null;
        }

        return {
            ...authenticatedUserData,
            isShared: currentShare.endedAt === null,
        };
    } catch (error) {
        console.error('사용자 공유 데이터를 가져오는 중 오류 발생:', error);
        return null;
    }
}

export const shareUser = async (userUid: string): Promise<string> => {
    try {
        const userDocRef = doc(firestore, 'users', userUid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            throw new Error('User document does not exist');
        }

        const userData = userDoc.data();
        const shareHistory = userData?.shareHistory || [];

        // 새로운 shareId 생성
        const newShareId = nanoid();
        const startedAt = new Date().toISOString();

        // 이전 share 종료 처리
        if (shareHistory.length > 0) {
            const lastShare = shareHistory[shareHistory.length - 1];
            if (lastShare.endedAt === null) {
                lastShare.endedAt = startedAt;
            }
        }

        // 새로운 share 정보 추가
        const newShareInfo = {
            shareId: newShareId,
            startedAt,
            endedAt: null,
        };
        shareHistory.push(newShareInfo);

        // Firestore 업데이트
        await setDoc(
            userDocRef,
            {
                shareHistory,
                isShared: true,
                lastShareId: newShareId,
            },
            { merge: true }
        );

        return newShareId;
    } catch (error) {
        console.error('Error sharing user:', error);
        throw error; // 에러를 throw하여 호출자가 처리할 수 있도록 함
    }
};

export async function unshareUser(userId: string): Promise<void> {
    if (!userId) {
        throw new Error('UID가 제공되지 않았습니다.');
    }

    try {
        const shareDocRef = doc(
            firestore,
            'users',
            userId,
            'settings',
            'share'
        );
        const shareDoc = await getDoc(shareDocRef);

        if (!shareDoc.exists()) {
            console.warn(
                '⚠️ 공유 문서가 존재하지 않습니다. Unshare 필요 없음.'
            );
            return;
        }

        const data = shareDoc.data();
        if (!data || !data.shareHistory || data.shareHistory.length === 0) {
            console.warn('⚠️ 공유 기록이 없습니다. Unshare 필요 없음.');
            return;
        }

        const now = new Date().toISOString();
        const updatedHistory: ShareGoopaData[] = [...data.shareHistory];
        const lastShareEntry = updatedHistory[updatedHistory.length - 1];

        if (lastShareEntry.endedAt === null) {
            lastShareEntry.endedAt = now;
        }

        await updateDoc(shareDocRef, {
            shareHistory: updatedHistory,
            isShared: false,
        });

        console.log('✅ 성공적으로 unshare 되었습니다.');
    } catch (error) {
        console.error('❌ Firestore에서 Unshare 실행 중 오류 발생:', error);
        throw error; // 에러를 throw하여 호출자가 처리할 수 있도록 함
    }
}

export const subscribeToUserData = (
    uid: string,
    callback: (data: UserData | null) => void
) => {
    const userDocRef = doc(firestore, 'users', uid);

    return onSnapshot(
        userDocRef,
        (docSnapshot) => {
            if (docSnapshot.exists()) {
                const userData = docSnapshot.data() as UserData;
                callback(userData);
            } else {
                callback(null);
            }
        },
        (error) => {
            console.error('사용자 데이터 구독 중 오류 발생:', error);
        }
    );
};

// ----------------- Star 관련
export const addStarToApp = async (userId: string, appId: string) => {
    console.log(`Adding star for user ${userId} to app ${appId}`);

    const userAppsCollection = collection(firestore, 'users', userId, 'apps');
    const appRef = doc(userAppsCollection, appId);

    try {
        const appDoc = await getDoc(appRef);
        console.log('App document path:', appRef.path);
        console.log('App document exists:', appDoc.exists());

        if (!appDoc.exists()) {
            console.error(
                `App document with id ${appId} does not exist in user's apps collection!`
            );
            console.log('Firestore instance:', firestore);
            throw new Error(`앱을 찾을 수 없습니다. (ID: ${appId})`);
        }

        console.log('App document data:', appDoc.data());

        const batch = writeBatch(firestore);

        // 사용자의 별표 정보 추가
        const userStarRef = doc(
            collection(firestore, 'users', userId, 'starredApps'),
            appId
        );
        batch.set(userStarRef, { appId });

        // 앱 문서 업데이트
        const currentData = appDoc.data() as ITool;
        const currentStarCount = currentData.starCount || 0;
        console.log('Current star count:', currentStarCount);

        batch.update(appRef, {
            starCount: increment(1),
            [`starredBy.${userId}`]: true,
        });

        await batch.commit();

        console.log('Star added successfully!');
        return true;
    } catch (error) {
        console.error('Error details:', {
            userId,
            appId,
            error,
            firestoreInstance: !!firestore,
            documentPath: appRef.path,
        });
        throw error;
    }
};

export const removeStarFromApp = async (userId: string, appId: string) => {
    const userAppsCollection = collection(firestore, 'users', userId, 'apps');
    const appRef = doc(userAppsCollection, appId);
    const userStarRef = doc(
        collection(firestore, 'users', userId, 'starredApps'),
        appId
    );

    try {
        const batch = writeBatch(firestore);

        batch.delete(userStarRef);
        batch.update(appRef, {
            starCount: increment(-1),
            [`starredBy.${userId}`]: deleteField(),
        });

        await batch.commit();
        console.log('Star removed successfully!');
        return true;
    } catch (error) {
        console.error('Error removing star:', error);
        throw error;
    }
};

export const getStarredAppsByUser = async (
    userId: string
): Promise<ITool[]> => {
    const starredAppsCollection = collection(
        firestore,
        'users',
        userId,
        'starredApps'
    );
    const userAppsCollection = collection(firestore, 'users', userId, 'apps');

    try {
        const querySnapshot = await getDocs(starredAppsCollection);
        const starredApps = await Promise.all(
            querySnapshot.docs.map(async (starredDoc) => {
                const appRef = doc(userAppsCollection, starredDoc.id);
                const appDoc = await getDoc(appRef);
                const appData = appDoc.data() as DocumentData | undefined;

                if (!appData) {
                    throw new Error(
                        `App data not found for id: ${starredDoc.id}`
                    );
                }

                return {
                    id: starredDoc.id,
                    name: appData.name,
                    category: appData.category,
                    userId: appData.userId,
                    icon: appData.icon,
                    tooltip: appData.tooltip,
                    url: appData.url,
                    starCount: appData.starCount || 0,
                } as ITool;
            })
        );
        return starredApps;
    } catch (error) {
        console.error('Error getting starred apps:', error);
        throw error;
    }
};

export const getStarCountForApp = async (
    userId: string,
    appId: string
): Promise<number> => {
    if (!userId || !appId) {
        console.error('Invalid userId or appId provided to getStarCountForApp');
        return 0;
    }

    const appRef = doc(collection(firestore, 'users', userId, 'apps'), appId);

    try {
        const appDoc = await getDoc(appRef);
        if (!appDoc.exists()) {
            console.warn(
                `App document not found for userId: ${userId}, appId: ${appId}`
            );
            return 0;
        }
        return appDoc.data()?.starCount || 0;
    } catch (error) {
        console.error('Error getting star count:', error);
        return 0;
    }
};

export const hasUserStarredApp = async (userId: string, appId: string) => {
    const userStarRef = doc(
        collection(firestore, 'users', userId, 'starredApps'),
        appId
    );

    try {
        const docSnap = await getDoc(userStarRef);
        return docSnap.exists();
    } catch (error) {
        console.error('Error checking if user starred app:', error);
        throw error;
    }
};

export const debugFirestoreCollection = async (
    userId: string,
    collectionName: string
) => {
    const collectionRef = collection(
        firestore,
        'users',
        userId,
        collectionName
    );
    try {
        const querySnapshot = await getDocs(collectionRef);
        console.log(
            `Documents in ${collectionName} collection for user ${userId}:`
        );
        querySnapshot.forEach((doc) => {
            console.log(doc.id, ' => ', doc.data());
        });
    } catch (error) {
        console.error(
            `Error fetching ${collectionName} collection for user ${userId}:`,
            error
        );
    }
};
