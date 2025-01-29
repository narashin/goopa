import { addDoc, collection, getDocs } from 'firebase/firestore';

import { ITool } from '../types/app';
import { firestore } from './firebase';

export const addAppDataToFirestore = async (newApp: ITool, userId: string) => {
    try {
        const appsRef = collection(firestore, 'users', userId, 'apps');
        const docRef = await addDoc(appsRef, newApp);
        console.log('App added to Firestore with ID: ', docRef.id);
    } catch (error) {
        console.error('Error adding app to Firestore: ', error);
    }
};

export const fetchAppsFromFirestore = async (category: string) => {
    const appsRef = collection(firestore, category);
    const querySnapshot = await getDocs(appsRef);
    const appsList = querySnapshot.docs.map((doc) => doc.data());
    return appsList;
};
