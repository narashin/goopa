'use client';

import React, { useEffect } from 'react';

import { useSearchParams } from 'next/navigation';

import { SearchResultsPage } from '../../components/pages/SearchResultsPage';
import { useAuth } from '../../hooks/useAuth';
import { useSearch } from '../../hooks/useSearch';
import { useShareHandler } from '../../hooks/useShareHandler';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams?.get('q') || '';
    const { user } = useAuth();
    const { results, isLoading, handleSearch, searchQuery } = useSearch(
        user?.uid
    );
    const isPublicMode = useShareHandler(user);

    useEffect(() => {
        if (query !== searchQuery) {
            handleSearch(query);
        }
    }, [query, searchQuery, handleSearch]);

    console.log('SearchPage rendering:', {
        query,
        results,
        isLoading,
        isPublicMode,
    });

    return (
        <SearchResultsPage
            results={results}
            searchQuery={query}
            isLoading={isLoading}
            onSearch={handleSearch}
        />
    );
}
