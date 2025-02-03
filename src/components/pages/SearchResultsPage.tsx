'use client';
import React from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { AppIconCard } from '../../components/templates/AppIconCard';
import { Card } from '../../components/ui/Card';
import type { ITool } from '../../types/app';
import { AppCategoryType } from '../../types/category';

interface SearchResultsPageProps {
    results: ITool[];
    searchQuery: string;
    isLoading: boolean;
}

export function SearchResultsPage({
    results,
    searchQuery,
    isLoading,
}: SearchResultsPageProps) {
    const router = useRouter();
    const pathname = usePathname();
    const isSharePage = pathname?.startsWith('/share/');

    const handleNavigation = (app: ITool) => {
        console.log('Navigation triggered for app:', app);
        if (app.hasScript) {
            const category = AppCategoryType.Advanced;
            if (isSharePage) {
                const customUserId = pathname?.split('/')[2];
                router.push(
                    `/share/${customUserId}/${category.toLowerCase()}/${app.id}`
                );
            } else {
                router.push(`/apps/${category.toLowerCase()}/${app.id}`);
            }
        } else {
            // Do nothing for apps without scripts
            console.log('App does not have a script, no navigation required');
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 p-4 overflow-auto">
                <Card className="h-full bg-black/20 border-white/10 backdrop-blur-sm">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-white/90 mb-6">
                            검색 중...
                        </h2>
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 overflow-auto">
            <Card className="h-full bg-black/20 border-white/10 backdrop-blur-sm">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-white/90 mb-6">
                        {searchQuery
                            ? `"${searchQuery}"에 대한 검색 결과`
                            : '검색 결과'}
                    </h2>
                    {!searchQuery && (
                        <p className="text-white/70">
                            검색어를 입력하면 실시간으로 결과가 표시됩니다.
                        </p>
                    )}
                    {searchQuery &&
                    Array.isArray(results) &&
                    results.length === 0 ? (
                        <p className="text-white/70">
                            {
                                '검색 결과가 없습니다. 다른 검색어를 시도해보세요.'
                            }
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {Array.isArray(results) &&
                                results.map((app) => (
                                    <AppIconCard
                                        key={app.id}
                                        app={app}
                                        onClick={() =>
                                            app.hasScript
                                                ? handleNavigation(app)
                                                : null
                                        }
                                        onDeleteApp={() => {
                                            console.log(
                                                'Delete app not implemented for search results'
                                            );
                                        }}
                                    />
                                ))}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
