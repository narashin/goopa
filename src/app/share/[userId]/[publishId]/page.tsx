'use client';
import React from 'react';

import { useSearchParams } from 'next/navigation';

import { SearchResultsPage } from '../../../../components/pages/SearchResultsPage';
import { useAuth } from '../../../../hooks/useAuth';
import { useSearch } from '../../../../hooks/useSearch';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams?.get('q') || '';
    const { user } = useAuth();
    const { results, isLoading } = useSearch(user?.uid);

    console.log('SearchPage rendering:', { query, results, isLoading });

    return (
        <SearchResultsPage
            results={results}
            searchQuery={query}
            isLoading={isLoading}
        />
    );
}
