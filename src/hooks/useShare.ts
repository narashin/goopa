'use client';

import { useEffect } from 'react';

import { errorToast, successToast } from '../components/ui/Toast';
import {
    useShareDataQuery,
    useShareMutation,
    useUnshareMutation,
} from '../queries/shareQueries';
import { useShareStore } from '../stores/shareStore';

export function useShare(userId: string | null) {
    const shareStore = useShareStore();
    const { data: shareData } = useShareDataQuery(userId);
    const shareMutation = useShareMutation();
    const unshareMutation = useUnshareMutation();

    useEffect(() => {
        if (shareData) {
            shareStore.setIsShared(shareData.isShared);
            shareStore.setLastShareId(shareData.lastShareId);
            if (
                shareData.isShared &&
                shareData.customUserId &&
                shareData.lastShareId
            ) {
                shareStore.setShareUrl(
                    `/share/${shareData.customUserId}/${shareData.lastShareId}`
                );
            } else {
                shareStore.setShareUrl('');
            }
        }
    }, [shareData, shareStore]);

    const handleShare = async (uid: string) => {
        try {
            const newShareId = await shareMutation.mutateAsync(uid);
            shareStore.setLastShareId(newShareId);
            shareStore.setIsShared(true);
            if (shareData?.customUserId) {
                shareStore.setShareUrl(
                    `/share/${shareData.customUserId}/${newShareId}`
                );
            }
            successToast('Goopa successfully shared');
        } catch (error) {
            console.error('Error sharing user:', error);
            errorToast('Failed to share goopa :(');
        }
    };

    const handleUnshare = async (uid: string) => {
        try {
            await unshareMutation.mutateAsync(uid);
            shareStore.setIsShared(false);
            shareStore.setShareUrl('');
            shareStore.setLastShareId(null);
            successToast('Goopa successfully unshared');
        } catch (error) {
            console.error('Error unsharing user:', error);
            errorToast('Failed to unshare goopa :(');
        }
    };

    return {
        isShared: shareStore.isShared,
        shareUrl: shareStore.shareUrl,
        lastShareId: shareStore.lastShareId,
        shareData,
        handleShare,
        handleUnshare,
    };
}
