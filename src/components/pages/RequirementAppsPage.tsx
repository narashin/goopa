'use client';

import React, { useCallback, useMemo, useState } from 'react';

import ToolIconsArea from '../../components/templates/ToolIconsArea';
import ToolScriptsArea from '../../components/templates/ToolScriptsArea';
import { Card } from '../../components/ui/Card';
import type { ITool } from '../../types/app';
import { AppCategoryType } from '../../types/category';

interface RequirementAppsPageProps {
    apps: ITool[];
    onAddNewApp?: (newApp: ITool) => void;
    onDeleteApp?: (id: string) => void;
    copyToClipboard?: (text: string) => void;
    isReadOnly?: boolean;
}

const RequirementAppsPage: React.FC<RequirementAppsPageProps> = ({
    apps,
    onAddNewApp,
    onDeleteApp,
    copyToClipboard,
    isReadOnly = false,
}) => {
    const [selectedItems, setSelectedItems] = useState<ITool[]>([]);

    const filteredApps = useMemo(
        () =>
            apps.filter((app) => app.category === AppCategoryType.Requirement),
        [apps]
    );

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

    return (
        <Card className="flex-1 p-4 overflow-hidden relative">
            <div className="px-4 grid grid-cols-2 gap-6 h-full border-0">
                <ToolIconsArea
                    apps={filteredApps}
                    onAddNewApp={onAddNewApp}
                    onDeleteApp={onDeleteApp}
                    isItemSelected={isItemSelected}
                    toggleItem={toggleItem}
                    currentCategory={AppCategoryType.Requirement}
                    isReadOnly={isReadOnly}
                />

                <ToolScriptsArea
                    appCount={filteredApps.length}
                    selectedItems={selectedItems}
                    copyToClipboard={copyToClipboard}
                />
            </div>
        </Card>
    );
};

export default React.memo(RequirementAppsPage);
