import type { ShareHistoryData } from './share'; // ✅ share.ts에서 가져오기

export interface BaseUserData {
    uid: string;
    isAnonymous: boolean;
    createdAt: string;
}

export interface AnonymousUserData extends BaseUserData {
    isAnonymous: true;
}

export interface AuthenticatedUserData extends BaseUserData {
    isAnonymous: false;
    customUserId: string;
    displayName: string;
    email: string;
    isShared: boolean;
    lastShareId?: string;
    photoURL: string;
    shareHistory: ShareHistoryData[]; // ✅ `ShareGoopaData` 대신 `ShareHistoryData` 사용
    emailVerified: boolean;
    metadata: {
        creationTime: string;
        lastSignInTime: string;
    };
}

export type UserData = AnonymousUserData | AuthenticatedUserData;
