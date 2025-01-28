import React from 'react';

interface AppboardHeaderProps {
    title: string;
    description: string;
}

export const AppboardHeader: React.FC<AppboardHeaderProps> = ({
    title,
    description,
}) => (
    <div className="flex-col mb-6">
        <h2 className="text-lg font-bold text-white/90">{title}</h2>
        <p className="text-xs text-white/50">{description}</p>
    </div>
);
