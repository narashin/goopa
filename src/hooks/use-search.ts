import { useEffect, useState } from 'react';

import { devApps } from '@/data/dev-apps';
import { generalApps } from '@/data/general-apps';
import { zshPlugins } from '@/data/zsh-plugins';

import { additionalTools } from '../data/additional-tools';
import { requirementTools } from '../data/requirement-tool';
import { AppIcon } from '../types/common-apps';

const allApps: AppIcon[] = [
    ...generalApps,
    ...devApps,
    ...requirementTools.map((tool) => ({
        ...tool,
        category: 'requirement' as const,
        hasScript: true,
    })),
    ...zshPlugins.map((plugin) => ({
        ...plugin,
        category: 'zsh-plugin' as const,
        hasScript: true,
    })),
    ...additionalTools.map((tool) => ({
        ...tool,
        category: 'additional' as const,
        hasScript: true,
    })),
];

export function useSearch(query: string) {
    const [results, setResults] = useState<AppIcon[]>([]);

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
