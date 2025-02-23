'use client';

import React, { useMemo } from 'react';

import { notFound } from 'next/navigation';

import { AppCategoryType, SubCategoryType } from '../../types/category';
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
    subCategory: SubCategoryType | null;
    items: ITool[];
    isEditMode: boolean;
    isReadOnly: boolean;
    onAddNewApp: (newApp: Omit<ITool, 'id'>) => Promise<void>;
    onDeleteApp: (appId: string) => Promise<void>;
    copyToClipboard: (text: string) => void;
}

const CategoryPageContent = ({
    category,
    subCategory,
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
            copyToClipboard,
            isReadOnly,
            subCategory,
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
                return <RequirementAppsPage {...commonProps} />;
            case AppCategoryType.ZshPlugin:
                return <ZshPluginsPage {...commonProps} />;
            case AppCategoryType.Additional:
                return <AdditionalAppsPage {...commonProps} />;
            default:
                return notFound();
        }
    }, [
        category,
        items,
        onAddNewApp,
        onDeleteApp,
        copyToClipboard,
        isReadOnly,
        subCategory,
    ]);

    return categoryContent;
};

export default React.memo(CategoryPageContent);
