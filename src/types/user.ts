import { ShareGoopaData } from '../lib/firestore';

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
    ShareHistory: ShareGoopaData[];
    emailVerified: boolean;
    metadata: {
        creationTime: string;
        lastSignInTime: string;
    };
}

export type UserData = AnonymousUserData | AuthenticatedUserData;
