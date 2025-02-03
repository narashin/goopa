import {
    collection,
    deleteDoc,
    doc,
    FirestoreDataConverter,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore';
import { nanoid } from 'nanoid';

import { ITool } from '../types/app';
import { AppCategoryType } from '../types/category';
import { UserData } from './auth';
import { firestore } from './firebase';

export const addAppToFirestore = async (
    userId: string,
    appData: ITool
): Promise<ITool> => {
    try {
        const appsCollectionRef = collection(
            firestore,
            'users',
            userId,
            'apps'
        );
        const newAppDocRef = doc(appsCollectionRef, appData.id);
        const newApp: ITool = { ...appData };
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
    const appsRef = collection(firestore, 'apps');
    const q = query(appsRef, where('category', '==', category));

    const querySnapshot = await getDocs(q);
    const appsList: ITool[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name,
            category: data.category,
            icon: data.icon,
            downloadUrl: data.downloadUrl,
        };
    });

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

        // 사용자의 'apps' 하위 컬렉션에서 앱을 가져옵니다.
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
            app.downloadUrl &&
            app.downloadUrl.toLowerCase().includes(lowercaseQuery);

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
