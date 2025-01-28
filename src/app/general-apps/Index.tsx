import React from 'react';

import { AppboardHeader } from '../../components/templates/AppBoardHeader';
import { AppIconCard } from '../../components/templates/AppIconCard';
import { Card } from '../../components/ui/Card';
import { generalAppsData } from '../../data/general-apps';

export function GeneralApps() {
    const handleAppClick = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="flex-1 p-4 overflow-auto">
            <Card className="h-full bg-black/20 border-white/10 backdrop-blur-sm">
                <div className="p-6">
                    <AppboardHeader
                        title="General Apps"
                        description="🎉 일단 이거부터"
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {generalAppsData.map((app) => (
                            <AppIconCard
                                key={app.id}
                                app={app}
                                onClick={() =>
                                    handleAppClick(app.downloadUrl ?? '')
                                }
                            />
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
}
