import React from 'react';

import { AppIconCard } from '../../components/templates/AppIconCard';
import { Card } from '../../components/ui/Card';
import { ITool } from '../../types/app';
import { AppCategoryType } from '../../types/category';
import { MenuType } from '../../types/menu';

interface SearchResultsPageProps {
    results: ITool[];
    onNavigate: (
        view: MenuType,
        itemId?: string,
        category?: AppCategoryType
    ) => void;
}

export function SearchResultsPage({
    results,
    onNavigate,
}: SearchResultsPageProps) {
    const handleNavigation = (app: ITool) => {
        if (app.downloadUrl) {
            window.open(app.downloadUrl, '_blank', 'noopener,noreferrer');
        } else {
            onNavigate(
                app.hasScript ? AppCategoryType.Advanced : app.category,
                app.id,
                app.category
            );
        }
    };

    return (
        <div className="flex-1 p-4 overflow-auto">
            <Card className="h-full bg-black/20 border-white/10 backdrop-blur-sm">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-white/90 mb-6">
                        Search Results
                    </h2>
                    {results.length === 0 ? (
                        <p className="text-white/70">No results found</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {results.map((app) => (
                                <AppIconCard
                                    key={app.id}
                                    app={app}
                                    onClick={() => handleNavigation(app)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
