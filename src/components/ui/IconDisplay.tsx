import type React from 'react';

import Image from 'next/image';

interface IconDisplayProps {
    icon?: string;
    name: string;
    onClick?: (e: React.MouseEvent) => void;
}

export const IconDisplay: React.FC<IconDisplayProps> = ({
    icon,
    name,
    onClick,
}) => {
    const IconComponent = () => {
        if (icon) {
            return (
                <div className="relative w-16 h-16" onClick={onClick}>
                    <Image
                        src={icon || ''}
                        alt={name}
                        layout="fill"
                        objectFit="contain"
                        className="rounded-xl"
                    />
                </div>
            );
        }

        const displayName = name.length > 10 ? name.slice(0, 10) + '...' : name;
        return (
            <div
                className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden"
                onClick={onClick}
            >
                <span className="text-black text-xs font-semibold text-center px-1">
                    {displayName}
                </span>
            </div>
        );
    };

    return <IconComponent />;
};
