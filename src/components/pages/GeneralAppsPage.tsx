'use client';

import React, { useCallback, useMemo, useState } from 'react';

import { AppboardHeader } from '../../components/templates/AppBoardHeader';
import { AppIconCard } from '../../components/templates/AppIconCard';
import { AddNewAppModal } from '../../components/templates/modal/AddNewAppModal';
import { ConfirmModal } from '../../components/templates/modal/ConfirmModal';
import { Card } from '../../components/ui/Card';
import { useAppContext } from '../../contexts/AppContext';
import { useAuth } from '../../hooks/useAuth';
import type { ITool } from '../../types/app';
import { AppCategoryType } from '../../types/category';

interface GeneralAppsPageProps {
    apps: ITool[];
    onAddNewApp?: (newApp: ITool) => void;
    onDeleteApp?: (id: string) => void;
    isReadOnly?: boolean;
}

export function GeneralAppsPage({
    apps,
    onAddNewApp,
    onDeleteApp,
    isReadOnly,
}: GeneralAppsPageProps) {
    const { user } = useAuth();
    const { isEditMode, setIsEditMode } = useAppContext();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const filteredApps = useMemo(
        () => apps.filter((app) => app.category === AppCategoryType.General),
        [apps]
    );

    const handleAddNewApp = useCallback(() => {
        if (isReadOnly || !onAddNewApp) return;

        if (isEditMode) {
            setIsAddModalOpen(true);
        } else {
            setIsConfirmModalOpen(true);
        }
    }, [isEditMode]);

    const handleDeleteApp = useCallback(
        (appId: string) => {
            if (isReadOnly || !onDeleteApp) return;
            onDeleteApp(appId);
        },
        [onDeleteApp]
    );

    const handleConfirmEditMode = useCallback(() => {
        setIsEditMode(true);
        setIsConfirmModalOpen(false);
    }, [setIsEditMode]);

    const handleSubmitNewApp = useCallback(
        (newApp: ITool) => {
            if (isReadOnly || !onAddNewApp) return;
            onAddNewApp(newApp);
            setIsAddModalOpen(false);
        },
        [onAddNewApp]
    );

    return (
        <div className="flex-1 p-4 overflow-auto">
            <Card className="h-full bg-black/20 border-white/10 backdrop-blur-sm">
                <div className="p-6">
                    <AppboardHeader
                        title="General Apps"
                        description="🎉 일단 이거부터"
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {filteredApps.map((app) => (
                            <AppIconCard
                                key={app.id}
                                app={app}
                                isStarred={false}
                                onClick={() => {}}
                                onDeleteApp={() => handleDeleteApp(app.id)}
                            />
                        ))}
                        {user && !isReadOnly && (
                            <AppIconCard
                                isAddNewAppCard
                                isStarred={false}
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
                currentCategory={AppCategoryType.General}
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

export default React.memo(GeneralAppsPage);
