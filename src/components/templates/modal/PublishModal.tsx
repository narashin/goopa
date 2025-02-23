'use client';

import type React from 'react';
import ReactDOM from 'react-dom';

import { toast } from 'react-toastify';

import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    onShare: () => Promise<string | null>;
    onUnshare: () => Promise<boolean>;
    isSharingAction: boolean;
    shareUrl?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
    isOpen,
    onClose,
    onShare,
    onUnshare,
    isSharingAction,
}) => {
    const copyToClipboard = useCopyToClipboard();

    const handleConfirm = async () => {
        try {
            if (isSharingAction) {
                const newShareUrl = await onShare();
                if (newShareUrl) {
                    const fullUrl = `${window.location.origin}${newShareUrl}`;
                    copyToClipboard(
                        fullUrl,
                        '🎉 Public URL copied to clipboard!'
                    );
                }
            } else {
                const success = await onUnshare();
                if (success) {
                    toast.info('Your Goopa is no longer publicly shared.', {
                        position: 'top-right',
                        autoClose: 3000,
                    });
                } else {
                    throw new Error('Failed to unshared');
                }
            }
            onClose();
        } catch (error) {
            console.error('Error during share/unshare:', error);
            toast.error('An error occurred. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    if (!isOpen) {
        return null;
    }

    const title = isSharingAction
        ? 'Share Confirmation'
        : 'Unshared Confirmation';
    const message = isSharingAction
        ? 'Your Goopa will be shared publicly. Do you want to proceed?'
        : 'Your Goopa will no longer be shared. Do you want to proceed?';

    const modalContent = (
        <div className="fixed inset-0 flex items-center justify-center z-[100]">
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-[2px]"
                onClick={onClose}
            ></div>
            <div className="bg-[#f6f6f6] w-[320px] rounded-lg shadow-xl relative">
                <div className="h-[12px] bg-[#bdbdbd] rounded-t-lg" />

                <div className="p-4 pt-3">
                    <div className="flex items-start space-x-4">
                        <div className="text-2xl mt-1 w-8 h-8 flex items-center justify-center">
                            {isSharingAction ? '🌍' : '🔒'}
                        </div>

                        <div className="flex-1">
                            <h2 className="text-[13px] font-semibold text-gray-800 mb-1">
                                {title}
                            </h2>
                            <p className="text-[11px] text-gray-600 mb-4">
                                {message}
                            </p>

                            <div className="flex justify-end space-x-2">
                                <button
                                    className="px-3 py-1 text-[11px] bg-white border border-gray-300 rounded-[4px] hover:bg-gray-50"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-3 py-1 text-[11px] bg-[#007AFF] text-white rounded-[4px] hover:bg-[#0063CC]"
                                    onClick={handleConfirm}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return isOpen ? ReactDOM.createPortal(modalContent, document.body) : null;
};
