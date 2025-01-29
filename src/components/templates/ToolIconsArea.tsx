import React, { useState } from 'react';

import { useAppContext } from '../../contexts/AppContext';
import { ITool } from '../../types/app';
import { AppIconCard } from './AppIconCard';
import { ConfirmModal } from './ConfirmModal';

interface ToolIconsProps {
    tools: ITool[];
    isItemSelected: (id: string) => boolean;
    toggleItem: (item: ITool) => void;
}

const ToolIconsArea: React.FC<ToolIconsProps> = ({
    tools,
    isItemSelected,
    toggleItem,
}) => {
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
                        <AppIconCard
                            isAddNewAppCard
                            onClick={handleAddNewApp}
                        />
                    </div>
                </div>
            </div>
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-lg font-bold mb-4">새 앱 추가</h2>
                        {/* 여기에 새 앱 추가 폼을 구현하세요 */}
                        <p>새 앱 추가 폼이 여기에 들어갑니다.</p>
                        <button
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => setIsAddModalOpen(false)}
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
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
