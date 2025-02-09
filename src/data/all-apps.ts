import { devApps } from '@/data/dev-apps';
import { generalApps } from '@/data/general-apps';

import { AppCategoryType } from '../types/category';
import { additionalTools } from './additional-tools';
import { requirementTools } from './requirement-tool';
import { zshPlugins } from './zsh-plugins';

export const allApps = [
    ...generalApps,
    ...devApps,
    ...requirementTools.map((tool) => ({
        ...tool,
        category: AppCategoryType.Requirement,
        hasSettings: true,
    })),
    ...zshPlugins.map((plugin) => ({
        ...plugin,
        category: AppCategoryType.ZshPlugin,
        hasSettings: true,
    })),
    ...additionalTools.map((tool) => ({
        ...tool,
        category: AppCategoryType.Additional,
        hasSettings: true,
    })),
];
