import { useCallback, useEffect, useState } from 'react';

import _ from 'lodash';
import { usePathname, useRouter } from 'next/navigation';

import { searchApps } from '../lib/firestore';
import type { ITool } from '../types/app';

export function useSearch(loggedInUserId?: string) {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<ITool[]>([]);
    const router = useRouter();
    const pathname = usePathname();

    const isSharePage = pathname?.startsWith('/share/');

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (searchQuery === '') {
                setResults([]);
                return;
            }

            try {
                let searchResults;
                if (isSharePage) {
                    const customUserId = pathname?.split('/')[2];
                    searchResults = await searchApps(searchQuery, customUserId);
                } else {
                    searchResults = await searchApps(
                        searchQuery,
                        loggedInUserId
                    );
                }
                setResults(searchResults);
            } catch (error) {
                console.error('Error searching apps:', error);
                setResults([]);
            }
        };

        fetchSearchResults();
    }, [searchQuery, loggedInUserId, isSharePage, pathname]);

    const debouncedSearch = useCallback(
        _.debounce((query: string) => {
            if (query.trim()) {
                router.push(`/search?q=${encodeURIComponent(query)}`);
            } else {
                router.push('/');
            }
        }, 300),
        []
    );

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        debouncedSearch(query);
    };

    const clearSearch = () => {
        setSearchQuery('');
        router.push('/');
    };

    return { searchQuery, results, handleSearch, clearSearch };
}
