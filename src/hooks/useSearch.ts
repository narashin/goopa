import { useCallback, useMemo, useState } from 'react';

import { debounce } from 'lodash';

import { useQuery } from '@tanstack/react-query';

import {
    searchAppsByCustomUserId,
    searchAppsByUserId,
} from '../lib/firestore/search';
import { ITool } from '../types/item';

export function useSearch(loggedInUserId?: string, isPublicMode = false) {
    const [searchQuery, setSearchQuery] = useState('');
    const [localSearchQuery, setLocalSearchQuery] = useState('');

    // ✅ Firestore에서 검색 데이터 가져오기 (React Query)
    const { data: results, isLoading } = useQuery<ITool[], Error>({
        queryKey: ['searchApps', searchQuery, loggedInUserId, isPublicMode],
        queryFn: async () => {
            if (!searchQuery.trim()) return [];
            if (isPublicMode) {
                const customUserId = window.location.pathname.split('/')[2];
                return await searchAppsByCustomUserId(
                    searchQuery,
                    customUserId
                );
            } else if (loggedInUserId) {
                return await searchAppsByUserId(searchQuery, loggedInUserId);
            }
            return [];
        },
        enabled: !!searchQuery.trim(),
        staleTime: 1000 * 60 * 5, // ✅ 캐시 5분 유지
    });

    const debouncedFetchSearchResults = useMemo(
        () => debounce((query: string) => setSearchQuery(query), 200),
        []
    );

    const handleSearch = useCallback(
        (query: string) => {
            setLocalSearchQuery(query);
            debouncedFetchSearchResults(query);
        },
        [debouncedFetchSearchResults]
    );

    const clearSearch = useCallback(() => {
        setLocalSearchQuery('');
        setSearchQuery('');
    }, []);

    return {
        searchQuery: localSearchQuery,
        results: results ?? [], // ✅ `undefined` 방지
        isLoading,
        handleSearch,
        clearSearch,
    };
}
