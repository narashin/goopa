import type React from 'react';
import ReactDOM from 'react-dom';

import { ITool } from '../../../types/app';

interface DeleteConfirmModalProps {
    app: ITool;
    onConfirm: () => void;
    onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    app,
    onConfirm,
    onCancel,
}) => {
    const handleCancel = (e: React.MouseEvent) => {
        e.stopPropagation();
        onCancel();
    };

    const handleConfirm = (e: React.MouseEvent) => {
        e.stopPropagation();
        onConfirm();
    };
    const modalContent = (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-[2px]">
            <div className="bg-[#f6f6f6] w-[320px] rounded-lg shadow-xl">
                <div className="h-[12px] bg-[#bdbdbd] rounded-t-lg" />

                <div className="p-4 pt-3">
                    <div className="flex items-start space-x-4">
                        <div className="text-2xl mt-1 w-8 h-8 flex items-center justify-center">
                            🗑️
                        </div>
                        <div className="flex-1">
                            <h2 className="text-[13px] font-semibold text-gray-800 mb-1">
                                Delete {app.name}
                            </h2>
                            <p className="text-[11px] text-gray-600 mb-4">
                                Are you sure you want to delete the app{' '}
                                {app.name}? This operation cannot be cancelled.
                            </p>

                            <div className="flex justify-end space-x-2">
                                <button
                                    className="px-3 py-1 text-[11px] bg-white border border-gray-300 rounded-[4px] hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors shadow-sm"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-3 py-1 text-[11px] bg-[#ff3b30] text-white rounded-[4px] hover:bg-[#d63a2f] focus:outline-none focus:ring-1 focus:ring-red-400 transition-colors shadow-sm"
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

    return ReactDOM.createPortal(modalContent, document.body);
};
