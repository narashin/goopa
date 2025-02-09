import type React from 'react'; // Added import for React
import { Fragment, useCallback, useEffect, useState } from 'react';

import Image from 'next/image';

import { Menu, Transition } from '@headlessui/react';

import { useShare } from '../../hooks/useShare';
import type { AuthenticatedUserData } from '../../types/user';

interface UserMenuProps {
    user: AuthenticatedUserData;
    handleSignOut: () => void;
    toggleEditMode: () => void;
    isEditMode: boolean;
}

export const UserMenu: React.FC<UserMenuProps> = ({
    user,
    handleSignOut,
    toggleEditMode,
    isEditMode,
}) => {
    const { shareData, handleShare, handleUnshare } = useShare(user.uid);
    const [localIsShared, setLocalIsShared] = useState(
        shareData?.isShared ?? false
    );

    useEffect(() => {
        setLocalIsShared(shareData?.isShared ?? false);
    }, [shareData?.isShared]);

    const handleShareClick = useCallback(async () => {
        if (user.uid) {
            try {
                await handleShare(user.uid);
                setLocalIsShared(true);
                // TODO: Add a success toast or notification
            } catch (error) {
                console.error('Error sharing:', error);
                // TODO: Add an error toast or notification
            }
        }
    }, [handleShare, user.uid]);

    const handleUnshareClick = useCallback(async () => {
        if (user.uid) {
            try {
                await handleUnshare(user.uid);
                setLocalIsShared(false);
                // TODO: Add a success toast or notification
            } catch (error) {
                console.error('Error unsharing:', error);
                // TODO: Add an error toast or notification
            }
        }
    }, [handleUnshare, user.uid]);

    const handleCopyUrl = useCallback(() => {
        if (shareData?.shareUrl) {
            const fullUrl = `${window.location.origin}${shareData.shareUrl}`;
            navigator.clipboard.writeText(fullUrl);
            // TODO: Add a toast or notification here
            console.log('🎉 Public URL copied to clipboard!');
        }
    }, [shareData?.shareUrl]);

    return (
        <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="relative inline-flex items-center justify-center w-8 h-8 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {user.photoURL ? (
                    <div className="w-full h-full">
                        <Image
                            src={user.photoURL || '/placeholder.svg'}
                            alt="Profile"
                            width={32}
                            height={32}
                            className="rounded-full border border-white/20 shadow-sm"
                        />
                    </div>
                ) : (
                    <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                        {user.displayName
                            ? user.displayName[0].toUpperCase()
                            : 'U'}
                    </div>
                )}
            </Menu.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-2 text-sm">
                        {localIsShared && (
                            <>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={handleCopyUrl}
                                            className={`${active ? 'bg-gray-100' : ''} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                        >
                                            Copy Public URL 📋
                                        </button>
                                    )}
                                </Menu.Item>
                                <div className="px-4 py-2">
                                    <div className="flex items-center text-xs text-gray-500">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        Your Goopa is public
                                    </div>
                                </div>
                            </>
                        )}

                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={
                                        localIsShared
                                            ? handleUnshareClick
                                            : handleShareClick
                                    }
                                    className={`${active ? 'bg-gray-100' : ''} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                >
                                    {localIsShared ? 'Unpublish' : 'Publish'}
                                </button>
                            )}
                        </Menu.Item>
                        {isEditMode ? (
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={toggleEditMode}
                                        className={`${active ? 'bg-gray-100' : ''} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                        Exit Edit Mode
                                    </button>
                                )}
                            </Menu.Item>
                        ) : (
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={toggleEditMode}
                                        className={`${active ? 'bg-gray-100' : ''} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                        Enter Edit Mode
                                    </button>
                                )}
                            </Menu.Item>
                        )}
                    </div>
                    <div className="py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={handleSignOut}
                                    className={`${active ? 'bg-gray-100' : ''} group flex w-full items-center rounded-md px-2 py-2 text-sm text-red-500`}
                                >
                                    Sign out
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};
