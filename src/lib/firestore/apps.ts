import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    setDoc,
    updateDoc,
} from 'firebase/firestore';

import { AppCategoryType } from '../../types/category';
import { ITool } from '../../types/item';
import { AuthenticatedUserData } from '../../types/user';
import { firestore } from '../firebase';
import { removeUndefinedFields } from '../utils';
import { getUser, getUserIdByCustomUserId } from './users';

// ✅ 사용자 앱 추가
export const addUserApp = async (
    userId: string,
    appData: ITool
): Promise<void> => {
    const appRef = doc(
        collection(firestore, 'users', userId, 'apps'),
        appData.id
    );
    await setDoc(appRef, appData);
};

// ✅ 특정 사용자 앱 가져오기
export const getUserApps = async (userId: string): Promise<ITool[]> => {
    const appsSnapshot = await getDocs(
        collection(firestore, 'users', userId, 'apps')
    );
    return appsSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as ITool
    );
};

// ✅ 특정 카테고리의 앱 가져오기
export const getUserAppsByCategory = async (
    userId: string,
    category: AppCategoryType
): Promise<ITool[]> => {
    const appsQuery = collection(firestore, 'users', userId, 'apps');
    const appsSnapshot = await getDocs(appsQuery);
    return appsSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }) as ITool)
        .filter((app) => app.category === category);
};

// ✅ 특정 유저의 customUserId 기반으로 앱 가져오기
export const getAppsByCustomUserId = async (
    customUserId: string
): Promise<ITool[]> => {
    const userId = await getUserIdByCustomUserId(customUserId);
    if (!userId) return [];

    const appsSnapshot = await getDocs(
        collection(firestore, 'users', userId, 'apps')
    );
    return appsSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as ITool
    );
};

// ✅ 특정 유저의 customUserId + 카테고리로 앱 가져오기
export const getAppsByCategoryAndCustomUserId = async (
    customUserId: string,
    category: AppCategoryType
): Promise<ITool[]> => {
    const userId = await getUserIdByCustomUserId(customUserId);
    if (!userId) return [];

    const appsSnapshot = await getDocs(
        collection(firestore, 'users', userId, 'apps')
    );
    return appsSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }) as ITool)
        .filter((app) => app.category === category);
};

// ✅ 앱 정보 업데이트
export const updateUserApp = async (
    userId: string,
    appId: string,
    updatedFields: Partial<ITool>
): Promise<void> => {
    if (!appId) {
        throw new Error('App ID is required for updating the document.');
    }

    const appRef = doc(firestore, 'users', userId, 'apps', appId);
    await updateDoc(appRef, removeUndefinedFields(updatedFields));
};

// ✅ 앱 삭제
export const deleteUserApp = async (
    userId: string,
    appId: string
): Promise<void> => {
    const appRef = doc(firestore, 'users', userId, 'apps', appId);
    await deleteDoc(appRef);
};

// ✅ Firestore에서 공개된 앱 가져오기 (userId 포함)
export const getPublicApps = async (): Promise<ITool[]> => {
    const appsSnapshot = await getDocs(collection(firestore, 'apps'));
    return appsSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as ITool
    );
};

// ✅ Firestore의 최상위 `apps` 컬렉션에 앱 등록
export const addPublicApp = async (appData: ITool): Promise<void> => {
    const user = (await getUser(appData.userId)) as AuthenticatedUserData;

    if (!user.isShared) {
        console.log(`❌ User ${appData.userId} is not sharing apps.`);
        return;
    }

    const appRef = doc(firestore, 'apps', appData.id);
    await setDoc(appRef, {
        ...appData,
        userId: appData.userId,
    });

    console.log(`✅ App ${appData.id} added to public apps.`);
};

// ✅ Firestore의 최상위 `apps` 컬렉션에 앱 등록 해제
export const deletePublicApp = async (appId: string): Promise<void> => {
    const appRef = doc(firestore, 'apps', appId);
    await deleteDoc(appRef);
    console.log(`🗑️ App ${appId} removed from public apps.`);
};
