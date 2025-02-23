import { useQuery } from '@tanstack/react-query';

import { getStarredAppsByUser } from '../lib/firestore/starredApps';
import { ITool } from '../types/item';

export const useGetStarredApps = (userId: string | null) => {
    return useQuery<ITool[], Error>({
        queryKey: ['starredApps', userId],
        queryFn: async () => {
            if (!userId) {
                return [];
            }
            return await getStarredAppsByUser(userId);
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
};
