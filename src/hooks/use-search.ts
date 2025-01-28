import { useEffect, useState } from 'react';

import { allApps } from '../data/all-apps';
import { ITool } from '../types/app';

export function useSearch(query: string) {
    const [results, setResults] = useState<ITool[]>([]);

    useEffect(() => {
        if (query.trim() === '') {
            setResults([]);
            return;
        }

        const filteredResults = allApps.filter((app) =>
            [app.name, app.downloadUrl, app.description]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(query.toLowerCase())
        );

        setResults(filteredResults);
    }, [query]);

    return results;
}
