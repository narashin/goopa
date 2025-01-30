import type React from 'react';
import { useState } from 'react';

import {
    BookOpenIcon, Cog6ToothIcon, MinusIcon, PlusIcon,
} from '@heroicons/react/24/outline';

import { useAppContext } from '../../contexts/AppContext';
import { useUserContext } from '../../contexts/UserContext';
import type { ITool } from '../../types/app';
import { IconDisplay } from '../ui/IconDisplay';
import { DeleteConfirmModal } from './modal/DeleteConfirmModal';
import { SettingsModal } from './modal/SettingsModal';

interface AppCardProps {
    app?: ITool;
    onClick: (e: React.MouseEvent) => void;
    isAddNewAppCard?: boolean;
}

export const AppIconCard: React.FC<AppCardProps> = ({
    app,
    onClick,
    isAddNewAppCard = false,
}) => {
    const { user } = useUserContext();
    const { isEditMode, deleteApp, updateApp } = useAppContext();
    const [selectedApp, setSelectedApp] = useState<ITool | null>(app || null);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        if (isAddNewAppCard) {
            onClick(e);
        } else if (app?.downloadUrl) {
            window.open(app.downloadUrl, '_blank', 'noopener,noreferrer');
        } else {
            onClick(e);
        }
    };

    const handleSettingsClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowSettingsModal(true);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDeleteConfirmModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (selectedApp) {
            await deleteApp(selectedApp.id);
            setShowDeleteConfirmModal(false);
        }
    };

    const handleUpdateApp = (updatedApp: ITool) => {
        setSelectedApp(updatedApp);
        updateApp(updatedApp);
    };

    return (
        <div
            key={app?.id || 'add-new'}
            className="flex flex-col items-center space-y-2 cursor-pointer group"
            onClick={handleClick}
        >
            <div className="relative">
                <div className="relative w-20 h-20 bg-black/40 rounded-2xl border border-white/10 overflow-hidden group-hover:border-white/30 group-hover:scale-105 transition-all duration-200">
                    <div className="relative inset-0 w-full h-full flex items-center justify-center">
                        {isAddNewAppCard ? (
                            <PlusIcon className="w-10 h-10 text-white/80" />
                        ) : (
                            selectedApp && (
                                <IconDisplay
                                    icon={selectedApp.icon}
                                    name={selectedApp.name}
                                    tooltip={selectedApp.description}
                                    onClick={handleClick}
                                />
                            )
                        )}
                    </div>
                </div>
                {!isAddNewAppCard && isEditMode && selectedApp && (
                    <>
                        <button
                            onClick={handleDeleteClick}
                            className="absolute -top-1 left-0 w-5 h-5 bg-gray-500 rounded-full flex items-center justify-center z-10"
                        >
                            <MinusIcon className="w-3 h-3 text-white" />
                        </button>
                        <button
                            onClick={handleSettingsClick}
                            className="absolute -top-1 right-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors z-10"
                        >
                            <Cog6ToothIcon className="w-3 h-3" />
                        </button>
                    </>
                )}
                {!isAddNewAppCard &&
                    !isEditMode &&
                    selectedApp?.hasSettings && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(
                                    `/settings/${selectedApp.id}`,
                                    '_blank',
                                    'noopener,noreferrer'
                                );
                            }}
                            className="absolute -top-1 right-0 w-5 h-5 bg-red-700 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors z-10"
                        >
                            <BookOpenIcon className="w-3 h-3" />
                        </button>
                    )}
            </div>
            <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors text-center w-full px-2">
                {isAddNewAppCard ? 'Add new app' : selectedApp?.name}
            </span>

            {showSettingsModal && selectedApp && (
                <SettingsModal
                    app={selectedApp}
                    user={user}
                    onClose={() => setShowSettingsModal(false)}
                    onSave={(settings) => {
                        handleUpdateApp({
                            ...selectedApp,
                            description: settings,
                        });
                        setShowSettingsModal(false);
                    }}
                    onUpdate={handleUpdateApp}
                />
            )}
            {showDeleteConfirmModal && selectedApp && (
                <DeleteConfirmModal
                    appName={selectedApp.name}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setShowDeleteConfirmModal(false)}
                />
            )}
        </div>
    );
};
