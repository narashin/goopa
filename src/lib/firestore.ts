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

import { ITool } from '../types/app';
import { AppCategoryType } from '../types/category';
import { UserData } from './auth';
import { firestore } from './firebase';

export const addAppToFirestore = async (
    userId: string,
    appData: Omit<ITool, 'starCount'>
): Promise<ITool> => {
    try {
        const appsCollectionRef = collection(
            firestore,
            'users',
            userId,
            'apps'
        );
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
        const appsCollection = collection(firestore, 'users', userId, 'apps');
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

type UpdateData = Partial<Omit<ITool, 'id'>>;

export const updateApp = async (
    userId: string,
    updatedApp: ITool
): Promise<void> => {
    try {
        const appRef = doc(firestore, 'users', userId, 'apps', updatedApp.id);

        const filteredAppData: UpdateData = Object.fromEntries(
            Object.entries(updatedApp).filter(
                ([key, value]) => key !== 'id' && value !== undefined
            )
        ) as UpdateData;

        await updateDoc(appRef, filteredAppData);
    } catch (error) {
        console.error('Error updating app:', error);
        throw error;
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
export const fetchAppsFromFirestore = async (
    category: AppCategoryType
): Promise<ITool[]> => {
    const usersRef = collection(firestore, 'users');
    const userSnapshots = await getDocs(usersRef);

    const appsList: ITool[] = [];

    for (const userDoc of userSnapshots.docs) {
        const userId = userDoc.id;
        const appsRef = collection(firestore, 'users', userId, 'apps');
        const q = query(appsRef, where('category', '==', category));

        const querySnapshot = await getDocs(q);
        const userApps: ITool[] = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                category: data.category,
                userId: userId,
                icon: data.icon,
                url: data.url,
                starCount: data.starCount || 0,
            };
        });

        appsList.push(...userApps);
    }

    return appsList;
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
 * ---------------------------------- Publish를 위한 Firestore 메서드
 */

/**
 * 공개 이력을 위한 타입
 */
export interface PublishData {
    publishId: string;
    startedAt: string;
    endedAt: string | null;
}

export interface PublishDocData {
    publishHistory: PublishData[];
    lastPublishId: string;
    isPublished: boolean;
}

export interface UserSettings {
    publishDocData: PublishDocData;
}
export interface UserPublishStatus {
    isPublished: boolean;
    publishHistory: PublishData[];
    latestPublishId: string;
}

// customUserId로 uid를 찾는 함수
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

export const getUserPublishStatus = async (
    customUserId: string
): Promise<UserPublishStatus> => {
    try {
        const user = await getUserByCustomUserId(customUserId);
        if (!user) {
            console.error('customUserId에 해당하는 사용자를 찾을 수 없습니다.');
            return {
                isPublished: false,
                publishHistory: [],
                latestPublishId: '',
            };
        }

        const userSettingsRef = doc(
            firestore,
            'users',
            user.uid,
            'settings',
            'publish'
        );
        const docSnap = await getDoc(userSettingsRef);

        if (!docSnap.exists()) {
            return {
                isPublished: false,
                publishHistory: [],
                latestPublishId: '',
            };
        }

        const data = docSnap.data();
        return {
            isPublished: data.isPublished ?? false,
            publishHistory: data.publishHistory ?? [],
            latestPublishId: data.latestPublishId ?? '',
        };
    } catch (error) {
        console.error('Error fetching user publish status:', error);
        throw error;
    }
};

export async function getUserAllPublishData(
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
): Promise<UserData | null> {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('customUserId', '==', customUserId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    const userData = querySnapshot.docs[0].data() as Omit<
        UserData,
        'isPublished' | 'lastPublishId'
    >;
    const publishHistory = userData.publishHistory || [];

    const isPublished =
        publishHistory.length > 0 &&
        publishHistory[publishHistory.length - 1].endedAt === null;
    const lastPublishId =
        publishHistory.length > 0
            ? publishHistory[publishHistory.length - 1].publishId
            : undefined;

    return {
        ...userData,
        isPublished,
        lastPublishId,
        publishHistory: publishHistory as PublishData[],
    };
}

export async function getUserPublishDataByPublishId(
    customUserId: string,
    publishId: string
): Promise<UserData | null> {
    if (!customUserId || !publishId) {
        return null;
    }

    const user = await getUserByCustomUserId(customUserId);
    if (!user) {
        console.error('customUserId에 해당하는 사용자를 찾을 수 없습니다.');
        return {
            isPublished: false,
            publishHistory: [],
            lastPublishId: '',
            customUserId,
            displayName: '',
            createdAt: '',
            email: '',
            photoURL: '',
            uid: '',
        };
    }
    try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            return null;
        }

        const userData = userDocSnap.data() as UserData;

        if (!Array.isArray(userData.publishHistory)) {
            return null;
        }

        const currentPublish = userData.publishHistory.find(
            (p: PublishData) => p.publishId === publishId
        );

        if (!currentPublish) {
            return null;
        }

        return {
            customUserId: userData.customUserId,
            displayName: userData.displayName,
            createdAt: userData.createdAt,
            email: userData.email,
            photoURL: userData.photoURL,
            uid: userData.uid,
            publishHistory: userData.publishHistory,
            lastPublishId: userData.lastPublishId,
            isPublished: currentPublish.endedAt === null,
        };
    } catch (error) {
        console.error('사용자 공유 데이터를 가져오는 중 오류 발생:', error);
        return null;
    }
}

export const publishUser = async (userUid: string): Promise<string | null> => {
    try {
        const userDocRef = doc(firestore, 'users', userUid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            return null;
        }

        const userData = userDoc.data();
        const publishHistory = userData?.publishHistory || [];

        // 새로운 publishId 생성
        const newPublishId = nanoid();
        const startedAt = new Date().toISOString();

        // 이전 publish 종료 처리
        if (publishHistory.length > 0) {
            const lastPublish = publishHistory[publishHistory.length - 1];
            if (lastPublish.endedAt === null) {
                lastPublish.endedAt = startedAt;
            }
        }

        // 새로운 publish 정보 추가
        const newPublishInfo = {
            publishId: newPublishId,
            startedAt,
            endedAt: null,
        };
        publishHistory.push(newPublishInfo);

        // Firestore 업데이트
        await setDoc(
            userDocRef,
            {
                publishHistory,
                isPublished: true, // 명시적으로 isPublished 필드 추가
                lastPublishId: newPublishId, // 명시적으로 lastPublishId 필드 추가
            },
            { merge: true }
        );

        return newPublishId;
    } catch (error) {
        console.error('Error publishing user:', error);
        return null;
    }
};

export async function unpublishUser(uid: string): Promise<boolean> {
    if (!uid) {
        console.warn('⚠️ UID가 제공되지 않았습니다.');
        return false;
    }

    try {
        const publishDocRef = doc(
            firestore,
            'users',
            uid,
            'settings',
            'publish'
        );
        const publishDoc = await getDoc(publishDocRef);

        if (!publishDoc.exists()) {
            console.warn(
                '⚠️ 퍼블리시 문서가 존재하지 않습니다. Unpublish 필요 없음.'
            );
            return false;
        }

        const data = publishDoc.data();
        if (!data || !data.publishHistory || data.publishHistory.length === 0) {
            console.warn('⚠️ 퍼블리시 기록이 없습니다. Unpublish 필요 없음.');
            return false;
        }

        const now = new Date().toISOString();
        const updatedHistory: PublishData[] = [...data.publishHistory];
        const lastPublishEntry = updatedHistory[updatedHistory.length - 1];

        if (lastPublishEntry.endedAt === null) {
            lastPublishEntry.endedAt = now;
        }

        await updateDoc(publishDocRef, {
            publishHistory: updatedHistory,
            isPublished: false,
        });

        return true;
    } catch (error) {
        console.error('❌ Firestore에서 Unpublish 실행 중 오류 발생:', error);
        return false;
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
