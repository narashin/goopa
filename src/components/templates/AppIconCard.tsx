import type React from 'react';
import { useCallback, useEffect, useState } from 'react';

import { MinusIcon, PlusIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

import { useAuth } from '../../hooks/useAuth';
import { useItems } from '../../hooks/useItems';
import { useStarApp } from '../../hooks/useStarApp';
import { removeUndefinedFields } from '../../lib/utils';
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
    readOnly?: boolean;
    showCheckbox?: boolean;
    isChecked?: boolean;
    onCheckboxClick?: (e: React.MouseEvent) => void;
}

export const AppIconCard: React.FC<AppCardProps> = ({
    app,
    onClick,
    isAddNewAppCard = false,
    onDeleteApp,
    onAddNewApp,
    readOnly = false,
    showCheckbox = false,
    isChecked = false,
    onCheckboxClick,
}) => {
    const { user, isEditMode } = useAuth();
    const { closeAllTooltips, setModalOpen } = useTooltipStore();
    const { updateItem: updateApp } = useItems();
    const { isShared } = useShareStore();
    const [selectedApp, setSelectedApp] = useState<ITool | null>(app || null);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [showAddNewAppModal, setShowAddNewAppModal] = useState(false);
    const starAppHook = useStarApp(app as ITool);
    const {
        isStarred,
        starCount,
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

    useEffect(() => {
        setSelectedApp(app || null);
    }, [app]);

    const handleCloseAddNewAppModal = useCallback((e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
        }
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
            setShowDeleteConfirmModal(false);
            setSelectedApp(null);
            await onDeleteApp(selectedApp.id);
        }
    };

    const handleUpdateApp = (updatedApp: ITool) => {
        setSelectedApp(updatedApp);
        const { id, ...updateFields } = updatedApp;
        const cleanFields = removeUndefinedFields(updateFields);
        updateApp(id, cleanFields);
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

    const handleCheckboxClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            if (onCheckboxClick && app) {
                onCheckboxClick(e);
            }
        },
        [onCheckboxClick, app]
    );

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
                        {showCheckbox && !isAddNewAppCard && (
                            <div
                                className="absolute bottom-1 right-2 z-10"
                                onClick={handleCheckboxClick}
                            >
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {}}
                                    className="peer h-4 w-4 appearance-none rounded-md border-2 border-white/30 
                           bg-black/50 checked:border-primary checked:bg-primary 
                           hover:border-white/50 focus:outline-none focus:ring-2 
                           focus:ring-primary/20 transition-all duration-200
                           relative
                           after:content-[''] after:absolute after:left-[4px] after:top-[2px]
                           after:w-[4px] after:h-[8px] after:border-white
                           after:border-r-2 after:border-b-2 after:rotate-45
                           after:opacity-0 checked:after:opacity-100
                           after:transition-opacity after:duration-200"
                                />
                            </div>
                        )}
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
                    {!isAddNewAppCard &&
                        isEditMode &&
                        !readOnly &&
                        selectedApp && (
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
                                className={`absolute -top-1 right-0 h-5 bg-black flex items-center justify-center border border-white/30 z-10 transition-all duration-200 ease-in-out rounded-full ${
                                    starCount && starCount > 0 ? 'px-2' : 'w-5'
                                }`}
                            >
                                {user && isStarred ? (
                                    <StarIconSolid className="w-3 h-3 text-yellow-400" />
                                ) : (
                                    <StarIcon className="w-3 h-3 text-white/70" />
                                )}
                                <span
                                    className={`text-xs text-white ${starCount && starCount > 0 ? 'ml-1' : ''}`}
                                >
                                    {starCount && starCount > 0
                                        ? starCount
                                        : ''}
                                </span>
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
            {showSettingsModal && selectedApp && (
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
                    onSubmit={(newApp) => {
                        onAddNewApp?.(newApp);
                    }}
                />
            )}
        </div>
    );
};
