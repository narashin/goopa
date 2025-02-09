import { useQuery } from '@tanstack/react-query';

import { getAppsFromFirestore } from '../lib/firestore';

export function useApps(userId: string | null) {
    if (userId)
        return useQuery({
            queryKey: ['apps', userId],
            queryFn: () => getAppsFromFirestore(userId),
            enabled: !!userId,
        });
}
