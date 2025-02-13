'use client';

import React, { useMemo } from 'react';

import { AppboardHeader } from '../../components/templates/AppBoardHeader';
import { AppIconCard } from '../../components/templates/AppIconCard';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../hooks/useAuth';
import { AppCategoryType } from '../../types/category';
import { ITool } from '../../types/item';

interface DevAppsPageProps {
    apps: ITool[];
    onAddNewApp: (newApp: Omit<ITool, 'id'>) => Promise<void>;
    onDeleteApp: (id: string) => Promise<void>;
}

export function DevAppsPage({
    apps,
    onAddNewApp,
    onDeleteApp,
}: DevAppsPageProps) {
    const { user, isEditMode } = useAuth();

    const filteredApps = useMemo(
        () => apps.filter((app) => app.category === AppCategoryType.Dev),
        [apps]
    );

    return (
        <div className="flex-1 p-4 overflow-auto">
            <Card className="h-full bg-black/20 border-white/10 backdrop-blur-sm">
                <div className="p-6">
                    <AppboardHeader
                        title="Development Apps"
                        description="👩‍💻 개발 환경을 위한 필수 앱들"
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
                                isStarred={false}
                                isAddNewAppCard
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

export default React.memo(DevAppsPage);
