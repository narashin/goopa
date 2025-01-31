import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { useUserContext } from '../../../contexts/UserContext';
import { addAppToFirestore } from '../../../lib/firestore';
import { ITool } from '../../../types/app';
import { AppCategoryType } from '../../../types/category';
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
    const { user } = useUserContext();
    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setModalRoot(document.body);
    }, []);

    const handleFormSubmit = async (newApp: ITool) => {
        if (user) {
            await addAppToFirestore(user.uid, newApp);
        }
        onSubmit(newApp);
        onClose();
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
