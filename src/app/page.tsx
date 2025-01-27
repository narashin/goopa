'use client';

import React, { useState } from 'react';

import { LaptopFrame } from '../components/layout/LaptopFrame';
import { TopNav } from '../components/layout/TopNav';
import { MenuType } from '../types/menu';
import { AdvancedDev } from './advanced-dev-apps/Page';
import { BasicApps } from './basic-apps/Page';
import { DevSetup } from './dev-apps/Page';
import { Home } from './home/Page';

export default function SetupWizard() {
    const [currentView, setCurrentView] = useState<MenuType>('home');

    const handleNavigation = (view: MenuType) => {
        setCurrentView(view);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
            <LaptopFrame>
                <div className="h-full flex flex-col bg-[#1a1b26]">
                    <TopNav
                        onNavigate={handleNavigation}
                        currentView={currentView}
                    />
                    {currentView === 'home' && <Home />}
                    {currentView === 'basic apps' && <BasicApps />}
                    {currentView === 'dev apps' && <DevSetup />}
                    {currentView === 'advanced-dev' && <AdvancedDev />}
                </div>
            </LaptopFrame>
        </div>
    );
}
