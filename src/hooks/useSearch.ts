import { useCallback, useEffect, useMemo, useState } from 'react';

import { debounce } from 'lodash';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { searchAppsByCustomUserId, searchAppsByUserId } from '../lib/firestore';
import type { ITool } from '../types/app';

export function useSearch(loggedInUserId?: string) {
    const [results, setResults] = useState<ITool[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [localSearchQuery, setLocalSearchQuery] = useState('');
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const searchQuery = searchParams?.get('q') || '';

    const isSharePage = pathname?.startsWith('/share/');

    const fetchSearchResults = useCallback(
        async (query: string) => {
            console.log('fetchSearchResults 실행:', {
                query,
                loggedInUserId,
                isSharePage,
            });
            if (query.trim() === '' || !loggedInUserId) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                let searchResults: ITool[] = [];
                if (isSharePage && pathname) {
                    const customUserId = pathname.split('/')[2];
                    if (!customUserId) {
                        console.error('customUserId를 찾을 수 없습니다.');
                        return;
                    }
                    console.log('searchAppsByCustomUserId 호출:', {
                        query,
                        customUserId,
                    });
                    searchResults = await searchAppsByCustomUserId(
                        query,
                        customUserId
                    );
                } else {
                    console.log('searchAppsByUserId 호출:', {
                        query,
                        loggedInUserId,
                    });
                    searchResults = await searchAppsByUserId(
                        query,
                        loggedInUserId
                    );
                }
                console.log('검색 결과:', searchResults);
                setResults(searchResults);

                // URL 업데이트
                if (pathname) {
                    const newSearchParams = new URLSearchParams(
                        searchParams?.toString() || ''
                    );
                    newSearchParams.set('q', query);
                    router.push(`${pathname}?${newSearchParams.toString()}`, {
                        scroll: false,
                    });
                }
            } catch (error) {
                console.error('Error searching apps:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        },
        [loggedInUserId, isSharePage, pathname, router, searchParams]
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
        (query: string) => {
            console.log('handleSearch 호출:', query);
            setLocalSearchQuery(query);
            debouncedFetchSearchResults(query);
        },
        [debouncedFetchSearchResults]
    );

    const clearSearch = useCallback(() => {
        console.log('clearSearch 호출');
        setLocalSearchQuery('');
        setResults([]);
        if (pathname) {
            router.push(pathname);
        }
    }, [pathname, router]);

    console.log('useSearch 훅 상태:', {
        localSearchQuery,
        results,
        isLoading,
        loggedInUserId,
    });
    return {
        searchQuery: localSearchQuery,
        results,
        isLoading,
        handleSearch,
        clearSearch,
    };
}
