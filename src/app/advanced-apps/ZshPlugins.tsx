// ZshPlugins.tsx
import React from 'react';

import { ClipboardIcon } from '@heroicons/react/24/outline';

import { Card } from '../../components/ui/Card';
import { IconDisplay } from '../../components/ui/IconDisplay';
import { ZshPlugin } from '../../types/zsh-plugin';

interface ZshPluginsProps {
    tools: ZshPlugin[];
    selectedItems: ZshPlugin[];
    isItemSelected: (id: string) => boolean;
    toggleItem: (item: ZshPlugin) => void;
    category: string;
    copyToClipboard: (text: string) => void;
}

const ZshPlugins: React.FC<ZshPluginsProps> = ({
    tools,
    selectedItems,
    isItemSelected,
    toggleItem,
    copyToClipboard,
}) => {
    return (
        <Card className="flex-1 p-4 overflow-hidden relative">
            <div className="p-6 grid grid-cols-2 gap-6 h-full border-0">
                {/* Left side: Tool icons */}
                <div className="overflow-hidden flex flex-col">
                    <h3 className="text-xl font-bold text-white/90 mb-4 sticky top-0 bg-[#1a1b26] py-2">
                        Zsh Plugins
                    </h3>
                    <div className="overflow-y-auto flex-grow">
                        <div className="grid grid-cols-2 gap-4 w-full pt-2">
                            {tools.map((plugin) => (
                                <div
                                    key={plugin.id}
                                    className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer
                        ${isItemSelected(plugin.id) ? 'border-white/60 bg-white/10' : 'border-white/20 hover:border-white/40'}`}
                                    onClick={() => toggleItem(plugin)}
                                >
                                    <div className="flex flex-col items-center space-y-2">
                                        <IconDisplay
                                            icon={plugin.icon}
                                            name={plugin.name}
                                            tooltip={plugin.tooltip}
                                        />
                                        <span className="text-sm font-medium text-white/90">
                                            {plugin.name}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right side: Installation scripts */}
                <div className="border-l border-white/10 pl-6 overflow-hidden flex flex-col">
                    <h3 className="text-xl font-bold text-white/90 mb-4 sticky top-0 bg-[#1a1b26] py-2">
                        Installation Scripts
                    </h3>
                    <div className="overflow-y-auto flex-grow">
                        {selectedItems.length > 0 ? (
                            <div className="space-y-4 pr-4 pt-2">
                                {selectedItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-black/40 rounded-lg p-4 relative"
                                    >
                                        <h4 className="text-sm font-medium text-white/90 mb-2">
                                            {item.name}
                                        </h4>
                                        <div className="bg-black rounded p-3 font-mono text-sm text-white/90 overflow-x-auto relative">
                                            <code>{item.installCommand}</code>
                                            <button
                                                onClick={() =>
                                                    copyToClipboard(
                                                        item.installCommand
                                                    )
                                                }
                                                className="absolute top-2 right-2 text-white/60 hover:text-white/90"
                                            >
                                                <ClipboardIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-white/60 text-sm">
                                Select items to see installation scripts
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ZshPlugins;
