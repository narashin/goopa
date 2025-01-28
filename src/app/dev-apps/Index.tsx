import React from 'react';

import { AppboardHeader } from '../../components/templates/AppBoardHeader';
import { AppIconCard } from '../../components/templates/AppIconCard';
import { Card } from '../../components/ui/Card';
import { devApps } from '../../data/dev-apps';

export function DevApps() {
    const handleAppClick = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="flex-1 p-4 overflow-auto">
            <Card className="h-full bg-black/20 border-white/10 backdrop-blur-sm">
                <div className="p-6">
                    <AppboardHeader
                        title="Development Apps"
                        description="👩‍💻 개발 환경을 위한 필수 앱들"
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {devApps.map((app) => (
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
