import type React from 'react';

import { Skeleton } from './Skeleton';

export const SkeletonAppIconCard: React.FC = () => {
    return (
        <div className="flex flex-col items-center space-y-2">
            <div className="relative">
                <Skeleton className="w-20 h-20 rounded-2xl" />
            </div>
            <Skeleton className="h-4 w-16" />
        </div>
    );
};
