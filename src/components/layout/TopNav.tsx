import React, { useCallback, useEffect, useState } from 'react';

import { signOut } from 'firebase/auth';
import * as _ from 'lodash';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Menu } from '@headlessui/react';

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
    const { user, setUser, isEditMode, setIsEditMode } = useAppContext();
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
                    <>
                        <Menu
                            as="div"
                            className="relative inline-block text-left"
                        >
                            <div>
                                <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                    {user.displayName || user.email}
                                </Menu.Button>
                            </div>
                            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={toggleEditMode}
                                            className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-left text-sm`}
                                        >
                                            {isEditMode
                                                ? 'Edit Mode OFF'
                                                : 'Edit Mode ON'}
                                        </button>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={handleSignOut}
                                            className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-left text-sm`}
                                        >
                                            Sign out
                                        </button>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Menu>
                    </>
                ) : (
                    <button
                        className="ml-4 px-4 py-2 text-sx font-medium text-white bg-blue-900 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={handleSignIn}
                    >
                        Sign in
                    </button>
                )}
            </div>
        </div>
    );
}
