import { useCallback, useEffect, useMemo, useState } from 'react';

import { debounce } from 'lodash';
import { usePathname, useRouter } from 'next/navigation';

import { searchAppsByCustomUserId, searchAppsByUserId } from '../lib/firestore';
import type { ITool } from '../types/app';

export function useSearch(loggedInUserId?: string, isPublicMode = false) {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<ITool[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [localSearchQuery, setLocalSearchQuery] = useState('');
    const pathname = usePathname();
    const router = useRouter();

    const fetchSearchResults = useCallback(
        async (query: string) => {
            if (query.trim() === '') {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                let searchResults: ITool[] = [];
                if (isPublicMode) {
                    const customUserId = window.location.pathname.split('/')[2];
                    searchResults = await searchAppsByCustomUserId(
                        query,
                        customUserId
                    );
                } else if (loggedInUserId) {
                    searchResults = await searchAppsByUserId(
                        query,
                        loggedInUserId
                    );
                }
                setResults(searchResults);
            } catch (error) {
                console.error('Error searching apps:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        },
        [loggedInUserId, isPublicMode]
    );

    const debouncedFetchSearchResults = useMemo(
        () => debounce(fetchSearchResults, 200),
        [fetchSearchResults]
    );

    useEffect(() => {
        if (searchQuery && loggedInUserId) {
            setLocalSearchQuery(searchQuery);
            debouncedFetchSearchResults(searchQuery);
        }
        return () => {
            debouncedFetchSearchResults.cancel();
        };
    }, [searchQuery, loggedInUserId, debouncedFetchSearchResults]);

    const handleSearch = useCallback(
        async (query: string) => {
            setSearchQuery(query);
            if (!query.trim() || !loggedInUserId) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const searchResults = await searchAppsByUserId(
                    query,
                    loggedInUserId
                );
                setResults(searchResults);
            } catch (error) {
                console.error('Error searching apps:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        },
        [loggedInUserId]
    );

    const clearSearch = useCallback(() => {
        setLocalSearchQuery('');
        setResults([]);
        if (pathname) {
            router.push(pathname);
        }
    }, [pathname, router]);

    return {
        searchQuery: localSearchQuery,
        results,
        isLoading,
        handleSearch,
        clearSearch,
    };
}
