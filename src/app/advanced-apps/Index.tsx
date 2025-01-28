import React, { useEffect, useState } from 'react';

import { ClipboardIcon } from '@heroicons/react/24/outline';

import { Card } from '../../components/ui/Card';
import { IconDisplay } from '../../components/ui/IconDisplay';
import { additionalTools } from '../../data/additional-tools';
import { requirementTools } from '../../data/requirement-tool';
import { zshPlugins } from '../../data/zsh-plugins';
import { AdditionalTool } from '../../types/additional-tool';
import { RequirementTool } from '../../types/requirement-tool';
import { ZshPlugin } from '../../types/zsh-plugin';

interface AdvancedDevProps {
    initialCategory?: string | null;
}

const categoryColors = {
    requirement: 'bg-purple-500',
    'zsh-plugin': 'bg-orange-400',
    additional: 'bg-green-400',
} as const;

const categoryOrder = ['requirement', 'zsh-plugin', 'additional'] as const;

type Category = (typeof categoryOrder)[number];

export function AdvancedDev({ initialCategory }: AdvancedDevProps) {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null
    );
    const [selectedTools, setSelectedTools] = useState<RequirementTool[]>([]);
    const [selectedZshPlugins, setSelectedZshPlugins] = useState<ZshPlugin[]>(
        []
    );
    const [selectedAdditionalTools, setSelectedAdditionalTools] = useState<
        AdditionalTool[]
    >([]);

    const handleHomebrewClick = () => {
        window.open('https://brew.sh/', '_blank', 'noopener,noreferrer');
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard');
        });
    };

    const toggleTool = (tool: RequirementTool) => {
        setSelectedTools((prev) =>
            prev.some((t) => t.id === tool.id)
                ? prev.filter((t) => t.id !== tool.id)
                : [...prev, tool]
        );
    };

    const isToolSelected = (toolId: string) => {
        return selectedTools.some((tool) => tool.id === toolId);
    };

    const toggleZshPlugin = (plugin: ZshPlugin) => {
        setSelectedZshPlugins((prev) =>
            prev.some((p) => p.id === plugin.id)
                ? prev.filter((p) => p.id !== plugin.id)
                : [...prev, plugin]
        );
    };

    const isZshPluginSelected = (pluginId: string) => {
        return selectedZshPlugins.some((plugin) => plugin.id === pluginId);
    };

    const toggleAdditionalTool = (tool: AdditionalTool) => {
        setSelectedAdditionalTools((prev) =>
            prev.some((t) => t.id === tool.id)
                ? prev.filter((t) => t.id !== tool.id)
                : [...prev, tool]
        );
    };

    const isAdditionalToolSelected = (toolId: string) => {
        return selectedAdditionalTools.some((tool) => tool.id === toolId);
    };

    const renderCategoryContent = (category: Category) => {
        let tools: (RequirementTool | ZshPlugin | AdditionalTool)[];
        let selectedItems: (RequirementTool | ZshPlugin | AdditionalTool)[];
        let isItemSelected: (id: string) => boolean;
        let toggleItem: (
            item: RequirementTool | ZshPlugin | AdditionalTool
        ) => void;

        switch (category) {
            case 'requirement':
                tools = requirementTools;
                selectedItems = selectedTools;
                isItemSelected = isToolSelected;
                toggleItem = toggleTool;
                break;
            case 'zsh-plugin':
                tools = zshPlugins;
                selectedItems = selectedZshPlugins;
                isItemSelected = isZshPluginSelected;
                toggleItem = toggleZshPlugin;
                break;
            case 'additional':
                tools = additionalTools;
                selectedItems = selectedAdditionalTools;
                isItemSelected = isAdditionalToolSelected;
                toggleItem = toggleAdditionalTool;
                break;
            default:
                return null;
        }

        return (
            <Card className="flex-1 p-4 overflow-hidden relative">
                <div className="p-6 grid grid-cols-2 gap-6 h-full">
                    {/* Left side: Tool icons */}
                    <div className="overflow-hidden flex flex-col">
                        <h3 className="text-xl font-bold text-white/90 mb-4 sticky top-0 bg-[#1a1b26] py-2">
                            {category === 'zsh-plugin'
                                ? 'Zsh Plugins'
                                : `${
                                      category.charAt(0).toUpperCase() +
                                      category.slice(1)
                                  } Tools`}
                        </h3>
                        <div className="overflow-y-auto flex-grow">
                            <div className="grid grid-cols-2 gap-4 w-full pt-2">
                                {tools.map((tool) => (
                                    <div
                                        key={tool.id}
                                        className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer
                    ${
                        isItemSelected(tool.id)
                            ? 'border-white/60 bg-white/10'
                            : 'border-white/20 hover:border-white/40'
                    }`}
                                        onClick={() => toggleItem(tool)}
                                    >
                                        <div className="flex flex-col items-center space-y-2">
                                            <IconDisplay
                                                icon={tool.icon}
                                                name={tool.name}
                                                tooltip={tool.tooltip}
                                            />
                                            <span className="text-sm font-medium text-white/90">
                                                {tool.name}
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
                                                <code>
                                                    {item.installCommand}
                                                </code>
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
                                            {category === 'zsh-plugin' &&
                                                'zshrcCommand' in item && (
                                                    <div className="mt-2 bg-black rounded p-3 font-mono text-sm text-white/90 overflow-x-auto relative">
                                                        <code>
                                                            {item.zshrcCommand}
                                                        </code>
                                                        <button
                                                            onClick={() =>
                                                                copyToClipboard(
                                                                    item.zshrcCommand
                                                                        ? item.zshrcCommand
                                                                        : ''
                                                                )
                                                            }
                                                            className="absolute top-2 right-2 text-white/60 hover:text-white/90"
                                                        >
                                                            <ClipboardIcon className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                )}
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

    useEffect(() => {
        if (
            initialCategory &&
            categoryOrder.includes(initialCategory as Category)
        ) {
            setSelectedCategory(initialCategory as Category);
        }
    }, [initialCategory]);

    return (
        <div className="flex-1 p-4 overflow-hidden relative">
            <div className="h-full bg-black/20 border border-white/10 rounded-lg backdrop-blur-sm overflow-hidden">
                {selectedCategory ? (
                    renderCategoryContent(selectedCategory)
                ) : (
                    <div className="p-6">
                        <div className="mb-8">
                            <div
                                className="max-w-2xl mx-auto bg-[#2d2c27] rounded-lg p-6 cursor-pointer hover:bg-[#353430] transition-colors"
                                onClick={handleHomebrewClick}
                            >
                                <div className="flex items-center justify-center mb-4">
                                    <IconDisplay
                                        icon="/icons/homebrew_icon.png"
                                        name="Homebrew"
                                        tooltip="The Missing Package Manager for macOS"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-[#f5b700] text-center mb-2">
                                    Homebrew
                                </h3>
                                <p className="text-white/80 text-center mb-4">
                                    The Missing Package Manager for macOS
                                </p>
                                <div className="bg-black/50 rounded p-3 font-mono text-sm text-white/90 overflow-x-auto">
                                    <code>
                                        /bin/bash -c \&quot;$(curl -fsSL
                                        https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)&quot;\
                                    </code>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="fixed right-[18%] top-1/2 -translate-y-1/2 space-y-2 z-50">
                {categoryOrder.map((category) => (
                    <div
                        key={category}
                        className="relative w-24 h-10 flex items-center transform hover:-translate-x-2 transition-transform duration-200 overflow-hidden cursor-pointer"
                        onClick={() =>
                            setSelectedCategory(
                                category === selectedCategory ? null : category
                            )
                        }
                    >
                        <div className="absolute inset-0 bg-white rounded-r-md" />
                        <span className="relative z-10 text-gray-800 text-xs font-medium capitalize pl-2">
                            {category}
                        </span>
                        <div
                            className={`absolute right-0 top-0 w-7 h-full ${
                                categoryColors[category]
                            } rounded-r-md ${
                                category === selectedCategory
                                    ? 'opacity-100'
                                    : 'opacity-50'
                            }`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
