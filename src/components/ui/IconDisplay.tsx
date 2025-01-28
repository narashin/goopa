import type React from 'react';

import Image from 'next/image';

import { Tooltip } from './Tooltip';

interface IconDisplayProps {
    icon?: string;
    name: string;
    tooltip?: string;
}

export const IconDisplay: React.FC<IconDisplayProps> = ({
    icon,
    name,
    tooltip,
}) => {
    const IconComponent = () => {
        if (icon) {
            return (
                <div className="relative w-16 h-16 bg-black/40 rounded-xl overflow-hidden">
                    <Image
                        src={icon || ''}
                        alt={name}
                        layout="fill"
                        objectFit="cover"
                        className="p-2"
                    />
                </div>
            );
        }

        const displayName = name.length > 10 ? name.slice(0, 10) + '...' : name;
        return (
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                <span className="text-black text-xs font-semibold text-center px-1">
                    {displayName}
                </span>
            </div>
        );
    };

    if (tooltip) {
        return (
            <Tooltip content={tooltip}>
                <div>
                    <IconComponent />
                </div>
            </Tooltip>
        );
    }

    return <IconComponent />;
};
