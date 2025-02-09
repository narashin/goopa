import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { useAuth } from '../../../hooks/useAuth';
import { useItems } from '../../../hooks/useItem';
import { AppCategoryType } from '../../../types/category';
import { ITool } from '../../../types/item';
import { AddNewAppForm } from '../form/AddNewAppForm';

interface AddNewAppModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentCategory: AppCategoryType;
    onSubmit: (newApp: ITool) => void;
}

export const AddNewAppModal: React.FC<AddNewAppModalProps> = ({
    isOpen,
    onClose,
    currentCategory,
    onSubmit,
}) => {
    const { user } = useAuth();
    const { addItem } = useItems();
    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setModalRoot(document.body);
    }, []);

    const handleFormSubmit = async (
        newApp: Omit<ITool, 'id' | 'starCount' | 'userId'>
    ) => {
        if (user) {
            try {
                await addItem(newApp);
                onSubmit(newApp as ITool); // 타입 단언을 사용합니다. 실제로는 id가 생성되어 반환될 것입니다.
                onClose();
            } catch (error) {
                console.error('앱 추가 실패:', error);
                // 여기에 에러 처리 로직을 추가할 수 있습니다 (예: 사용자에게 알림)
            }
        } else {
            console.error('사용자가 인증되지 않았습니다');
            // 사용자가 인증되지 않은 경우의 처리를 추가할 수 있습니다
        }
    };

    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-[2px]">
            <div className="bg-[#f6f6f6] w-[480px] rounded-lg shadow-xl">
                <div className="h-[12px] bg-[#bdbdbd] rounded-t-lg" />
                <div className="px-4 py-2 flex items-center">
                    <div className="flex space-x-2">
                        <button
                            onClick={onClose}
                            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 focus:outline-none"
                        ></button>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <h2 className="text-center flex-grow text-sm font-semibold text-gray-700">
                        Add New App
                    </h2>
                </div>
                <div className="p-6 bg-white rounded-b-lg">
                    <AddNewAppForm
                        onSubmit={handleFormSubmit}
                        onClose={onClose}
                        currentCategory={currentCategory}
                    />
                </div>
            </div>
        </div>
    );

    return modalRoot ? ReactDOM.createPortal(modalContent, modalRoot) : null;
};
