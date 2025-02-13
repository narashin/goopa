import type React from 'react';
import { useCallback, useState } from 'react';

import { MinusIcon, PlusIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

import { useAuth } from '../../hooks/useAuth';
import { useItems } from '../../hooks/useItem';
import { useStarApp } from '../../hooks/useStarApp';
import { useShareStore } from '../../stores/shareStore';
import { useTooltipStore } from '../../stores/tooltipStore';
import { ITool } from '../../types/item';
import { IconDisplay } from '../ui/IconDisplay';
import { Tooltip } from '../ui/Tooltip';
import { AddNewAppModal } from './modal/AddNewAppModal';
import { ConfirmModal } from './modal/ConfirmModal';
import { DeleteConfirmModal } from './modal/DeleteConfirmModal';
import { SettingsModal } from './modal/SettingsModal';

interface AppCardProps {
    app?: ITool;
    onClick: (e: React.MouseEvent) => void;
    isAddNewAppCard?: boolean;
    onAddNewApp?: (newApp: Omit<ITool, 'id'>) => Promise<void>;
    onDeleteApp: (id: string) => void;
    isStarred?: boolean;
    starCount?: number;
}

export const AppIconCard: React.FC<AppCardProps> = ({
    app,
    onClick,
    isAddNewAppCard = false,
    onDeleteApp,
    onAddNewApp,
}) => {
    const { user, isEditMode } = useAuth();
    const { closeAllTooltips, setModalOpen } = useTooltipStore();
    const { updateItem: updateApp } = useItems();
    const { isShared } = useShareStore();
    const [selectedApp, setSelectedApp] = useState<ITool | null>(app || null);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [showAddNewAppModal, setShowAddNewAppModal] = useState(false);
    const starAppHook = useStarApp(app || null);
    const {
        isStarred = false,
        starCount = 0,
        toggleStar = () => {},
        showLoginPrompt = false,
        setShowLoginPrompt = () => {},
        handleLogin = () => {},
    } = isAddNewAppCard || !app ? {} : starAppHook || {};

    const handleCardClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            if (showDeleteConfirmModal || showSettingsModal) {
                return;
            }
            if (isAddNewAppCard) {
                setShowAddNewAppModal(true);
            } else if (!app?.url) {
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

    const handleAddNewApp = async (newApp: Omit<ITool, 'id'>) => {
        await onAddNewApp?.(newApp);
        setShowAddNewAppModal(false);
    };

    const handleCloseAddNewAppModal = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setShowAddNewAppModal(false);
    }, []);

    const handleNameClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            if (app?.url) {
                window.open(app.url, '_blank', 'noopener,noreferrer');
            }
        },
        [app]
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

    const handleIconClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isAddNewAppCard) {
            setShowAddNewAppModal(true);
        } else {
            handleSettingsClick(e);
        }
    };

    const handleStarClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleStar();
    };

    const canViewSettings = isShared || (!isShared && !isEditMode);

    return (
        <div
            key={app?.id || 'add-new'}
            className="flex flex-col items-center space-y-2 cursor-pointer group"
            onClick={handleCardClick}
        >
            <Tooltip content={app?.tooltip || ''}>
                <div className="relative">
                    <div className="relative w-20 h-20 bg-black/40 rounded-2xl border border-white/10 overflow-hidden">
                        <div
                            className="relative inset-0 w-full h-full flex items-center justify-center"
                            onClick={handleIconClick}
                        >
                            {isAddNewAppCard ? (
                                <PlusIcon className="w-10 h-10 text-white/80" />
                            ) : (
                                selectedApp && (
                                    <IconDisplay
                                        icon={selectedApp.icon ?? ''}
                                        name={selectedApp.name}
                                    />
                                )
                            )}
                        </div>
                    </div>
                    {!isAddNewAppCard && isEditMode && selectedApp && (
                        <button
                            onClick={showDeleteConfirmationModal}
                            className="absolute -top-1 left-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center z-10"
                        >
                            <MinusIcon className="w-3 h-3 text-white" />
                        </button>
                    )}
                    {!isAddNewAppCard && canViewSettings && selectedApp && (
                        <>
                            <button
                                onClick={handleStarClick}
                                className={`absolute -top-1 right-0 h-5 bg-black flex items-center justify-center border border-white/30 z-10 transition-all duration-200 ease-in-out ${
                                    isStarred
                                        ? 'rounded-full px-2'
                                        : 'rounded-full w-5'
                                }`}
                            >
                                {isStarred ? (
                                    <>
                                        <span className="mr-1 text-xs text-white">
                                            {starCount}
                                        </span>
                                        <StarIconSolid className="w-3 h-3 text-yellow-400" />
                                    </>
                                ) : (
                                    <StarIcon className="w-3 h-3 text-white/70" />
                                )}
                            </button>
                            <ConfirmModal
                                isOpen={showLoginPrompt}
                                onClose={() => setShowLoginPrompt(false)}
                                onConfirm={handleLogin}
                                title="⭐ Star this app"
                                message="You need to sign in to star this app. Would you like to sign in now?"
                                type="info"
                            />
                        </>
                    )}
                </div>
            </Tooltip>

            <span
                className={`text-sm font-medium text-white/80 group-hover:text-white transition-colors text-center w-full px-2 ${
                    !isAddNewAppCard && selectedApp?.url
                        ? 'hover:underline cursor-pointer'
                        : ''
                }`}
                onClick={!isAddNewAppCard ? handleNameClick : undefined}
            >
                {isAddNewAppCard ? 'Add new app' : selectedApp?.name}
            </span>
            {showSettingsModal && selectedApp && user && (
                <SettingsModal
                    initialApp={selectedApp}
                    readOnly={canViewSettings && !isEditMode}
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
            {showAddNewAppModal && (
                <AddNewAppModal
                    isOpen={showAddNewAppModal}
                    onClose={handleCloseAddNewAppModal}
                    onSubmit={handleAddNewApp}
                />
            )}
        </div>
    );
};
