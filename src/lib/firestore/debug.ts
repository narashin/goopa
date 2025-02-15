import { collection, getDocs } from 'firebase/firestore';

import { firestore } from '../firebase';

// ✅ 특정 유저의 Firestore 데이터 디버깅
export const debugFirestoreCollection = async (
    userId: string,
    collectionName: string
): Promise<void> => {
    const collectionRef = collection(
        firestore,
        'users',
        userId,
        collectionName
    );
    const querySnapshot = await getDocs(collectionRef);
    console.log(
        `Documents in ${collectionName} collection for user ${userId}:`
    );
    querySnapshot.forEach((doc) => console.log(doc.id, ' => ', doc.data()));
};
