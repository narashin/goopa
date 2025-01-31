import {
    collection, deleteDoc, doc, FirestoreDataConverter, getDoc, getDocs, query,
    setDoc, updateDoc, where,
} from 'firebase/firestore';

import { ITool } from '../types/app';
import { AppCategoryType } from '../types/category';
import { firestore } from './firebase';

export const updateUserPublishStatus = async (
    userId: string,
    isPublished: boolean
): Promise<void> => {
    try {
        const userSettingsRef = doc(firestore, 'users', userId, 'settings');

        const publishData = {
            isPublished: isPublished,
            publishDate: isPublished ? new Date().toISOString() : '',
        };

        await setDoc(userSettingsRef, publishData, { merge: true });

        console.log(`Updated User(${userId}) Publish Status`, publishData);
    } catch (error) {
        console.error('Error updating user publish status:', error);
        throw error;
    }
};

export const getUserPublishStatus = async (
    userId: string
): Promise<{ isPublished: boolean; publishDate: string }> => {
    try {
        const userSettingsRef = doc(firestore, 'users', userId, 'settings');
        const docSnap = await getDoc(userSettingsRef);

        if (!docSnap.exists()) {
            return { isPublished: false, publishDate: '' };
        }

        const data = docSnap.data();
        return {
            isPublished: data.isPublished ?? false,
            publishDate: data.publishDate ?? '',
        };
    } catch (error) {
        console.error('Error fetching user publish status:', error);
        throw error;
    }
};

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
