import { ShareHistoryData } from './share';

export interface BaseUserData {
    uid: string;
    isAnonymous: boolean;
    createdAt: string;
}

export interface AuthenticatedUserData extends BaseUserData {
    isAnonymous: false;
    customUserId: string;
    displayName: string;
    email: string;
    isShared: boolean;
    lastShareId?: string;
    photoURL: string;
    shareHistory: ShareHistoryData[];
    emailVerified: boolean;
    metadata: {
        creationTime: string;
        lastSignInTime: string;
    };
}

export type UserData = BaseUserData | AuthenticatedUserData;
