import {
    collection, deleteDoc, doc, FirestoreDataConverter, getDoc, getDocs, query,
    setDoc, updateDoc, where,
} from 'firebase/firestore';
import { nanoid } from 'nanoid';

import { ITool } from '../types/app';
import { AppCategoryType } from '../types/category';
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
        console.log('App added successfully with ID:', newAppDocRef.id);
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

export const updateAppDescription = async (
    userId: string,
    appId: string,
    description: string
) => {
    console.log('Updating app description:', { userId, appId, description });
    try {
        const appDocRef = doc(firestore, 'users', userId, 'apps', appId);
        console.log('Document reference:', appDocRef.path);

        // 문서가 존재하는지 확인
        const docSnap = await getDoc(appDocRef);
        console.log('Document exists:', docSnap.exists());

        if (docSnap.exists()) {
            await updateDoc(appDocRef, {
                description: description,
            });
            console.log('App description updated successfully');
        } else {
            console.error('No document found to update');
            throw new Error('No document found to update');
        }
    } catch (error) {
        console.error('Error updating app description:', error);
        throw error; // 원래 에러를 그대로 던집니다.
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
        console.log('App updated successfully');
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

export const fetchAllAppsFromFirestore = async (): Promise<ITool[]> => {
    try {
        const appsCollection = collection(firestore, 'apps');
        const appsSnapshot = await getDocs(appsCollection);
        const apps: ITool[] = [];

        appsSnapshot.forEach((doc) => {
            const appData = doc.data() as ITool;
            apps.push({ ...appData, id: doc.id });
        });

        return apps;
    } catch (error) {
        console.error('앱 데이터를 가져오는 중 오류 발생:', error);
        return [];
    }
};

export const deleteAppFromFirestore = async (userId: string, appId: string) => {
    try {
        const appDocRef = doc(firestore, 'users', userId, 'apps', appId);
        await deleteDoc(appDocRef);
        console.log('App deleted successfully');
    } catch (error) {
        console.error('Error deleting app:', error);
        throw error;
    }
};

/*
 * ---------------------------------- Publish를 위한 Firestore 메서드
 */

/**
 * 공개 이력을 위한 타입
 */
export interface PublishHistoryRecord {
    publishId: string;
    startedAt: string;
    endedAt: string | null; // null이면 아직 공개 중
}

/**
 * 사용자 공개 상태 타입
 */
export interface UserPublishStatus {
    isPublished: boolean;
    publishHistory: PublishHistoryRecord[];
    latestPublishId: string;
}

/**
 * 사용자의 공개 상태를 가져오는 함수
 * @param userId - 사용자 ID
 * @returns 공개 상태 정보 (isPublished, publishHistory, latestPublishId)
 */
export const getUserPublishStatus = async (
    userId: string
): Promise<UserPublishStatus> => {
    try {
        const userSettingsRef = doc(
            firestore,
            'users',
            userId,
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

/**
 * 사용자의 공개 상태를 업데이트하고, 새로운 publishId를 추가하는 함수
 * @param userId - 사용자 ID
 * @param isPublished - 공개 여부
 * @returns 생성된 publishId
 */
export const updateUserPublishStatus = async (
    userId: string,
    isPublished: boolean
): Promise<string> => {
    try {
        const userSettingsRef = doc(
            firestore,
            'users',
            userId,
            'settings',
            'publish'
        );
        const docSnap = await getDoc(userSettingsRef);

        let publishHistory: PublishHistoryRecord[] = [];

        if (docSnap.exists()) {
            publishHistory =
                (docSnap.data()?.publishHistory as PublishHistoryRecord[]) ??
                [];
        }

        // 새로운 publishId 생성
        const newPublishId = nanoid();
        const newPublishData = {
            publishId: newPublishId,
            startedAt: new Date().toISOString(),
            endedAt: null, // 종료되지 않은 상태
        };

        const updatedHistory = [...publishHistory, newPublishData];

        // 기존 데이터를 유지하면서 새로운 공개 기록 추가
        await updateDoc(userSettingsRef, {
            isPublished,
            publishHistory: updatedHistory,
            latestPublishId: newPublishId, // 최신 publishId 유지
        });

        console.log(`Updated User(${userId}) Publish Status`, newPublishData);
        return newPublishId;
    } catch (error) {
        console.error('Error updating user publish status:', error);
        throw error;
    }
};

/**
 * 특정 publishId를 종료하는 함수 (endedAt 업데이트)
 * @param userId - 사용자 ID
 * @param publishId - 종료할 publishId
 */
export const endUserPublish = async (
    userId: string,
    publishId: string
): Promise<void> => {
    try {
        const userSettingsRef = doc(
            firestore,
            'users',
            userId,
            'settings',
            'publish'
        );
        const docSnap = await getDoc(userSettingsRef);

        if (!docSnap.exists()) return;

        const publishHistory: PublishHistoryRecord[] =
            docSnap.data()?.publishHistory ?? [];

        const updatedHistory = publishHistory.map((entry) =>
            entry.publishId === publishId
                ? { ...entry, endedAt: new Date().toISOString() }
                : entry
        );

        await updateDoc(userSettingsRef, {
            publishHistory: updatedHistory,
        });

        console.log(`Ended publishId ${publishId} for user ${userId}`);
    } catch (error) {
        console.error('Error ending user publish:', error);
        throw error;
    }
};
