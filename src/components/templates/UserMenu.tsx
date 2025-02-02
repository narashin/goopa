import React, { Fragment, useState } from 'react';

import Image from 'next/image';

import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Transition,
} from '@headlessui/react';

import { useShareHandler } from '../../hooks/useShareHandler';
import { UserData } from '../../lib/auth';
import { errorToast, successToast } from '../ui/Toast';
import { PublishModal } from './modal/PublishModal';

interface UserMenuProps {
    user: UserData;
    handleSignOut: () => void;
    toggleEditMode: () => void;
    isEditMode: boolean;
}

export function UserMenu({
    user,
    handleSignOut,
    toggleEditMode,
    isEditMode,
}: UserMenuProps) {
    const [showModal, setShowModal] = useState(false);
    const [isPublishAction, setIisPublishAction] = useState(false);
    const { isPublished, publishUrl, handlePublish, handleUnPublish } =
        useShareHandler(user);

    const handlePublishClick = () => {
        setIisPublishAction(!isPublished);
        setShowModal(true);
    };

    const handleUnpublishClick = () => {
        setIisPublishAction(false);
        setShowModal(true);
    };

    const handleConfirmPublish = async () => {
        const newPublishUrl = await handlePublish();
        if (newPublishUrl) {
            return newPublishUrl;
        } else {
            errorToast('Failed to publish your Goopa.');
        }
        return null;
    };

    const handleConfirmUnpublish = async () => {
        const success = await handleUnPublish();
        if (success) {
            successToast('Your Goopa has been unpublished.');
        } else {
            errorToast('Failed to unpublish your Goopa.');
        }
        return success;
    };

    const handleCopyUrl = () => {
        if (publishUrl) {
            const fullUrl = `${window.location.origin}${publishUrl}`;
            navigator.clipboard.writeText(fullUrl);
            console.log('URL copied from handleCopyUrl:', fullUrl);
            successToast('🎉 Public URL copied to clipboard!');
        }
    };

    return (
        <>
            <Menu as="div" className="relative inline-block text-left">
                <div className="flex items-center">
                    <MenuButton className="inline-flex w-full justify-center items-center">
                        {user.photoURL ? (
                            <Image
                                src={user.photoURL}
                                alt="Profile"
                                width={32}
                                height={32}
                                className="rounded-full border border-white/20 shadow-sm"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 border border-white/20 shadow-sm">
                                {user.displayName
                                    ? user.displayName[0].toUpperCase()
                                    : 'U'}
                            </div>
                        )}
                    </MenuButton>
                </div>

                {/* 메뉴 리스트 */}
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-50"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            {/* Publish 관련 섹션 */}
                            {isPublished && !isEditMode && (
                                <>
                                    <div className="px-4 py-2">
                                        <div className="flex items-center text-xs text-gray-500">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                            {'Your Goopa in public read mode'}
                                        </div>
                                    </div>
                                    <MenuItem>
                                        {({ active }) => (
                                            <button
                                                onClick={handleCopyUrl}
                                                className={`${
                                                    active
                                                        ? 'bg-gray-100 text-gray-900'
                                                        : 'text-gray-700'
                                                } block w-full px-4 py-2 text-left text-xs`}
                                            >
                                                Public URL Copy 📋
                                            </button>
                                        )}
                                    </MenuItem>
                                </>
                            )}

                            <MenuItem disabled={isEditMode}>
                                {({ active, disabled }) => (
                                    <button
                                        onClick={
                                            isPublished
                                                ? handleUnpublishClick
                                                : handlePublishClick
                                        }
                                        disabled={isEditMode}
                                        className={`${
                                            disabled
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : active
                                                  ? 'bg-gray-100 text-gray-900'
                                                  : 'text-gray-700'
                                        } block w-full px-4 py-2 text-left text-xs`}
                                    >
                                        {isPublished ? 'Unpublish' : 'Publish'}
                                    </button>
                                )}
                            </MenuItem>

                            {/* Divider */}
                            <div className="my-1 h-px bg-gray-200"></div>

                            {/* Edit Mode 섹션 */}
                            {isEditMode && (
                                <div className="flex items-center px-4 py-2 text-xs text-gray-500">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    {"You're in Edit Mode"}
                                </div>
                            )}

                            <MenuItem>
                                {({ active }) => (
                                    <button
                                        onClick={toggleEditMode}
                                        className={`${
                                            active
                                                ? 'bg-gray-100 text-gray-900'
                                                : 'text-gray-700'
                                        } block w-full px-4 py-2 text-left text-xs`}
                                    >
                                        {isEditMode
                                            ? 'Edit Mode OFF'
                                            : 'Edit Mode ON'}
                                    </button>
                                )}
                            </MenuItem>

                            {/* Divider */}
                            <div className="my-1 h-px bg-gray-200"></div>

                            {/* Sign out 섹션 */}
                            <MenuItem>
                                {({ active }) => (
                                    <button
                                        onClick={handleSignOut}
                                        className={`${
                                            active
                                                ? 'bg-gray-100 text-gray-900'
                                                : 'text-gray-700'
                                        } block w-full px-4 py-2 text-left text-xs`}
                                    >
                                        Sign out
                                    </button>
                                )}
                            </MenuItem>
                        </div>
                    </MenuItems>
                </Transition>
            </Menu>

            <PublishModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onPublish={handleConfirmPublish}
                onUnpublish={handleConfirmUnpublish}
                isPublishAction={isPublishAction}
                publishUrl={publishUrl}
            />
        </>
    );
}
