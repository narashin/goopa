import React from 'react';

import Image from 'next/image';

import { Card } from '../../components/ui/Card';
import { basicApps } from '../../data/basic-apps';

export function BasicApps() {
    const handleAppClick = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="flex-1 p-4 overflow-auto">
            <Card className="h-full bg-black/20 border-white/10 backdrop-blur-sm">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-white/90 mb-6">
                        Basic Apps
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {basicApps.map((app) => (
                            <div
                                key={app.id}
                                className="flex flex-col items-center space-y-2 cursor-pointer group"
                                onClick={() => handleAppClick(app.downloadUrl)}
                            >
                                <div className="relative w-20 h-20 bg-black/40 rounded-2xl border border-white/10 overflow-hidden group-hover:border-white/30 group-hover:scale-105 transition-all duration-200">
                                    <Image
                                        src={app.icon || '/placeholder.svg'}
                                        alt={app.name}
                                        layout="fill"
                                        objectFit="cover"
                                        className="p-2"
                                    />
                                </div>
                                <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                                    {app.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
}
