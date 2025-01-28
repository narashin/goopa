import { devApps } from '@/data/dev-apps';
import { generalApps } from '@/data/general-apps';

import { AppIcon } from '../types/common-apps';
import { additionalTools } from './additional-tools';
import { requirementTools } from './requirement-tool';
import { zshPlugins } from './zsh-plugins';

export const allApps: AppIcon[] = [
    ...generalApps,
    ...devApps,
    ...requirementTools.map((tool) => ({
        ...tool,
        category: 'requirement' as const,
        hasSettings: true,
    })),
    ...zshPlugins.map((plugin) => ({
        ...plugin,
        category: 'zsh-plugin' as const,
        hasSettings: true,
    })),
    ...additionalTools.map((tool) => ({
        ...tool,
        category: 'additional' as const,
        hasSettings: true,
    })),
];
