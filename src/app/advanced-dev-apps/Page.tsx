import React, { useState } from 'react';

import { Checkbox } from '../../components/ui/Checkbox';
import { advancedDevApps } from '../../data/advanced-dev-apps';
import type { AdvancedDevApp } from '../../types/advanced-dev-apps';

const categoryColors: Record<
    'general' | 'database' | 'docker' | 'etc',
    string
> = {
    general: 'bg-red-500',
    database: 'bg-orange-400',
    docker: 'bg-green-400',
    etc: 'bg-blue-500',
};

const categoryOrder = ['general', 'database', 'docker', 'etc'] as const;

export function AdvancedDev() {
    const [selectedTools, setSelectedTools] = useState<AdvancedDevApp[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<
        keyof typeof categoryColors | null
    >(null);

    const toggleTool = (tool: AdvancedDevApp) => {
        setSelectedTools((prev) =>
            prev.some((t) => t.id === tool.id)
                ? prev.filter((t) => t.id !== tool.id)
                : [...prev, tool]
        );
    };

    const filteredTools = selectedCategory
        ? advancedDevApps.filter((tool) => tool.category === selectedCategory)
        : advancedDevApps;

    return (
        <div className="flex-1 p-4 overflow-visible relative">
            <div className="h-full bg-black/20 border border-white/10 rounded-lg backdrop-blur-sm">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-white/90 mb-6">
                        Advanced Dev Tools
                    </h2>
                    <div className="space-y-4">
                        {filteredTools.map((tool) => (
                            <div
                                key={tool.id}
                                className="flex items-start space-x-3"
                            >
                                <Checkbox
                                    id={tool.id}
                                    checked={selectedTools.some(
                                        (t) => t.id === tool.id
                                    )}
                                    onChange={() => toggleTool(tool)}
                                    className="border-white/60 data-[state=checked]:bg-white data-[state=checked]:text-black"
                                />
                                <div>
                                    <label
                                        htmlFor={tool.id}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                                    >
                                        {tool.name}
                                    </label>
                                    <p className="text-sm text-white/60">
                                        {tool.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="fixed right-[18%] top-1/2 -translate-y-1/2 space-y-2 z-50">
                {categoryOrder.map((category) => (
                    <div
                        key={category}
                        className="relative w-24 h-10 flex items-center transform hover:-translate-x-2 transition-transform duration-200 overflow-hidden cursor-pointer"
                        onClick={() =>
                            setSelectedCategory(
                                category === selectedCategory
                                    ? null
                                    : (category as keyof typeof categoryColors) // 타입을 명시적으로 변환
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
