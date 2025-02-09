import { AppCategoryType } from '../types/category';

export const additionalTools = [
    {
        id: 'fzf',
        name: 'fzf',
        description: 'A command-line fuzzy finder',
        installCommand: 'brew install fzf',
        category: AppCategoryType.Additional,
    },
    {
        id: 'htop',
        name: 'htop',
        description: 'An interactive process viewer for Unix',
        installCommand: 'brew install htop',
        category: AppCategoryType.Additional,
    },
    {
        id: 'tldr',
        name: 'tldr',
        description: 'Simplified and community-driven man pages',
        installCommand: 'brew install tldr',
        category: AppCategoryType.Additional,
    },
    {
        id: 'jq',
        name: 'jq',
        description: 'Lightweight command-line JSON processor',
        installCommand: 'brew install jq',
        category: AppCategoryType.Additional,
    },
    {
        id: 'neovim',
        name: 'Neovim',
        description: 'Hyperextensible Vim-based text editor',
        installCommand: 'brew install neovim',
        category: AppCategoryType.Additional,
    },
    {
        id: 'tree',
        name: 'Tree',
        description:
            'Display directories as trees (with optional color/HTML output)',
        installCommand: 'brew install tree',
        category: AppCategoryType.Additional,
    },
];
