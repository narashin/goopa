'use client';

import React from 'react';

import { usePathname } from 'next/navigation';

import { AppboardHeader } from '../../components/templates/AppBoardHeader';
import { AppIconCard } from '../../components/templates/AppIconCard';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../hooks/useAuth';
import { ITool } from '../../types/item';

interface GeneralAppsPageProps {
    apps: ITool[];
    onAddNewApp: (newApp: Omit<ITool, 'id'>) => Promise<void>;
    onDeleteApp: (id: string) => Promise<void>;
}

export function GeneralAppsPage({
    apps,
    onAddNewApp,
    onDeleteApp,
}: GeneralAppsPageProps) {
    const { user, isEditMode, setIsEditMode } = useAuth();
    const pathname = usePathname();
    const pathParts = pathname.split('/');
    const isOwnShare = pathParts[2] === user?.customUserId;

    return (
        <div className="flex-1 p-4 overflow-auto">
            <Card className="h-full bg-black/20 border-white/10 backdrop-blur-sm">
                <div className="p-6">
                    <AppboardHeader
                        title="General Apps"
                        description="Introduction to General Apps"
                    />
                    {apps.length === 0 && !isEditMode ? (
                        <div className="flex flex-col items-center justify-center space-y-4 py-10">
                            <p className="text-white/70">
                                No General Apps Registered yet
                            </p>
                            {user && isOwnShare && (
                                <button
                                    onClick={() => setIsEditMode(true)}
                                    className="px-4 py-2 bg-black/40 rounded-lg border border-white/10 
                                             text-white/90 hover:border-white/30 hover:bg-black/50 
                                             transition-all duration-200"
                                >
                                    Enter Edit Mode
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {apps.map((app) => (
                                <AppIconCard
                                    key={app.id}
                                    app={app}
                                    onClick={() => {}}
                                    onDeleteApp={onDeleteApp}
                                    onAddNewApp={onAddNewApp}
                                />
                            ))}
                            {user && isEditMode && (
                                <AppIconCard
                                    isAddNewAppCard
                                    onClick={() => {}}
                                    onDeleteApp={() => {}}
                                    onAddNewApp={onAddNewApp}
                                />
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}

export default GeneralAppsPage;
