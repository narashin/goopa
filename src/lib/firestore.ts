import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore';

import { ITool } from '../types/app';
import { AppCategoryType } from '../types/category';
import { firestore } from './firebase';

export const addAppToFirestore = async (
    appData: Omit<ITool, 'id'>,
    userId: string
): Promise<ITool> => {
    try {
        const appsCollectionRef = collection(
            firestore,
            'users',
            userId,
            'apps'
        );
        const newAppDocRef = doc(appsCollectionRef);
        const newApp: ITool = { ...appData, id: newAppDocRef.id };
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
            // 문서가 존재하면 'description' 필드를 추가 (기존 데이터는 그대로 유지)
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

export const fetchAppsFromFirestore = async (
    category: AppCategoryType
): Promise<ITool[]> => {
    const appsRef = collection(firestore, 'apps'); // 'apps' 컬렉션에서 데이터 가져오기
    const q = query(appsRef, where('category', '==', category)); // 'category'가 'Dev'인 앱들만 필터링

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
