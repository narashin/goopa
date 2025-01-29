import React from 'react';

import Link from 'next/link';

import { Cog6ToothIcon } from '@heroicons/react/24/outline';

import { ITool } from '../../types/app';
import { IconDisplay } from '../ui/IconDisplay';

interface AppCardProps {
    app: ITool;
    onClick: (e: React.MouseEvent) => void;
}

export const AppIconCard: React.FC<AppCardProps> = ({ app, onClick }) => {
    const handleClick = (e: React.MouseEvent) => {
        if (app.downloadUrl) {
            window.open(app.downloadUrl, '_blank', 'noopener,noreferrer');
        } else {
            onClick(e);
        }
    };

    return (
        <div
            key={app.id}
            className="flex flex-col items-center space-y-2 cursor-pointer group relative"
            onClick={handleClick}
        >
            <div className="relative w-20 h-20 bg-black/40 rounded-2xl border border-white/10 overflow-hidden group-hover:border-white/30 group-hover:scale-105 transition-all duration-200">
                <div className="relative inset-0 w-full h-full flex items-center justify-center">
                    <IconDisplay
                        icon={app.icon}
                        name={app.name}
                        tooltip={app.description}
                        onClick={handleClick}
                    />
                </div>

                {app.hasSettings && (
                    <Link
                        href={`/settings/${app.id}`}
                        className="absolute top-0.5 right-0.5 p-1.5 bg-black/60 rounded-full text-white/80 hover:text-white transition-colors z-10"
                        onClick={(e) => {
                            e.stopPropagation();
                            window.open(
                                `/settings/${app.id}`,
                                '_blank',
                                'noopener,noreferrer'
                            );
                        }}
                    >
                        <Cog6ToothIcon className="w-4 h-4" />
                    </Link>
                )}
            </div>
            <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors text-center w-full px-2">
                {app.name}
            </span>
        </div>
    );
};
