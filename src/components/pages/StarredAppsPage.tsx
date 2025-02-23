'use client';
import React from 'react';

import { AppIconCard } from '../../components/templates/AppIconCard';
import { useAuth } from '../../hooks/useAuth';
import { useGetStarredApps } from '../../queries/starQueries';
import { Skeleton } from '../ui/skeletons/Skeleton';

export default function StarredAppsPage() {
    const { user } = useAuth();
    const userId = user?.uid ?? null;

    const { data: starredApps, isLoading, error } = useGetStarredApps(userId);

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8 text-white">
                Please log in to view your starred apps.
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-red-500">
                {error.message ||
                    'Unable to load starred apps. Please try again later.'}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 text-white">
            <h1 className="text-2xl font-bold mb-6">Starred Apps</h1>
            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {[...Array(10)].map((_, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center space-y-2"
                        >
                            <Skeleton className="w-20 h-20 rounded-2xl" />
                            <Skeleton className="w-16 h-4" />
                        </div>
                    ))}
                </div>
            ) : !starredApps || starredApps.length === 0 ? (
                <p>{"You haven't starred any apps yet."}</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {starredApps.map((app) => (
                        <AppIconCard
                            key={app.id}
                            app={app}
                            onAddNewApp={async () => {}}
                            onClick={() => {}}
                            onDeleteApp={() => {}}
                            readOnly={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
