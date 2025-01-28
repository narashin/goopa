import { devApps } from '@/data/dev-apps';
import { generalApps } from '@/data/general-apps';

import { ITool } from '../types/app';
import { AppCategoryType } from '../types/category';
import { additionalTools } from './additional-tools';
import { requirementToolsData } from './requirement-tool';
import { zshPlugins } from './zsh-plugins';

export const allApps: ITool[] = [
    ...generalApps,
    ...devApps,
    ...requirementToolsData.map((tool) => ({
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
