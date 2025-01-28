import { ITool } from '../types/app';
import { AppCategoryType } from '../types/category';

export const devApps: ITool[] = [
    {
        id: 'vscode',
        category: AppCategoryType.Dev,
        name: 'Visual Studio Code',
        icon: '/icons/vscode_icon.png',
        downloadUrl: 'https://code.visualstudio.com/',
    },
    {
        id: 'iterm2',
        name: 'iTerm2',
        category: AppCategoryType.Dev,
        icon: '/icons/iterm2_icon.png',
        downloadUrl: 'https://iterm2.com/',
    },
    {
        id: 'wezterm',
        name: 'WezTerm',
        category: AppCategoryType.Dev,
        icon: '/icons/wezterm_icon.svg',
        downloadUrl: 'https://wezfurlong.org/wezterm/',
    },
    {
        id: 'insomnia',
        name: 'Insomnia',
        category: AppCategoryType.Dev,
        icon: '/icons/insomnia_icon.png',
        downloadUrl: 'https://insomnia.rest/download',
    },
    {
        id: 'tower',
        name: 'Tower',
        category: AppCategoryType.Dev,
        icon: '/icons/tower_icon.png',
        downloadUrl: 'https://www.git-tower.com/mac',
    },
    {
        id: 'orbstack',
        name: 'OrbStack',
        category: AppCategoryType.Dev,
        icon: '/icons/orbstack_icon.png',
        downloadUrl: 'https://orbstack.dev/download',
    },
];
