import type React from 'react';

import Image from 'next/image';

interface IconDisplayProps {
    icon?: string;
    name: string;
}

export const IconDisplay: React.FC<IconDisplayProps> = ({ icon, name }) => {
    const commonClasses =
        'w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden transition-transform duration-200 hover:scale-105 cursor-pointer';

    if (icon) {
        return (
            <div className={`${commonClasses} relative`}>
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
        <div className={`${commonClasses} bg-white`}>
            <span className="text-black text-xs font-semibold text-center px-1">
                {displayName}
            </span>
        </div>
    );
};
