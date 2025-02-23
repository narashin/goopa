'use client';
import React, { useCallback, useEffect, useState } from 'react';

import { debounce } from 'lodash';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '../../hooks/useAuth';
import { useSearch } from '../../hooks/useSearch';
import { useCategoryStore } from '../../stores/categoryStore';
import { AppCategoryType } from '../../types/category';
import { AuthenticatedUserData } from '../../types/user';
import { UserMenu } from '../templates/UserMenu';
import { Logo } from '../ui/Logo';
import { SearchInput } from '../ui/SearchInput';
import { NavItemSkeleton } from '../ui/skeletons/NavItemSkeleton';
import { SearchInputSkeleton } from '../ui/skeletons/SearchInputSkeleton';
import { UserMenuSkeleton } from '../ui/skeletons/UserMenuSkeleton';

export function TopNav() {
    const {
        user,
        loading,
        handleSignIn,
        handleSignOut,
        isEditMode,
        setIsEditMode,
    } = useAuth();
    const pathname = usePathname();
    const isSharedPage = pathname.split('/')[1] === 'share';
    const { setCategory } = useCategoryStore();
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const { handleSearch: performSearch } = useSearch(user?.uid, isSharedPage);

    const views = ['home', 'general', 'dev', 'advanced'];

    useEffect(() => {
        if (pathname.includes('/general')) {
            setCategory(AppCategoryType.General);
        } else if (pathname.includes('/dev')) {
            setCategory(AppCategoryType.Dev);
        } else if (pathname.includes('/advanced')) {
            setCategory(AppCategoryType.Advanced);
        } else {
            setCategory(AppCategoryType.Home);
        }
    }, [pathname, setCategory]);

    const generateLink = (category: string) => {
        if (pathname?.startsWith('/share/')) {
            const pathParts = pathname.split('/');
            const customUserId = pathParts.length > 2 ? pathParts[2] : null;
            const shareId = pathParts.length > 3 ? pathParts[3] : null;

            if (!customUserId || !shareId) return '/';

            return `/share/${customUserId}/${shareId}${category === 'home' ? '' : `/${category}`}`;
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
                const pathParts = pathname?.split('/') || [];
                const customUserId = pathParts.length > 2 ? pathParts[2] : null;
                const shareId = pathParts.length > 3 ? pathParts[3] : null;

                if (pathname.startsWith('/share/') && customUserId && shareId) {
                    router.push(
                        `/share/${customUserId}/${shareId}/search?q=${encodeURIComponent(query)}`,
                        { scroll: false }
                    );
                } else {
                    router.push(`/search?q=${encodeURIComponent(query)}`, {
                        scroll: false,
                    });
                }
            }
        },
        [router, pathname]
    );

    const handleClearSearch = useCallback(() => {
        setSearchQuery('');

        const pathParts = pathname?.split('/') || [];
        const customUserId = pathParts.length > 2 ? pathParts[2] : null;
        const shareId = pathParts.length > 3 ? pathParts[3] : null;

        if (pathname.startsWith('/share/') && customUserId && shareId) {
            router.push(`/share/${customUserId}/${shareId}`);
        } else {
            router.push('/');
        }
    }, [router, pathname]);

    if (loading) {
        return (
            <div className="flex items-center justify-between p-3 bg-black/20 backdrop-blur-sm border-b border-white/10 relative z-40">
                <Logo isEditMode={false} />
                <div className="flex space-x-4">
                    {views.map((_, index) => (
                        <NavItemSkeleton key={index} />
                    ))}
                </div>
                <SearchInputSkeleton />
                <UserMenuSkeleton />
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
                <div className="flex space-x-4 text-sm overflow-x-auto scrollbar-hide">
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
                <div className="flex items-center space-x-2 flex-shrink-0">
                    {user && !user.isAnonymous ? (
                        <UserMenu
                            handleSignOut={handleSignOut}
                            isEditMode={isEditMode}
                            toggleEditMode={toggleEditMode}
                            user={user as AuthenticatedUserData}
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
