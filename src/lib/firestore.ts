import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';

import { ITool } from '../types/app';
import { AppCategoryType } from '../types/category';
import { firestore } from './firebase';

export const addAppToFirestore = async (newApp: ITool, userId: string) => {
    try {
        const appsRef = collection(firestore, 'users', userId, 'apps');
        const docRef = await addDoc(appsRef, newApp);
        console.log('App added to Firestore with ID: ', docRef.id);
    } catch (error) {
        console.error('Error adding app to Firestore: ', error);
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
