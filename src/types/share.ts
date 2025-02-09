export interface ShareData {
    isShared: boolean;
    lastShareId: string | null;
    customUserId: string | null;
    startedAt: string;
    endedAt: string | null;
    shareUrl: string | null;
    shareHistory: ShareHistoryData[];
}

export interface ShareHistoryData {
    ShareId: string;
    startedAt: string;
    endedAt: string | null;
}
