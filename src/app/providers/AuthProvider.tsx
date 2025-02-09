'use client';

import type React from 'react';
import { useEffect } from 'react';

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
        return <div>Loading...</div>;
    }

    return <>{children}</>;
};
