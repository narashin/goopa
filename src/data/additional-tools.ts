import type { IAdditionalTool } from '../types/additional-tool';

export const additionalTools: IAdditionalTool[] = [
    {
        id: 'fzf',
        name: 'fzf',
        description: 'A command-line fuzzy finder',
        installCommand: 'brew install fzf',
    },
    {
        id: 'htop',
        name: 'htop',
        description: 'An interactive process viewer for Unix',
        installCommand: 'brew install htop',
    },
    {
        id: 'tldr',
        name: 'tldr',
        description: 'Simplified and community-driven man pages',
        installCommand: 'brew install tldr',
    },
    {
        id: 'jq',
        name: 'jq',
        description: 'Lightweight command-line JSON processor',
        installCommand: 'brew install jq',
    },
    {
        id: 'neovim',
        name: 'Neovim',
        description: 'Hyperextensible Vim-based text editor',
        installCommand: 'brew install neovim',
    },
    {
        id: 'tree',
        name: 'Tree',
        description:
            'Display directories as trees (with optional color/HTML output)',
        installCommand: 'brew install tree',
    },
];
