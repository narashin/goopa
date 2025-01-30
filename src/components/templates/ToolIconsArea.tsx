import React, { useState } from 'react';

import { useAppContext } from '../../contexts/AppContext';
import { useUserContext } from '../../contexts/UserContext';
import { ITool } from '../../types/app';
import { AppCategoryType } from '../../types/category';
import { AppIconCard } from './AppIconCard';
import { AddNewAppModal } from './modal/AddNewAppModal';
import { ConfirmModal } from './modal/ConfirmModal';

interface ToolIconsProps {
    apps: ITool[];
    onAddNewApp: (newApp: ITool) => void;
    isItemSelected: (id: string) => boolean;
    toggleItem: (item: ITool) => void;
    currentCategory: AppCategoryType;
}

const ToolIconsArea: React.FC<ToolIconsProps> = ({
    apps: tools,
    onAddNewApp,
    isItemSelected,
    toggleItem,
    currentCategory,
}) => {
    const { user } = useUserContext();
    const { isEditMode, setIsEditMode } = useAppContext();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleAddNewApp = () => {
        if (isEditMode) {
            setIsAddModalOpen(true);
        } else {
            setIsConfirmModalOpen(true);
        }
    };

    const handleConfirmEditMode = () => {
        setIsEditMode(true);
        setIsConfirmModalOpen(false);
    };

    const handleSubmitNewApp = (newApp: ITool) => {
        onAddNewApp(newApp);
    };

    return (
        <>
            <div className="overflow-hidden flex flex-col">
                <h2 className="text-xl font-bold text-white/90 mb-4 sticky top-0 bg-[#1a1b26] py-2">
                    🛠️ Tools
                </h2>
                <div className="overflow-y-auto flex-grow">
                    <div className="grid grid-cols-2 gap-4 w-full pt-2">
                        {tools.map((tool) => (
                            <div
                                key={tool.id}
                                className={`relative transition-all cursor-pointer ${
                                    isItemSelected(tool.id)
                                        ? 'border-white/60 bg-white/10'
                                        : 'border-white/20 hover:border-white/40'
                                }`}
                            >
                                <AppIconCard
                                    key={tool.id}
                                    app={{
                                        id: tool.id,
                                        icon: tool.icon,
                                        name: tool.name,
                                        description: tool.description || '',
                                        hasSettings: tool.hasSettings,
                                        downloadUrl: tool.downloadUrl,
                                        category: tool.category,
                                    }}
                                    onClick={() => toggleItem(tool)}
                                />
                            </div>
                        ))}
                        {user && (
                            <AppIconCard
                                isAddNewAppCard
                                onClick={handleAddNewApp}
                            />
                        )}
                    </div>
                </div>
            </div>
            <AddNewAppModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleSubmitNewApp}
                currentCategory={currentCategory}
            />

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmEditMode}
                title="🔄 Switch to Edit Mode"
                message={`You can only add new apps in Edit mode.\nWould you like to switch to Edit mode?`}
            />
        </>
    );
};

export default ToolIconsArea;
