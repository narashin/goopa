import React, { useState } from 'react';

import { AppboardHeader } from '../../components/templates/AppBoardHeader';
import { AppIconCard } from '../../components/templates/AppIconCard';
import { ConfirmModal } from '../../components/templates/ConfirmModal';
import { Card } from '../../components/ui/Card';
import { useAppContext } from '../../contexts/AppContext';
import { generalApps } from '../../data/general-apps';

export function GeneralApps() {
    const { isEditMode, setIsEditMode } = useAppContext();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleAppClick = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

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
        <div className="flex-1 p-4 overflow-auto">
            <Card className="h-full bg-black/20 border-white/10 backdrop-blur-sm">
                <div className="p-6">
                    <AppboardHeader
                        title="General Apps"
                        description="🎉 일단 이거부터"
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {generalApps.map((app) => (
                            <AppIconCard
                                key={app.id}
                                app={app}
                                onClick={() =>
                                    handleAppClick(app.downloadUrl ?? '')
                                }
                            />
                        ))}
                        <AppIconCard
                            isAddNewAppCard
                            onClick={handleAddNewApp}
                        />
                    </div>
                </div>
            </Card>

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
        </div>
    );
}
