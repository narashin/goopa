import React from 'react';

import AdditionalToolsPage
    from '../../../../../../components/pages/AdditionalToolsPage';
import AdvancedAppsPage
    from '../../../../../../components/pages/AdvancedAppsPage';
import DevAppsPage from '../../../../../../components/pages/DevAppsPage';
import {
    GeneralAppsPage,
} from '../../../../../../components/pages/GeneralAppsPage';
import { HomePage } from '../../../../../../components/pages/HomePage';
import RequirementAppsPage
    from '../../../../../../components/pages/RequirementAppsPage';
import ZshPluginsPage from '../../../../../../components/pages/ZshPluginsPage';
import { getUser } from '../../../../../../lib/auth';
import {
    getAppsFromFirestore, getUserPublishStatus,
} from '../../../../../../lib/firestore';
import { AppCategoryType } from '../../../../../../types/category';

interface SharedPageProps {
    params: {
        userId: string;
        publishId: string;
        category: string;
    };
}

export default async function SharedPage({ params }: SharedPageProps) {
    const { userId, publishId, category } = params;

    const publishStatus = await getUserPublishStatus(userId);

    if (
        !publishStatus.isPublished ||
        !publishStatus.publishHistory.some(
            (history) => history.publishId === publishId
        )
    ) {
        return <div>THIS URL IS NO LONGER VALID.</div>;
    }

    const user = await getUser(userId);
    const allApps = await getAppsFromFirestore(userId);

    const filteredApps = allApps.filter((app) => {
        switch (category) {
            case 'home':
                return app.category === AppCategoryType.Home;
            case 'general':
                return app.category === AppCategoryType.General;
            case 'dev':
                return app.category === AppCategoryType.Dev;
            case 'advanced':
                return app.category === AppCategoryType.Advanced;
            case 'requirement':
                return app.category === AppCategoryType.Requirement;
            case 'additional':
                return app.category === AppCategoryType.Additional;

            case 'zsh-plugin':
                return app.category === AppCategoryType.ZshPlugin;

            default:
                return false;
        }
    });

    const renderApps = () => {
        switch (category) {
            case 'home':
                return <HomePage />;
            case 'general':
                return (
                    <GeneralAppsPage apps={filteredApps} isReadOnly={true} />
                );
            case 'dev':
                return <DevAppsPage apps={filteredApps} isReadOnly={true} />;
            case 'advanced':
                return <AdvancedAppsPage apps={filteredApps} />;
            case 'requirement':
                return (
                    <RequirementAppsPage
                        apps={filteredApps}
                        isReadOnly={true}
                    />
                );
            case 'zsh-plugin':
                return <ZshPluginsPage apps={filteredApps} isReadOnly={true} />;
            case 'additional':
                return (
                    <AdditionalToolsPage
                        apps={filteredApps}
                        isReadOnly={true}
                    />
                );
            default:
                return <div>INVALID CATEGORY.</div>;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
            <h1 className="text-2xl font-bold text-white mb-6">
                {user.name}의 {category} 앱
            </h1>
            {renderApps()}
        </div>
    );
}
