'use client';

import React, { useEffect } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import { SearchResultsPage } from '../../../../../components/pages/SearchResultsPage';
import { useSearch } from '../../../../../hooks/useSearch';

export default function SharedSearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams?.get('q') || '';
    const pathname = usePathname();
    const customUserId = pathname?.split('/')[2];
    const { results, isLoading, handleSearch, searchQuery } = useSearch(
        customUserId,
        true
    );

    useEffect(() => {
        if (query !== searchQuery) {
            handleSearch(query);
        }
    }, [query, searchQuery, handleSearch]);

    console.log('SharedSearchPage rendering:', { query, results, isLoading });

    return (
        <SearchResultsPage
            results={results}
            searchQuery={query}
            isLoading={isLoading}
            onSearch={handleSearch}
        />
    );
}
