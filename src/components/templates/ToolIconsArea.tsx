import React from 'react';

import { ITool } from '../../types/app';
import { AppIconCard } from './AppIconCard';

interface ToolIconsProps {
    tools: ITool[];
    isItemSelected: (id: string) => boolean;
    toggleItem: (item: ITool) => void;
}

const ToolIconsArea: React.FC<ToolIconsProps> = ({
    tools,
    isItemSelected,
    toggleItem,
}) => {
    return (
        <div className="overflow-hidden flex flex-col">
            <h2 className="text-xl font-bold text-white/90 mb-4 sticky top-0 bg-[#1a1b26] py-2">
                🛠️ Tools
            </h2>
            <div className="overflow-y-auto flex-grow">
                <div className="grid grid-cols-2 gap-4 w-full pt-2">
                    {tools.map((tool) => (
                        <div
                            key={tool.id}
                            className={`relative transition-all cursor-pointer ${
                                isItemSelected(tool.id)
                                    ? 'border-white/60 bg-white/10'
                                    : 'border-white/20 hover:border-white/40'
                            }`}
                        >
                            <AppIconCard
                                key={tool.id}
                                app={{
                                    id: tool.id,
                                    icon: tool.icon,
                                    name: tool.name,
                                    description: tool.description || '',
                                    hasSettings: tool.hasSettings,
                                    downloadUrl: tool.downloadUrl,
                                    category: tool.category,
                                }}
                                onClick={() => toggleItem(tool)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ToolIconsArea;
