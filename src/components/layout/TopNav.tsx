'use client';
import React, { useCallback, useEffect, useState } from 'react';

import { debounce } from 'lodash';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useAppContext } from '../../contexts/AppContext';
import { useAuth } from '../../hooks/useAuth';
import { useSearch } from '../../hooks/useSearch';
import { useShareHandler } from '../../hooks/useShareHandler';
import { UserMenu } from '../templates/UserMenu';
import { Logo } from '../ui/Logo';
import { SearchInput } from '../ui/SearchInput';

function SkeletonNavItem() {
    return (
        <div className="w-16 h-8 bg-gray-700 rounded-md animate-pulse"></div>
    );
}

function SkeletonSearchInput() {
    return (
        <div className="w-48 h-8 bg-gray-700 rounded-md animate-pulse"></div>
    );
}

function SkeletonUserMenu() {
    return (
        <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
    );
}

export function TopNav() {
    const { user, loading, handleSignIn, handleSignOut } = useAuth();
    const { isEditMode, setIsEditMode } = useAppContext();
    const pathname = usePathname();
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const { isPublicMode } = useShareHandler(user);
    const { handleSearch: performSearch } = useSearch(user?.uid, isPublicMode);
    const views = ['home', 'general', 'dev', 'advanced'];

    const generateLink = (category: string) => {
        if (pathname?.startsWith('/share/')) {
            const [, , customUserId, publishId] = pathname.split('/');
            return `/share/${customUserId}/${publishId}${category === 'home' ? '' : `/${category}`}`;
        } else {
            return category === 'home' ? '/' : `/${category}`;
        }
    };

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    const debouncedSearch = useCallback(
        debounce((query: string) => {
            performSearch(query);
        }, 300),
        [performSearch]
    );

    useEffect(() => {
        if (searchQuery) {
            debouncedSearch(searchQuery);
        }
    }, [searchQuery, debouncedSearch]);

    const handleSearchChange = useCallback(
        (query: string) => {
            setSearchQuery(query);
            if (query) {
                if (isPublicMode) {
                    const [, , customUserId, publishId] =
                        pathname?.split('/') || [];
                    router.push(
                        `/share/${customUserId}/${publishId}/search?q=${encodeURIComponent(query)}`,
                        { scroll: false }
                    );
                } else {
                    router.push(`/search?q=${encodeURIComponent(query)}`, {
                        scroll: false,
                    });
                }
            }
        },
        [router, isPublicMode, pathname]
    );

    const handleClearSearch = useCallback(() => {
        setSearchQuery('');
        if (isPublicMode) {
            const [, , customUserId, publishId] = pathname?.split('/') || [];
            router.push(`/share/${customUserId}/${publishId}`);
        } else {
            router.push('/');
        }
    }, [router, isPublicMode, pathname]);

    if (loading) {
        return (
            <div className="flex items-center justify-between p-3 bg-black/20 backdrop-blur-sm border-b border-white/10 relative z-40">
                <Logo isEditMode={false} />
                <div className="flex space-x-4">
                    {views.map((_, index) => (
                        <SkeletonNavItem key={index} />
                    ))}
                </div>
                <SkeletonSearchInput />
                <SkeletonUserMenu />
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between p-3 bg-black/20 backdrop-blur-sm border-b border-white/10 relative z-40">
                {/* 로고 */}
                <div className="flex items-center space-x-3">
                    <Logo isEditMode={isEditMode} />
                </div>

                {/* 네비게이션 메뉴 */}
                <div className="flex space-x-4 text-sm">
                    {views.map((view) => (
                        <Link key={view} href={generateLink(view)}>
                            <button
                                className={`px-3 h-8 rounded-md transition-colors ${
                                    (view === 'home' && pathname === '/') ||
                                    (view !== 'home' &&
                                        pathname?.includes(`/${view}`))
                                        ? 'text-white bg-white/10'
                                        : 'text-white/70 hover:text-white'
                                }`}
                            >
                                {view.charAt(0).toUpperCase() + view.slice(1)}
                            </button>
                        </Link>
                    ))}
                </div>

                {/* 검색 입력 */}
                <div className="flex items-center space-x-3 relative">
                    <SearchInput
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onClear={handleClearSearch}
                    />
                </div>

                {/* 사용자 메뉴 */}
                <div className="flex items-center space-x-4">
                    {user ? (
                        <UserMenu
                            handleSignOut={handleSignOut}
                            isEditMode={isEditMode}
                            toggleEditMode={toggleEditMode}
                            user={user}
                        />
                    ) : (
                        <button
                            className="ml-4 px-3 py-1.5 text-xs font-medium text-white bg-gray-800 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out shadow-sm"
                            onClick={handleSignIn}
                        >
                            Sign in
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}
