// AdvancedDev.tsx
import React, { useEffect, useState } from 'react';

import { Card } from '../../components/ui/Card';
import { IconDisplay } from '../../components/ui/IconDisplay';
import { categoryColors, categoryOrder } from '../../constants/category';
import { additionalTools } from '../../data/additional-tools';
import { requirementTools } from '../../data/requirement-tool';
import { zshPlugins } from '../../data/zsh-plugins';
import { AdditionalTool } from '../../types/additional-tool';
import { CategoryType } from '../../types/advanced-category';
import { RequirementTool } from '../../types/requirement-tool';
import { ZshPlugin } from '../../types/zsh-plugin';
import AdditionalTools from './AdditionalTools';
import RequirementTools from './RequirementTools';
import ZshPlugins from './ZshPlugins';

interface AdvancedDevProps {
    initialCategory?: CategoryType;
}

const AdvancedDev = ({ initialCategory }: AdvancedDevProps) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
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

    const isToolSelected = (toolId: string) =>
        selectedTools.some((tool) => tool.id === toolId);
    const toggleZshPlugin = (plugin: ZshPlugin) => {
        setSelectedZshPlugins((prev) =>
            prev.some((p) => p.id === plugin.id)
                ? prev.filter((p) => p.id !== plugin.id)
                : [...prev, plugin]
        );
    };
    const isZshPluginSelected = (pluginId: string) =>
        selectedZshPlugins.some((plugin) => plugin.id === pluginId);
    const toggleAdditionalTool = (tool: AdditionalTool) => {
        setSelectedAdditionalTools((prev) =>
            prev.some((t) => t.id === tool.id)
                ? prev.filter((t) => t.id !== tool.id)
                : [...prev, tool]
        );
    };
    const isAdditionalToolSelected = (toolId: string) =>
        selectedAdditionalTools.some((tool) => tool.id === toolId);

    const renderCategoryContent = (category: string) => {
        switch (category) {
            case CategoryType.Requirement:
                return (
                    <RequirementTools
                        tools={requirementTools}
                        selectedItems={selectedTools}
                        isItemSelected={isToolSelected}
                        toggleItem={toggleTool}
                        category={category}
                        copyToClipboard={copyToClipboard}
                    />
                );
            case CategoryType.ZshPlugin:
                return (
                    <ZshPlugins
                        tools={zshPlugins}
                        selectedItems={selectedZshPlugins}
                        isItemSelected={isZshPluginSelected}
                        toggleItem={toggleZshPlugin}
                        category={category}
                        copyToClipboard={copyToClipboard}
                    />
                );
            case CategoryType.Additional:
                return (
                    <AdditionalTools
                        tools={additionalTools}
                        selectedItems={selectedAdditionalTools}
                        isItemSelected={isAdditionalToolSelected}
                        toggleItem={toggleAdditionalTool}
                        category={category}
                        copyToClipboard={copyToClipboard}
                    />
                );
            default:
                return null;
        }
    };

    useEffect(() => {
        if (initialCategory && categoryOrder.includes(initialCategory)) {
            setSelectedCategory(initialCategory);
        }
    }, [initialCategory]);

    return (
        <Card className="flex-1 overflow-hidden relative bg-transparent h-full border-0">
            <div className="flex-1 overflow-hidden relative h-full">
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
                                        {
                                            '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
                                        }
                                    </code>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 오른쪽 카테고리 인덱스 */}
            <div className="fixed right-[18%] top-1/2 -translate-y-1/2 space-y-2 z-50">
                {categoryOrder.map((category) => (
                    <div
                        key={category}
                        className={`relative w-24 h-10 flex items-center transform transition-transform duration-200 overflow-hidden cursor-pointer ${
                            category === selectedCategory
                                ? '-translate-x-2'
                                : 'hover:-translate-x-2'
                        }`}
                        onClick={() =>
                            setSelectedCategory(
                                category === selectedCategory ? null : category
                            )
                        }
                    >
                        <div
                            className={`absolute inset-0 rounded-r-md transition-colors ${
                                category === selectedCategory
                                    ? categoryColors[category]
                                    : 'bg-white'
                            }`}
                        />
                        <span
                            className={`relative z-10 text-gray-800 text-xs font-medium capitalize pl-2 transition-colors ${
                                category === selectedCategory
                                    ? 'text-white'
                                    : ''
                            }`}
                        >
                            {category}
                        </span>
                        <div
                            className={`absolute right-0 top-0 w-7 h-full ${categoryColors[category]} rounded-r-md ${
                                category === selectedCategory
                                    ? 'opacity-100'
                                    : 'opacity-50'
                            }`}
                        />
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default AdvancedDev;
