import React from 'react';

import { generalApps } from '../../data/general-apps';
import { Card } from '../ui/Card';
import { AppboardHeader } from './AppBoardHeader';
import { AppIconCard } from './AppIconCard';

export const AppBoard = () => {
    const handleAppClick = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="flex-1 p-4 overflow-auto">
            <AppboardHeader
                title="🎉 general Apps"
                description="이거 안 깔면 나죽어요"
            />

            <Card className="h-full bg-black/20 border-white/10 backdrop-blur-sm">
                <div className="p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {generalApps.map((app) => (
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
};
