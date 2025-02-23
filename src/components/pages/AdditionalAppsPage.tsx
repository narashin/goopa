'use client';

import React, { useCallback, useState } from 'react';

import { usePathname } from 'next/navigation';

import ToolIconsArea from '../../components/templates/ToolIconsArea';
import ToolScriptsArea from '../../components/templates/ToolScriptsArea';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../hooks/useAuth';
import { AppCategoryType } from '../../types/category';
import { ITool } from '../../types/item';

interface AdditionalAppsPageProps {
    apps: ITool[];
    onAddNewApp: (newApp: Omit<ITool, 'id'>) => Promise<void>;
    onDeleteApp: (id: string) => Promise<void>;
}

const AdditionalAppsPage: React.FC<AdditionalAppsPageProps> = ({
    apps,
    onAddNewApp,
    onDeleteApp,
}) => {
    const { user, isEditMode, setIsEditMode } = useAuth();
    const [selectedItems, setSelectedItems] = useState<ITool[]>([]);
    const pathname = usePathname();
    const pathParts = pathname.split('/');
    const isOwnShare = pathParts[2] === user?.customUserId;

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
                {apps.length === 0 && !isEditMode ? (
                    <div className="flex flex-col items-center justify-center space-y-4 py-10 col-span-2">
                        <p className="text-white/70">
                            No Additional Apps Registered yet
                        </p>
                        {user && isOwnShare && (
                            <button
                                onClick={() => setIsEditMode(true)}
                                className="px-4 py-2 bg-black/40 rounded-lg border border-white/10 
                                     text-white/90 hover:border-white/30 hover:bg-black/50 
                                     transition-all duration-200"
                            >
                                Enter Edit Mode
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <ToolIconsArea
                            apps={apps}
                            onAddNewApp={onAddNewApp}
                            onDeleteApp={onDeleteApp}
                            isItemSelected={isItemSelected}
                            toggleItem={toggleItem}
                            currentCategory={AppCategoryType.Additional}
                        />

                        <ToolScriptsArea
                            appCount={apps.length}
                            selectedItems={selectedItems}
                        />
                    </>
                )}
            </div>
        </Card>
    );
};

export default React.memo(AdditionalAppsPage);
