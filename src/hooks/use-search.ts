import { useEffect, useState } from 'react';

import { getAppsFromFirestore } from '../lib/firestore';
import { ITool } from '../types/app';

export function useSearch(query: string, userId: string) {
    const [results, setResults] = useState<ITool[]>([]);
    // const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserApps = async () => {
            // setLoading(true);
            try {
                const apps = await getAppsFromFirestore(userId);

                // 검색어에 맞는 앱들 필터링
                if (query.trim() === '') {
                    setResults([]);
                } else {
                    const filteredResults = apps.filter((app) =>
                        [app.name, app.downloadUrl, app.description]
                            .filter(Boolean)
                            .join(' ')
                            .toLowerCase()
                            .includes(query.toLowerCase())
                    );
                    setResults(filteredResults);
                }
            } catch (error) {
                console.error('Error fetching apps:', error);
                setResults([]);
            }
            // setLoading(false);
        };

        fetchUserApps();
    }, [query, userId]);

    return { results };
}
