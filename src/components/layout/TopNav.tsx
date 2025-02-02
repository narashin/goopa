import React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAppContext } from '../../contexts/AppContext';
import { useAuth } from '../../hooks/useAuth';
import { useSearch } from '../../hooks/useSearch';
import { useShareHandler } from '../../hooks/useShareHandler';
import { UserMenu } from '../templates/UserMenu';
import { Logo } from '../ui/Logo';
import { SearchInput } from '../ui/SearchInput';

export function TopNav() {
    const { user, loading, handleSignIn, handleSignOut } = useAuth();
    const { searchQuery, handleSearch, clearSearch } = useSearch(
        user?.uid || ''
    );
    const { isEditMode, setIsEditMode } = useAppContext();
    const { publishUrl } = useShareHandler(user);
    const pathname = usePathname();

    const views = ['home', 'general', 'dev', 'advanced'];

    const generateLink = (category: string) => {
        if (pathname?.startsWith('/share/')) {
            return `${publishUrl}${category === 'home' ? '' : `/${category}`}`;
        } else {
            return category === 'home' ? '/' : `/${category}`;
        }
    };

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <div className="flex items-center justify-between p-3 bg-black/20 backdrop-blur-sm border-b border-white/10 relative z-40">
                {/* 로고 */}
                <div className="flex items-center space-x-3">
                    <Logo />
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
                        disabled={true} // 개인화 기능 전까지 비활성화
                        value={searchQuery}
                        onChange={handleSearch}
                        onClear={clearSearch}
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
