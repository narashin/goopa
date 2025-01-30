import React, { Fragment, useCallback, useEffect, useState } from 'react';

import { signOut } from 'firebase/auth';
import * as _ from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
    Menu, MenuButton, MenuItem, MenuItems, Transition,
} from '@headlessui/react';

import { useAppContext } from '../../contexts/AppContext';
import { signInWithGoogle } from '../../lib/auth';
import { auth } from '../../lib/firebase';
import { MenuType } from '../../types/menu';
import { Logo } from '../ui/Logo';
import { SearchInput } from '../ui/SearchInput';

export function TopNav() {
    const views: MenuType[] = ['home', 'general', 'dev', 'advanced'];
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(auth.currentUser);
    const { isEditMode, setIsEditMode } = useAppContext();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [setUser]);

    const debouncedSearch = useCallback(
        _.debounce((query: string) => {
            if (query.trim()) {
                router.push(`/search?q=${encodeURIComponent(query)}`);
            } else {
                router.push('/');
            }
        }, 300),
        []
    );

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        debouncedSearch(query);
    };

    const clearSearch = () => {
        setSearchQuery('');
        router.push('/');
    };

    const handleSignIn = async () => {
        try {
            const result = await signInWithGoogle();
            setUser(result);
        } catch (error) {
            console.error('Error signing in with Google:', error);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setIsEditMode(false);
        } catch (error) {
            console.error('Error signing out with Google', error);
        }
    };

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex items-center justify-between p-3 bg-black/20 backdrop-blur-sm border-b border-white/10 relative z-40">
            <div className="flex items-center space-x-3">
                <Logo isEditMode={isEditMode} />
            </div>

            <div className="flex space-x-4 text-sm">
                {views.map((view) => (
                    <Link
                        key={view}
                        href={view === 'home' ? '/' : `/apps/${view}`}
                    >
                        <button
                            className={`px-3 h-8 rounded-md transition-colors ${
                                (view === 'home' && pathname === '/') ||
                                (view !== 'home' &&
                                    pathname?.includes(`/apps/${view}`))
                                    ? 'text-white bg-white/10'
                                    : 'text-white/70 hover:text-white'
                            }`}
                        >
                            {view
                                .split('-')
                                .map(
                                    (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1)
                                )
                                .join(' ')}
                        </button>
                    </Link>
                ))}
            </div>
            <div className="flex items-center space-x-3 relative">
                <SearchInput
                    value={searchQuery}
                    onChange={handleSearch}
                    onClear={clearSearch}
                />
            </div>
            <div className="flex items-center space-x-4">
                {user ? (
                    <Menu as="div" className="relative inline-block text-left">
                        <div className="flex items-center">
                            <MenuButton className="inline-flex w-full justify-center items-center">
                                {user.photoURL ? (
                                    <Image
                                        src={user.photoURL}
                                        alt="Profile"
                                        width={32}
                                        height={32}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                                        {user.displayName
                                            ? user.displayName[0].toUpperCase()
                                            : 'U'}
                                    </div>
                                )}
                            </MenuButton>
                        </div>
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
                                    <MenuItem>
                                        {({ active }) => (
                                            <div className="w-full">
                                                {isEditMode && (
                                                    <div className="flex items-center px-4 py-2 text-xs text-gray-500">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                                        {"You're in Edit Mode"}
                                                    </div>
                                                )}
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
                                            </div>
                                        )}
                                    </MenuItem>
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
                ) : (
                    <button
                        className="ml-4 px-3 py-1.5 text-xs font-medium text-white bg-gray-800 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out shadow-sm"
                        onClick={handleSignIn}
                    >
                        Sign in
                    </button>
                )}
            </div>
        </div>
    );
}
