'use client';

import React, { useCallback, useState } from 'react';

import ToolIconsArea from '../../components/templates/ToolIconsArea';
import ToolScriptsArea from '../../components/templates/ToolScriptsArea';
import { Card } from '../../components/ui/Card';
import type { ITool } from '../../types/app';
import { AppCategoryType } from '../../types/category';

interface AdditionalAppsPageProps {
    apps: ITool[];
    onAddNewApp: (newApp: ITool) => void;
    copyToClipboard: (text: string) => void;
}

const AdditionalAppsPage: React.FC<AdditionalAppsPageProps> = ({
    apps,
    onAddNewApp,
    copyToClipboard,
}) => {
    const [selectedItems, setSelectedItems] = useState<ITool[]>([]);

    const toggleItem = useCallback((item: ITool) => {
        setSelectedItems((prev) =>
            prev.some((i) => i.id === item.id)
                ? prev.filter((i) => i.id !== item.id)
                : [...prev, item]
        );
    }, []);

    const isItemSelected = useCallback(
        (id: string) => selectedItems.some((item) => item.id === id),
        [selectedItems]
    );

    const filteredApps = apps.filter(
        (app) => app.category === AppCategoryType.Additional
    );

    return (
        <Card className="flex-1 p-4 overflow-hidden relative">
            <div className="px-4 grid grid-cols-2 gap-6 h-full border-0">
                <ToolIconsArea
                    apps={filteredApps}
                    onAddNewApp={onAddNewApp}
                    isItemSelected={isItemSelected}
                    toggleItem={toggleItem}
                    currentCategory={AppCategoryType.Additional}
                />

                <ToolScriptsArea
                    selectedItems={selectedItems}
                    copyToClipboard={copyToClipboard}
                />
            </div>
        </Card>
    );
};

export default React.memo(AdditionalAppsPage);
