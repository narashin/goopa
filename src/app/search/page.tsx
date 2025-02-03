'use client';

import React, { Suspense, useEffect } from 'react';

import { useSearchParams } from 'next/navigation';

import { SearchResultsPage } from '../../components/pages/SearchResultsPage';
import { useAuth } from '../../hooks/useAuth';
import { useSearch } from '../../hooks/useSearch';

function SearchLoading() {
    return (
        <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
    );
}

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams?.get('q') || '';
    const { user } = useAuth();
    const { results, isLoading, handleSearch, searchQuery } = useSearch(
        user?.uid
    );

    useEffect(() => {
        if (query !== searchQuery) {
            handleSearch(query);
        }
    }, [query, searchQuery, handleSearch]);

    return (
        <SearchResultsPage
            results={results}
            searchQuery={query}
            isLoading={isLoading}
            onSearch={handleSearch}
        />
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<SearchLoading />}>
            <SearchResults />
        </Suspense>
    );
}
