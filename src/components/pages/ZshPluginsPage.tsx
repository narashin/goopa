import React from 'react';

import ToolIconsArea from '../../components/templates/ToolIconsArea';
import ToolScriptsArea from '../../components/templates/ToolScriptsArea';
import { Card } from '../../components/ui/Card';
import { ITool } from '../../types/app';
import { AppCategoryType } from '../../types/category';

interface ZshPluginsPageProps {
    apps: ITool[];
    onAddNewApp: (newApp: ITool) => void;
    toggleItem: (item: ITool) => void;
    isItemSelected: (id: string) => boolean;
    copyToClipboard: (text: string) => void;
}

const ZshPluginsPage: React.FC<ZshPluginsPageProps> = ({
    apps: tools,
    onAddNewApp,
    toggleItem,
    isItemSelected,
    copyToClipboard,
}) => {
    const filteredApps = tools.filter(
        (app) => app.category === AppCategoryType.ZshPlugin
    );

    return (
        <Card className="flex-1 p-4 overflow-hidden relative">
            <div className="px-4 grid grid-cols-2 gap-6 h-full border-0">
                <ToolIconsArea
                    apps={filteredApps}
                    onAddNewApp={onAddNewApp}
                    isItemSelected={isItemSelected}
                    toggleItem={toggleItem}
                    currentCategory={AppCategoryType.ZshPlugin}
                />

                <ToolScriptsArea
                    selectedItems={filteredApps.filter((tool) =>
                        isItemSelected(tool.id)
                    )}
                    copyToClipboard={copyToClipboard}
                />
            </div>
        </Card>
    );
};

export default ZshPluginsPage;
