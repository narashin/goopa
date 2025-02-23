'use client';

import type React from 'react';
import { useEffect } from 'react';

import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/skeletons/Skeleton';
import { useAuthQuery } from '../../queries/authQueries';
import { useAuthStore } from '../../stores/authStore';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { data: user, isLoading } = useAuthQuery();
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        if (!isLoading) {
            setUser(user ?? null);
        }
    }, [user, isLoading, setUser]);

    if (isLoading) {
        return (
            <Card className="p-4">
                <div className="space-y-3">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                </div>
            </Card>
        );
    }

    return <>{children}</>;
};
