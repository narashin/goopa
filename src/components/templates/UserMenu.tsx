import type React from 'react'; // Added import for React
import { Fragment, useCallback, useEffect, useState } from 'react';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { Menu, Transition } from '@headlessui/react';

import { useShare } from '../../hooks/useShare';
import type { AuthenticatedUserData } from '../../types/user';
import { errorToast, successToast } from '../ui/Toast';

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
    const { isShared, shareUrl, handleShare, handleUnshare } = useShare(
        user.uid
    );
    const [localIsShared, setLocalIsShared] = useState(isShared ?? false);
    const pathname = usePathname();
    const router = useRouter();
    const isSharePath = pathname.startsWith('/share');
    const pathParts = pathname.split('/');
    const isOwnShare = pathParts[2] === user.customUserId;
    const canEditShare = !isSharePath || (isSharePath && isOwnShare);

    useEffect(() => {
        setLocalIsShared(isShared ?? false);
    }, [isShared]);

    const handleGoToMyGoopa = useCallback(() => {
        router.push(`/`);
    }, [router]);

    const handleShareClick = useCallback(async () => {
        if (user.uid) {
            try {
                await handleShare(user.uid);
                setLocalIsShared(true);
                successToast('Goopa Shared!');
            } catch (error) {
                errorToast('Error Sharing Goopa');
                console.log('Error sharing:', error);
            }
        }
    }, [handleShare, user.uid]);

    const handleUnshareClick = useCallback(async () => {
        if (user.uid) {
            try {
                await handleUnshare(user.uid);
                setLocalIsShared(false);
                successToast('Goopa unshared!');
            } catch (error) {
                console.error('Error doing unshare:', error);
                errorToast('Error unshare Goopa');
            }
        }
    }, [handleUnshare, user.uid]);

    const handleCopyUrl = useCallback(async () => {
        console.log('handleCopyUrl', shareUrl);
        if (isShared) {
            const fullUrl = `${window.location.origin}${shareUrl}`;
            try {
                await navigator.clipboard.writeText(fullUrl);
                successToast('Public URL copied to clipboard!');
            } catch (error) {
                console.error('Error copying to clipboard:', error);
                errorToast('Error copying to clipboard');
            }
        }
    }, [shareUrl]);

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
                        {isSharePath && !isOwnShare && (
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={handleGoToMyGoopa}
                                        className={`${active ? 'bg-gray-100' : ''} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                        Go To My Goopa
                                    </button>
                                )}
                            </Menu.Item>
                        )}
                        {localIsShared && canEditShare && (
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

                        <Menu.Item disabled={!canEditShare}>
                            {({ active }) => (
                                <button
                                    onClick={
                                        localIsShared
                                            ? handleUnshareClick
                                            : handleShareClick
                                    }
                                    className={`${
                                        active && canEditShare
                                            ? 'bg-gray-100'
                                            : ''
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm ${
                                        canEditShare
                                            ? ''
                                            : 'opacity-50 cursor-not-allowed'
                                    }`}
                                    disabled={!canEditShare}
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
                                        className={`${
                                            active && canEditShare
                                                ? 'bg-gray-100'
                                                : ''
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm ${
                                            canEditShare
                                                ? ''
                                                : 'opacity-50 cursor-not-allowed'
                                        }`}
                                        disabled={!canEditShare}
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
                                    onClick={() => router.push('/starred-apps')}
                                    className={`${active ? 'bg-gray-100' : ''} group flex w-full items-center rounded-md px-6 py-2 text-sm`}
                                >
                                    Starred Apps
                                </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={handleSignOut}
                                    className={`${active ? 'bg-gray-100' : ''} group flex w-full items-center rounded-md px-6 py-2 text-sm text-red-500`}
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
