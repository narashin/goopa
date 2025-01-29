import React from 'react';

import { ClipboardIcon } from '@heroicons/react/24/outline';

import { ITool } from '../../types/app';

interface ToolScriptsAreaProps {
    selectedItems: ITool[];
    copyToClipboard: (text: string) => void;
}

const ToolScriptsArea: React.FC<ToolScriptsAreaProps> = ({
    selectedItems,
    copyToClipboard,
}) => {
    return (
        <div className="border-l border-white/10 pl-6 overflow-hidden flex flex-col">
            <h2 className="text-xl font-bold text-white/90 mb-4 sticky top-0 bg-[#1a1b26] py-2">
                📜 Installation Scripts
            </h2>
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
                                    {item.installCommand && (
                                        <button
                                            onClick={() =>
                                                item.installCommand &&
                                                copyToClipboard(
                                                    item.installCommand
                                                )
                                            }
                                            className="absolute top-2 right-2 text-white/60 hover:text-white/90"
                                        >
                                            <ClipboardIcon className="h-5 w-5" />
                                        </button>
                                    )}
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
    );
};

export default ToolScriptsArea;
