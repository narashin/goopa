import type React from 'react';
import { useCallback, useState } from 'react';

import {
    Cog6ToothIcon, InformationCircleIcon, MinusIcon, PlusIcon,
} from '@heroicons/react/24/outline';

import { useAppContext } from '../../contexts/AppContext';
import { useTooltip } from '../../contexts/TooltipContext';
import { useUserContext } from '../../contexts/UserContext';
import type { ITool } from '../../types/app';
import { IconDisplay } from '../ui/IconDisplay';
import { Tooltip } from '../ui/Tooltip';
import { DeleteConfirmModal } from './modal/DeleteConfirmModal';
import { SettingsModal } from './modal/SettingsModal';

interface AppCardProps {
    app?: ITool;
    onClick: (e: React.MouseEvent) => void;
    isAddNewAppCard?: boolean;
    onDeleteApp: (id: string) => void;
}

export const AppIconCard: React.FC<AppCardProps> = ({
    app,
    onClick,
    isAddNewAppCard = false,
    onDeleteApp,
}) => {
    const { user } = useUserContext();
    const { closeAllTooltips, setModalOpen } = useTooltip();
    const { isEditMode, updateApp, isPublishMode } = useAppContext();
    const [selectedApp, setSelectedApp] = useState<ITool | null>(app || null);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            if (showDeleteConfirmModal || showSettingsModal) {
                return;
            }
            if (isAddNewAppCard) {
                onClick(e);
            } else if (app?.downloadUrl) {
                window.open(app.downloadUrl, '_blank', 'noopener,noreferrer');
            } else {
                onClick(e);
            }
        },
        [
            showDeleteConfirmModal,
            showSettingsModal,
            isAddNewAppCard,
            app,
            onClick,
        ]
    );

    const handleSettingsClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        closeAllTooltips();
        setShowSettingsModal(true);
        setModalOpen(true);
    };

    const handleCloseSettingsModal = () => {
        setShowSettingsModal(false);
        setModalOpen(false);
    };

    const showDeleteConfirmationModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDeleteConfirmModal(true);
    };

    const deleteAppAndCloseModal = async () => {
        if (selectedApp) {
            await onDeleteApp(selectedApp.id);
            setSelectedApp(null);
        }
        setShowDeleteConfirmModal(false);
    };

    const handleUpdateApp = (updatedApp: ITool) => {
        setSelectedApp(updatedApp);
        updateApp(updatedApp);
    };

    const canViewSettings = isPublishMode || (!isPublishMode && !isEditMode);

    return (
        <div
            key={app?.id || 'add-new'}
            className="flex flex-col items-center space-y-2 cursor-pointer group"
            onClick={handleClick}
        >
            <Tooltip content={app?.tooltip || ''}>
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
                                        onClick={handleClick}
                                    />
                                )
                            )}
                        </div>
                    </div>
                    {!isAddNewAppCard && isEditMode && selectedApp && (
                        <>
                            <button
                                onClick={showDeleteConfirmationModal} // Modified function name
                                className="absolute -top-1 left-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center z-10"
                            >
                                <MinusIcon className="w-3 h-3 text-white" />
                            </button>
                            <button
                                onClick={handleSettingsClick}
                                className="absolute -top-1 right-0 w-5 h-5 bg-slate-500 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors z-10"
                            >
                                <Cog6ToothIcon className="w-3 h-3" />
                            </button>
                        </>
                    )}
                    {!isAddNewAppCard && canViewSettings && selectedApp && (
                        <button
                            onClick={handleSettingsClick}
                            className="absolute -top-1 right-0 w-5 h-5 bg-[#3B82F6] rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors z-10"
                        >
                            <InformationCircleIcon className="w-3 h-3" />
                        </button>
                    )}
                </div>
            </Tooltip>

            <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors text-center w-full px-2">
                {isAddNewAppCard ? 'Add new app' : selectedApp?.name}
            </span>

            {showSettingsModal && selectedApp && (
                <SettingsModal
                    app={selectedApp}
                    readOnly={canViewSettings && !isEditMode}
                    user={user}
                    onClose={handleCloseSettingsModal}
                    onSave={(selectedApp) => {
                        handleUpdateApp(selectedApp);
                        handleCloseSettingsModal();
                    }}
                    onUpdate={handleUpdateApp}
                />
            )}
            {showDeleteConfirmModal && selectedApp && (
                <DeleteConfirmModal
                    app={selectedApp}
                    onConfirm={deleteAppAndCloseModal}
                    onCancel={() => setShowDeleteConfirmModal(false)}
                />
            )}
        </div>
    );
};
