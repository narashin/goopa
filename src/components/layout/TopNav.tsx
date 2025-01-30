import React, { useEffect, useState } from 'react';

import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Menu } from '@headlessui/react';
import {
    ArrowRightOnRectangleIcon,
    EyeIcon,
    PencilIcon,
} from '@heroicons/react/20/solid';

import { useAppContext } from '../../contexts/AppContext';
import { signInWithGoogle } from '../../lib/auth';
import { auth } from '../../lib/firebase';
import { MenuType } from '../../types/menu';
import { Logo } from '../ui/Logo';
import { SearchInput } from '../ui/SearchInput';

interface TopNavProps {
    onSearch: (query: string) => void;
}

export function TopNav({ onSearch }: TopNavProps) {
    const views: MenuType[] = ['home', 'general', 'dev', 'advanced'];
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const { user, setUser, isEditMode, setIsEditMode } = useAppContext();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        onSearch(query);
    };

    const clearSearch = () => {
        setSearchQuery('');
        onSearch('');
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
                <form onSubmit={handleSearchSubmit}>
                    <SearchInput
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onClear={clearSearch}
                    />
                </form>
            </div>

            {!loading && (
                <>
                    {user ? (
                        <Menu as="div" className="relative ml-4">
                            <Menu.Button className="relative w-9 h-9 mr-3 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                <img
                                    src={
                                        user.photoURL || '/images/sticker.webp'
                                    }
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </Menu.Button>
                            <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`${
                                                active ? 'bg-gray-100' : ''
                                            } group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                                            onClick={toggleEditMode}
                                        >
                                            {isEditMode ? (
                                                <>
                                                    <EyeIcon
                                                        className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                                        aria-hidden="true"
                                                    />
                                                    Go To Read Mode
                                                </>
                                            ) : (
                                                <>
                                                    <PencilIcon
                                                        className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                                        aria-hidden="true"
                                                    />
                                                    Go To Edit Mode
                                                </>
                                            )}
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
                </>
            )}
        </div>
    );
}
