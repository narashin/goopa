import type React from 'react';

import Image from 'next/image';

import { Icon } from '../../../types/icon';
import { ModalType } from '../../../types/modal';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    type?: ModalType;
    image?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = 'warn',
    image,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-[2px]">
            <div className="bg-[#f6f6f6] w-[320px] rounded-lg shadow-xl">
                <div className="h-[12px] bg-[#bdbdbd] rounded-t-lg" />

                <div className="p-4 pt-3">
                    <div className="flex items-start space-x-4">
                        <div className="text-2xl mt-1 w-8 h-8 flex items-center justify-center">
                            {image ? (
                                <Image
                                    src={image}
                                    alt="Modal Icon"
                                    width={32}
                                    height={32}
                                    className="object-contain"
                                />
                            ) : (
                                Icon[type]
                            )}
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
                                    className="px-3 py-1 text-[11px] bg-white border border-gray-300 rounded-[4px] hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors shadow-sm"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-3 py-1 text-[11px] bg-[#007AFF] text-white rounded-[4px] hover:bg-[#0063CC] focus:outline-none focus:ring-1 focus:ring-blue-400 transition-colors shadow-sm"
                                    onClick={onConfirm}
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
};
