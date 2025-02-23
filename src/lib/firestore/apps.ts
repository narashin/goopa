import {
    collection, deleteDoc, doc, getDocs, setDoc, updateDoc,
} from 'firebase/firestore';

import { AppCategoryType, SubCategoryType } from '../../types/category';
import { ITool } from '../../types/item';
import { firestore } from '../firebase';
import { removeUndefinedFields } from '../utils';
import { getUserIdByCustomUserId } from './users';

// ✅ 특정 사용자 앱 가져오기
export const getUserApps = async (userId: string): Promise<ITool[]> => {
    const appsSnapshot = await getDocs(collection(firestore, 'apps'));
    return appsSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }) as ITool)
        .filter((app) => app.userId === userId); // userId로 필터링
};

// ✅ 특정 카테고리의 앱 가져오기
export const getUserAppsByCategory = async (
    userId: string,
    category: AppCategoryType,
    subCategory?: SubCategoryType | null
): Promise<ITool[]> => {
    const appsSnapshot = await getDocs(collection(firestore, 'apps'));
    const apps = appsSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }) as ITool)
        .filter((app) => app.userId === userId && app.category === category);

    if (category === AppCategoryType.Advanced) {
        if (subCategory === SubCategoryType.None) {
            return [];
        }

        return apps.filter((app) => app.subCategory === subCategory);
    }

    return apps;
};

// ✅ 특정 유저의 customUserId 기반으로 앱 가져오기
export const getAppsByCustomUserId = async (
    customUserId: string,
    category: AppCategoryType,
    subCategory?: SubCategoryType | null
): Promise<ITool[]> => {
    console.log('category', category, 'subCategory', subCategory);
    const userId = await getUserIdByCustomUserId(customUserId);
    if (!userId) return [];

    return getUserAppsByCategory(userId, category, subCategory);
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

    const appRef = doc(firestore, 'apps', appId);
    await updateDoc(appRef, removeUndefinedFields(updatedFields));
};

// ✅ 앱 삭제
export const deleteUserApp = async (
    userId: string,
    appId: string
): Promise<void> => {
    const appRef = doc(firestore, 'apps', appId);
    await deleteDoc(appRef);
};

// ✅ 공개된 앱 가져오기 (isShared가 true인 앱만 필터링)
export const getSharedApps = async (): Promise<ITool[]> => {
    const appsSnapshot = await getDocs(collection(firestore, 'apps'));
    return appsSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }) as ITool)
        .filter((app) => app.isShared === true); // isShared가 true인 앱만 필터링
};

// ✅ Firestore의 최상위 `apps` 컬렉션에 앱 등록 (isShared 여부에 따라 공개)
export const addSharedApp = async (appData: ITool): Promise<void> => {
    // isShared가 true일 경우만 공개 앱으로 간주
    if (appData.isShared) {
        const appRef = doc(firestore, 'apps', appData.id);
        await setDoc(appRef, {
            ...appData,
            id: appData.id,
            ownerId: appData.userId,
        });
    } else {
        console.log(`❌ App ${appData.id} is not marked as shared.`);
    }
};

// ✅ 공개 앱 등록 해제 (isShared를 false로 업데이트)
export const deleteSharedApp = async (appId: string): Promise<void> => {
    const appRef = doc(firestore, 'apps', appId);
    await updateDoc(appRef, { isShared: false });
};
