'use client';

import React, { useMemo } from 'react';

import { AppCategoryType } from '../../types/category';
import type { ITool } from '../../types/item';
import AdditionalAppsPage from './AdditionalAppsPage';
import AdvancedAppsPage from './AdvancedAppsPage';
import DevAppsPage from './DevAppsPage';
import GeneralAppsPage from './GeneralAppsPage';
import { HomePage } from './HomePage';
import RequirementAppsPage from './RequirementAppsPage';
import ZshPluginsPage from './ZshPluginsPage';

interface CategoryPageContentProps {
    category: AppCategoryType;
    items: ITool[];
    isEditMode: boolean;
    isReadOnly: boolean;
    onAddNewApp: (newApp: ITool) => Promise<void>;
    onDeleteApp: (appId: string) => Promise<void>;
    copyToClipboard: (text: string) => void;
}

const CategoryPageContent = ({
    category,
    items,
    isReadOnly,
    onAddNewApp,
    onDeleteApp,
    copyToClipboard,
}: CategoryPageContentProps) => {
    const categoryContent = useMemo(() => {
        const commonProps = {
            apps: items,
            onAddNewApp,
            onDeleteApp,
        };

        switch (category) {
            case AppCategoryType.Home:
                return <HomePage />;
            case AppCategoryType.General:
                return <GeneralAppsPage {...commonProps} />;
            case AppCategoryType.Dev:
                return <DevAppsPage {...commonProps} />;
            case AppCategoryType.Advanced:
                return <AdvancedAppsPage {...commonProps} />;
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
    }, [
        category,
        items,
        onAddNewApp,
        onDeleteApp,
        copyToClipboard,
        isReadOnly,
    ]);

    return categoryContent;
};

export default React.memo(CategoryPageContent);
