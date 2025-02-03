'use client';

import React, { useCallback, useMemo } from 'react';

import { useAppContext } from '../../contexts/AppContext';
import type { ITool } from '../../types/app';
import { AppCategoryType } from '../../types/category';
import AdditionalAppsPage from './AdditionalToolsPage';
import AdvancedDevAppPage from './AdvancedAppsPage';
import { DevAppsPage } from './DevAppsPage';
import { GeneralAppsPage } from './GeneralAppsPage';
import { HomePage } from './HomePage';
import RequirementAppsPage from './RequirementAppsPage';
import ZshPluginsPage from './ZshPluginsPage';

interface CategoryPageContentProps {
    category: AppCategoryType;
    isReadOnly?: boolean;
}

const CategoryPageContent = ({
    category,
    isReadOnly,
}: CategoryPageContentProps) => {
    const { apps, addApp, deleteApp } = useAppContext();

    const handleAddNewApp = useCallback(
        async (newApp: ITool) => {
            if (!isReadOnly) {
                addApp(newApp);
            }
        },
        [addApp, isReadOnly]
    );

    const handleDeleteApp = useCallback(
        async (appId: string) => {
            if (!isReadOnly) {
                deleteApp(appId);
            }
        },
        [deleteApp, isReadOnly]
    );

    const copyToClipboard = useCallback((text: string) => {
        navigator.clipboard.writeText(text).then(() => {});
    }, []);

    const categoryContent = useMemo(() => {
        const commonProps = {
            apps,
            onAddNewApp: handleAddNewApp,
            onDeleteApp: handleDeleteApp,
            isReadOnly,
        };

        switch (category) {
            case AppCategoryType.Home:
                return <HomePage />;
            case AppCategoryType.General:
                return <GeneralAppsPage {...commonProps} />;
            case AppCategoryType.Dev:
                return <DevAppsPage {...commonProps} />;
            case AppCategoryType.Advanced:
                return <AdvancedDevAppPage {...commonProps} />;
            case AppCategoryType.Requirement:
                return (
                    <RequirementAppsPage
                        {...commonProps}
                        copyToClipboard={copyToClipboard}
                    />
                );
            case AppCategoryType.ZshPlugin:
                return (
                    <ZshPluginsPage
                        {...commonProps}
                        copyToClipboard={copyToClipboard}
                    />
                );
            case AppCategoryType.Additional:
                return (
                    <AdditionalAppsPage
                        {...commonProps}
                        copyToClipboard={copyToClipboard}
                    />
                );
            default:
                return <div>Category not found.</div>;
        }
    }, [category, apps, handleAddNewApp, copyToClipboard]);

    return categoryContent;
};

export default React.memo(CategoryPageContent);
