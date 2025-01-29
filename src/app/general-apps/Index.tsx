import React, { useState } from 'react';

import { AppboardHeader } from '../../components/templates/AppBoardHeader';
import { AppIconCard } from '../../components/templates/AppIconCard';
import {
    AddNewAppModal,
} from '../../components/templates/modal/AddNewAppModal';
import { ConfirmModal } from '../../components/templates/modal/ConfirmModal';
import { Card } from '../../components/ui/Card';
import { useAppContext } from '../../contexts/AppContext';
import { generalApps } from '../../data/general-apps';
import { fetchAppsFromFirestore } from '../../lib/firestore';
import { ITool } from '../../types/app';
import { AppCategoryType } from '../../types/category';

export function GeneralApps() {
    const { isEditMode, setIsEditMode } = useAppContext();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [apps, setApps] = useState(generalApps);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const appsList = await fetchAppsFromFirestore(); // 데이터 가져오기
        const devApps = appsList.filter(
            (app: ITool) => app.category === AppCategoryType.Dev
        ); // `dev` 카테고리 필터링
        setApps(devApps);
        setLoading(false);
    };

    useEffect(() => {
        fetchData(); // 컴포넌트가 마운트될 때 데이터 가져오기
    }, []);

    const handleAppClick = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleAddNewApp = () => {
        if (isEditMode) {
            setIsAddModalOpen(true);
        } else {
            setIsConfirmModalOpen(true);
        }
    };

    const handleConfirmEditMode = () => {
        setIsEditMode(true);
        setIsConfirmModalOpen(false);
    };

    const handleSubmitNewApp = (newApp: ITool) => {
        setApps((prevApps) => [...prevApps, newApp]);
    };

    const filteredApps = apps.filter(
        (app) => app.category === AppCategoryType.General
    );
    return (
        <div className="flex-1 p-4 overflow-auto">
            <Card className="h-full bg-black/20 border-white/10 backdrop-blur-sm">
                <div className="p-6">
                    <AppboardHeader
                        title="General Apps"
                        description="🎉 일단 이거부터"
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {filteredApps.map((app) => (
                            <AppIconCard
                                key={app.id}
                                app={app}
                                onClick={() =>
                                    handleAppClick(app.downloadUrl ?? '')
                                }
                            />
                        ))}
                        <AppIconCard
                            isAddNewAppCard
                            onClick={handleAddNewApp}
                        />
                    </div>
                </div>
            </Card>

            <AddNewAppModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleSubmitNewApp}
                currentCategory={AppCategoryType.General}
            />
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmEditMode}
                title="🔄 Switch to Edit Mode"
                message={`You can only add new apps in Edit mode.\nWould you like to switch to Edit mode?`}
            />
        </div>
    );
}
