'use client';

import React, { useMemo } from 'react';

import { AppboardHeader } from '../../components/templates/AppBoardHeader';
import { AppIconCard } from '../../components/templates/AppIconCard';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../hooks/useAuth';
import { AppCategoryType } from '../../types/category';
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
    const { user, isEditMode } = useAuth();

    const filteredApps = useMemo(
        () => apps.filter((app) => app.category === AppCategoryType.General),
        [apps]
    );

    return (
        <div className="flex-1 p-4 overflow-auto">
            <Card className="h-full bg-black/20 border-white/10 backdrop-blur-sm">
                <div className="p-6">
                    <AppboardHeader
                        title="General Apps"
                        description="🎉 일단 이거부터 설치하세요!"
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {filteredApps.map((app) => (
                            <AppIconCard
                                key={app.id}
                                app={app}
                                isStarred={false}
                                onClick={() => {}}
                                onDeleteApp={onDeleteApp}
                                onAddNewApp={onAddNewApp}
                            />
                        ))}
                        {user && isEditMode && (
                            <AppIconCard
                                isAddNewAppCard
                                isStarred={false}
                                onClick={() => {}}
                                onDeleteApp={() => {}}
                                onAddNewApp={onAddNewApp}
                            />
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default GeneralAppsPage;
