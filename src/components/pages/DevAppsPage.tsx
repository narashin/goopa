'use client';

import React, { useCallback, useMemo, useState } from 'react';

import { AppboardHeader } from '../../components/templates/AppBoardHeader';
import { AppIconCard } from '../../components/templates/AppIconCard';
import {
    AddNewAppModal,
} from '../../components/templates/modal/AddNewAppModal';
import { ConfirmModal } from '../../components/templates/modal/ConfirmModal';
import { Card } from '../../components/ui/Card';
import { useAppContext } from '../../contexts/AppContext';
import { useUserContext } from '../../contexts/UserContext';
import type { ITool } from '../../types/app';
import { AppCategoryType } from '../../types/category';

interface DevAppsPageProps {
    apps: ITool[];
    onAddNewApp: (newApp: ITool) => void;
    onDeleteApp: (id: string) => void;
}

export function DevAppsPage({
    apps,
    onAddNewApp,
    onDeleteApp,
}: DevAppsPageProps) {
    const { user } = useUserContext();
    const { isEditMode, setIsEditMode } = useAppContext();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const filteredApps = useMemo(
        () => apps.filter((app) => app.category === AppCategoryType.Dev),
        [apps]
    );

    const handleAppClick = useCallback((url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    }, []);

    const handleAddNewApp = useCallback(() => {
        if (isEditMode) {
            setIsAddModalOpen(true);
        } else {
            setIsConfirmModalOpen(true);
        }
    }, [isEditMode]);

    const handleDeleteApp = useCallback(
        (appId: string) => {
            onDeleteApp(appId);
        },
        [onDeleteApp]
    );

    const handleSubmitNewApp = useCallback(
        (newApp: ITool) => {
            onAddNewApp(newApp);
            setIsAddModalOpen(false);
        },
        [onAddNewApp]
    );

    const handleConfirmEditMode = useCallback(() => {
        setIsEditMode(true);
        setIsConfirmModalOpen(false);
    }, [setIsEditMode]);

    return (
        <div className="flex-1 p-4 overflow-auto">
            <Card className="h-full bg-black/20 border-white/10 backdrop-blur-sm">
                <div className="p-6">
                    <AppboardHeader
                        title="Development Apps"
                        description="👩‍💻 개발 환경을 위한 필수 앱들"
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {filteredApps.map((app) => (
                            <AppIconCard
                                key={app.id}
                                app={app}
                                onClick={() =>
                                    handleAppClick(app.downloadUrl ?? '')
                                }
                                onDeleteApp={() => handleDeleteApp(app.id)}
                            />
                        ))}
                        {user && (
                            <AppIconCard
                                isAddNewAppCard
                                onClick={handleAddNewApp}
                                onDeleteApp={() => {}}
                            />
                        )}
                    </div>
                </div>
            </Card>

            <AddNewAppModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleSubmitNewApp}
                currentCategory={AppCategoryType.Dev}
            />
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

export default React.memo(DevAppsPage);
