import React, { useState } from 'react';

import { useAppContext } from '../../contexts/AppContext';
import { ITool } from '../../types/app';
import { AppCategoryType } from '../../types/category';
import { AppIconCard } from './AppIconCard';
import { AddNewAppModal } from './modal/AddNewAppModal';
import { ConfirmModal } from './modal/ConfirmModal';

interface ToolIconsProps {
    tools: ITool[];
    isItemSelected: (id: string) => boolean;
    toggleItem: (item: ITool) => void;
    currentCategory: AppCategoryType;
}

const ToolIconsArea: React.FC<ToolIconsProps> = ({
    tools,
    isItemSelected,
    toggleItem,
    currentCategory,
}) => {
    const { isEditMode, setIsEditMode } = useAppContext();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [apps, setApps] = useState(tools);

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
        setApps((prevApps) => [...prevApps, newApp]);
    };

    return (
        <>
            <div className="overflow-hidden flex flex-col">
                <h2 className="text-xl font-bold text-white/90 mb-4 sticky top-0 bg-[#1a1b26] py-2">
                    🛠️ Tools
                </h2>
                <div className="overflow-y-auto flex-grow">
                    <div className="grid grid-cols-2 gap-4 w-full pt-2">
                        {apps.map((app) => (
                            <div
                                key={app.id}
                                className={`relative transition-all cursor-pointer ${
                                    isItemSelected(app.id)
                                        ? 'border-white/60 bg-white/10'
                                        : 'border-white/20 hover:border-white/40'
                                }`}
                            >
                                <AppIconCard
                                    key={app.id}
                                    app={{
                                        id: app.id,
                                        icon: app.icon,
                                        name: app.name,
                                        description: app.description || '',
                                        hasSettings: app.hasSettings,
                                        downloadUrl: app.downloadUrl,
                                        category: app.category,
                                    }}
                                    onClick={() => toggleItem(app)}
                                />
                            </div>
                        ))}
                        <AppIconCard
                            isAddNewAppCard
                            onClick={handleAddNewApp}
                        />
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
