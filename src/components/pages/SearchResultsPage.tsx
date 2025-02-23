'use client';
import React, { useCallback, useMemo } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { AppIconCard } from '../../components/templates/AppIconCard';
import { Card } from '../../components/ui/Card';
import { AppCategoryType } from '../../types/category';
import { ITool } from '../../types/item';

interface SearchResultsPageProps {
    results: ITool[];
    searchQuery: string;
    isLoading: boolean;
    onSearch: (query: string) => void;
}

const SearchResultsContent = React.memo(
    ({
        results,
        isLoading,
        searchQuery,
        handleNavigation,
    }: {
        results: ITool[];
        isLoading: boolean;
        searchQuery: string;
        handleNavigation: (app: ITool) => void;
    }) => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
            );
        }

        if (searchQuery && results.length === 0) {
            return <p className="text-white/70">No search results found.</p>;
        }

        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {results.map((app) => (
                    <AppIconCard
                        key={app.id}
                        app={app}
                        onClick={() =>
                            app.hasScript ? handleNavigation(app) : null
                        }
                        onDeleteApp={() => {}}
                    />
                ))}
            </div>
        );
    }
);

SearchResultsContent.displayName = 'SearchResultsContent';
interface SearchResultsPageProps {
    results: ITool[];
    searchQuery: string;
    isLoading: boolean;
    onSearch: (query: string) => void;
}

export function SearchResultsPage({
    results,
    searchQuery,
    isLoading,
}: SearchResultsPageProps) {
    const router = useRouter();
    const pathname = usePathname();
    const isSharePage = pathname?.startsWith('/share/');

    const handleNavigation = useCallback(
        (app: ITool) => {
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
            }
        },
        [isSharePage, pathname, router]
    );

    const memoizedResults = useMemo(() => results, [results]);

    return (
        <div className="flex-1 p-4 overflow-auto">
            <Card className="h-full bg-black/20 border-white/10 backdrop-blur-sm">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-white/90 mb-6">
                        {searchQuery
                            ? `Search results for "${searchQuery}"`
                            : 'Search results'}
                    </h2>
                    <SearchResultsContent
                        results={memoizedResults}
                        isLoading={isLoading}
                        searchQuery={searchQuery}
                        handleNavigation={handleNavigation}
                    />
                </div>
            </Card>
        </div>
    );
}
