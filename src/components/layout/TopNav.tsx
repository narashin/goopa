import React, { useEffect, useState } from 'react';

import { signInWithPopup, signOut, type User } from 'firebase/auth';
import Image from 'next/image';

import { Menu } from '@headlessui/react';
import {
    ArrowRightOnRectangleIcon,
    CogIcon,
    UserIcon,
} from '@heroicons/react/20/solid';

import { auth, googleProvider } from '../../lib/firebase';
import { MenuType } from '../../types/menu';
import { Logo } from '../ui/Logo';
import { SearchInput } from '../ui/SearchInput';

interface TopNavProps {
    onNavigate: (view: MenuType) => void;
    currentView: MenuType;
    onSearch: (query: string) => void;
}

export function TopNav({ onNavigate, currentView, onSearch }: TopNavProps) {
    const views: MenuType[] = ['home', 'general', 'dev', 'advanced'];
    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        onSearch(query);
    };

    const clearSearch = () => {
        setSearchQuery('');
        onSearch('');
    };

    const handleProfileAction = (action: string) => {
        console.log(`Profile action: ${action}`);
        // Here you would typically handle the action, e.g. navigate to profile page, open settings, or log out
    };

    const handleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error('Error signing in with Google', error);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out', error);
        }
    };

    return (
        <div className="flex items-center justify-between p-3 bg-black/20 backdrop-blur-sm border-b border-white/10 relative z-40">
            <div className="flex items-center space-x-3">
                <Logo />
            </div>
            <div className="flex space-x-4 text-sm">
                {views.map((view) => (
                    <button
                        key={view}
                        className={`px-3 h-8 rounded-md transition-colors ${
                            currentView === view
                                ? 'text-white bg-white/10'
                                : 'text-white/70 hover:text-white'
                        }`}
                        onClick={() => onNavigate(view)}
                    >
                        {view
                            .split('-')
                            .map(
                                (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(' ')}
                    </button>
                ))}
            </div>
            <div className="flex items-center space-x-3 relative">
                <SearchInput
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onClear={clearSearch}
                />
            </div>
            {user ? (
                <Menu as="div" className="relative ml-4">
                    <Menu.Button className="relative w-8 h-8 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                        <Image
                            src="/images/sticker.webp"
                            alt="Profile"
                            layout="fill"
                            objectFit="cover"
                        />
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    className={`${
                                        active ? 'bg-gray-100' : ''
                                    } group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                                    onClick={() =>
                                        handleProfileAction('profile')
                                    }
                                >
                                    <UserIcon
                                        className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                        aria-hidden="true"
                                    />
                                    Profile
                                </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    className={`${
                                        active ? 'bg-gray-100' : ''
                                    } group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                                    onClick={() =>
                                        handleProfileAction('settings')
                                    }
                                >
                                    <CogIcon
                                        className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                        aria-hidden="true"
                                    />
                                    Settings
                                </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    className={`${
                                        active ? 'bg-gray-100' : ''
                                    } group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                                    onClick={() => handleSignOut()}
                                >
                                    <ArrowRightOnRectangleIcon
                                        className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                        aria-hidden="true"
                                    />
                                    Log out
                                </button>
                            )}
                        </Menu.Item>
                    </Menu.Items>
                </Menu>
            ) : (
                <button
                    onClick={handleSignIn}
                    className="ml-4 px-4 py-2 text-sx font-medium text-white bg-blue-900 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Sign In
                </button>
            )}
        </div>
    );
}
