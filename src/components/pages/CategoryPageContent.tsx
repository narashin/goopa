'use client';

import React, { useCallback, useMemo } from 'react';

import { useAppContext } from '../../contexts/AppContext';
import { addAppToFirestore } from '../../lib/firestore';
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
}

const CategoryPageContent = ({ category }: CategoryPageContentProps) => {
    const { user, apps, addApp } = useAppContext();

    const handleAddNewApp = useCallback(
        async (newApp: ITool) => {
            if (user) await addAppToFirestore(newApp, user.uid);
            addApp(newApp);
        },
        [user, addApp]
    );

    const copyToClipboard = useCallback((text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard');
        });
    }, []);

    const categoryContent = useMemo(() => {
        const commonProps = {
            apps,
            onAddNewApp: handleAddNewApp,
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
