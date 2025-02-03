'use client';

import React, { useEffect } from 'react';

import { useSearchParams } from 'next/navigation';

import { SearchResultsPage } from '../../components/pages/SearchResultsPage';
import { useAuth } from '../../hooks/useAuth';
import { useSearch } from '../../hooks/useSearch';

export default function SearchPage() {
    const { user, loading: authLoading } = useAuth();
    const {
        results,
        isLoading: searchLoading,
        handleSearch,
        searchQuery,
    } = useSearch(user?.uid);
    const searchParams = useSearchParams();
    const query = searchParams?.get('q') || '';

    useEffect(() => {
        if (!authLoading && user && query !== searchQuery) {
            handleSearch(query);
        }
    }, [query, handleSearch, searchQuery, user, authLoading]);

    const isLoading = authLoading || searchLoading;

    if (isLoading) {
        return <div>검색 결과를 불러오는 중...</div>;
    }

    return (
        <SearchResultsPage
            results={results}
            searchQuery={searchQuery}
            isLoading={isLoading}
        />
    );
}
