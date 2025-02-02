import { useCallback, useEffect, useState } from 'react';

import _ from 'lodash';
import { useRouter } from 'next/navigation';

import { getAppsFromFirestore } from '../lib/firestore';
import { ITool } from '../types/app';

export function useSearch(userId?: string) {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<ITool[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (!userId) return;

        const fetchUserApps = async () => {
            try {
                const apps = await getAppsFromFirestore(userId);

                if (searchQuery.trim() === '') {
                    setResults([]);
                } else {
                    const filteredResults = apps.filter((app) =>
                        [app.name, app.downloadUrl, app.description]
                            .filter(Boolean)
                            .join(' ')
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                    );
                    setResults(filteredResults);
                }
            } catch (error) {
                console.error('Error fetching apps:', error);
                setResults([]);
            }
        };

        fetchUserApps();
    }, [searchQuery, userId]);

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
