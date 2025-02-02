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
        if (app.downloadUrl) {
            window.open(app.downloadUrl, '_blank', 'noopener,noreferrer');
        } else {
            const category = app.hasScript
                ? AppCategoryType.Advanced
                : app.category;

            if (isSharePage) {
                const customUserId = pathname?.split('/')[2];
                router.push(
                    `/share/${customUserId}/${category.toLowerCase()}/${app.id}`
                );
            } else {
                router.push(`/apps/${category.toLowerCase()}/${app.id}`);
            }
        }
    };

    if (!searchQuery) {
        return (
            <div className="flex-1 p-4 overflow-auto">
                <Card className="h-full bg-black/20 border-white/10 backdrop-blur-sm">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-white/90 mb-6">
                            검색어를 입력해주세요
                        </h2>
                    </div>
                </Card>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex-1 p-4 overflow-auto">
                <Card className="h-full bg-black/20 border-white/10 backdrop-blur-sm">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-white/90 mb-6">
                            검색 중...
                        </h2>
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
                        &quot;{searchQuery}&quot;에 대한 검색 결과
                    </h2>
                    {results.length === 0 ? (
                        <p className="text-white/70">검색 결과가 없습니다</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {results.map((app) => (
                                <AppIconCard
                                    key={app.id}
                                    app={app}
                                    onClick={() => handleNavigation(app)}
                                    onDeleteApp={() => {}}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
