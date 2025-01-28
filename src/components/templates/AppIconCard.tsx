import React from 'react';

import { AppIcon } from '../../types/common-apps';
import { IconDisplay } from '../ui/IconDisplay';

interface AppCardProps {
    app: AppIcon;
    onClick: () => void;
}

export const AppIconCard: React.FC<AppCardProps> = ({ app, onClick }) => {
    const handleClick = () => {
        if (app.downloadUrl) {
            onClick();
        }
    };

    return (
        <div
            key={app.id}
            className="flex flex-col items-center space-y-2 cursor-pointer group"
            onClick={handleClick}
        >
            <IconDisplay
                icon={app.icon}
                name={app.name}
                tooltip={app.description}
            />

            <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors text-center">
                {app.name}
            </span>
        </div>
    );
};
