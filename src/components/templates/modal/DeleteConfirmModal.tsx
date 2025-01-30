import type React from 'react';
import ReactDOM from 'react-dom';

interface DeleteConfirmModalProps {
    appName: string;
    onConfirm: (e: React.MouseEvent) => void;
    onCancel: (e: React.MouseEvent) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    appName,
    onConfirm,
    onCancel,
}) => {
    const modalContent = (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-xl font-bold mb-4">앱 삭제 확인</h2>
                <p className="mb-6">
                    정말로 {appName} 앱을 삭제하시겠습니까? 이 작업은 되돌릴수
                    없습니다.
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        취소
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        삭제
                    </button>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};
