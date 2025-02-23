'use client';

import type React from 'react';

import { useAuth } from '../../hooks/useAuth';
import { AppCategoryType } from '../../types/category';
import type { ITool } from '../../types/item';
import { AppIconCard } from './AppIconCard';

interface ToolIconsProps {
    apps: ITool[];
    onAddNewApp: (newApp: Omit<ITool, 'id'>) => Promise<void>;
    onDeleteApp: (id: string) => Promise<void>;
    isItemSelected: (id: string) => boolean;
    toggleItem: (item: ITool) => void;
    currentCategory: AppCategoryType;
}

const ToolIconsArea: React.FC<ToolIconsProps> = ({
    apps: tools,
    onAddNewApp,
    onDeleteApp,
    isItemSelected,
    toggleItem,
    currentCategory,
}) => {
    const { user, isEditMode } = useAuth();

    const handleDeleteApp = (appId: string) => {
        if (!isEditMode || !onDeleteApp) return;
        onDeleteApp(appId);
    };

    const toggleSelectedItem = (item: ITool) => {
        toggleItem(item);
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
                                    app={tool}
                                    onClick={() => toggleSelectedItem(tool)}
                                    onDeleteApp={() => handleDeleteApp(tool.id)}
                                    showCheckbox={
                                        currentCategory ===
                                            AppCategoryType.ZshPlugin ||
                                        currentCategory ===
                                            AppCategoryType.Requirement ||
                                        currentCategory ===
                                            AppCategoryType.Additional
                                    }
                                    isChecked={isItemSelected(tool.id)}
                                    onCheckboxClick={() => toggleItem(tool)}
                                />
                            </div>
                        ))}
                        {user && isEditMode && (
                            <AppIconCard
                                isAddNewAppCard
                                onClick={() => {}}
                                onAddNewApp={onAddNewApp}
                                onDeleteApp={() => {}}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ToolIconsArea;
