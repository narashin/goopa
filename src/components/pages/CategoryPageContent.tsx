'use client';

import React, { useEffect, useState } from 'react';

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
    initialApps: ITool[];
}

const CategoryPageContent = ({
    category,
    initialApps,
}: CategoryPageContentProps) => {
    const { user, apps, setApps, addApp } = useAppContext();
    const [selectedItems, setSelectedItems] = useState<ITool[]>([]);

    useEffect(() => {
        if (initialApps.length > 0 && apps.length === 0) {
            setApps(initialApps);
        }
    }, [initialApps, apps, setApps]);

    const handleAddNewApp = async (newApp: ITool) => {
        if (user) await addAppToFirestore(newApp, user.uid);
        addApp(newApp);
    };

    const toggleItem = (item: ITool) => {
        setSelectedItems((prev) =>
            prev.some((i) => i.id === item.id)
                ? prev.filter((i) => i.id !== item.id)
                : [...prev, item]
        );
    };

    const isItemSelected = (id: string) =>
        selectedItems.some((item) => item.id === id);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard');
        });
    };

    const renderCategoryContent = () => {
        switch (category) {
            case 'home' as AppCategoryType:
                return <HomePage />;
            case AppCategoryType.General:
                return (
                    <GeneralAppsPage
                        apps={apps}
                        onAddNewApp={handleAddNewApp}
                    />
                );
            case AppCategoryType.Dev:
                return (
                    <DevAppsPage apps={apps} onAddNewApp={handleAddNewApp} />
                );
            case AppCategoryType.Advanced:
                return (
                    <AdvancedDevAppPage
                        apps={apps}
                        onAddNewApp={handleAddNewApp}
                    />
                );
            case AppCategoryType.Requirement:
                return (
                    <RequirementAppsPage
                        apps={apps}
                        onAddNewApp={handleAddNewApp}
                        isItemSelected={isItemSelected}
                        toggleItem={toggleItem}
                        copyToClipboard={copyToClipboard}
                    />
                );
            case AppCategoryType.ZshPlugin:
                return (
                    <ZshPluginsPage
                        apps={apps}
                        onAddNewApp={handleAddNewApp}
                        isItemSelected={isItemSelected}
                        toggleItem={toggleItem}
                        copyToClipboard={copyToClipboard}
                    />
                );
            case AppCategoryType.Additional:
                return (
                    <AdditionalAppsPage
                        apps={apps}
                        onAddNewApp={handleAddNewApp}
                        isItemSelected={isItemSelected}
                        toggleItem={toggleItem}
                        copyToClipboard={copyToClipboard}
                    />
                );
            default:
                return <div>Category not found.</div>;
        }
    };

    return renderCategoryContent();
};

export default CategoryPageContent;
