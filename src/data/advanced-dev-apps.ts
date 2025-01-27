import { AdvancedDevApp } from '../types/advanced-dev-apps';

export const advancedDevApps: AdvancedDevApp[] = [
    {
        id: 'homebrew',
        name: 'Homebrew',
        description: 'The missing package manager for macOS',
        category: 'general',
    },
    {
        id: 'oh-my-zsh',
        name: 'Oh My Zsh',
        description:
            'A delightful community-driven framework for managing your Zsh configuration',
        category: 'general',
    },
    {
        id: 'mysql',
        name: 'MySQL',
        description: 'Open-source relational database management system',
        category: 'database',
    },
    {
        id: 'postgresql',
        name: 'PostgreSQL',
        description:
            "The world's most advanced open source relational database",
        category: 'database',
    },
    {
        id: 'orbstack',
        name: 'OrbStack',
        description:
            'Fast, light, and simple Docker containers & Linux machines for macOS',
        category: 'docker',
    },
    {
        id: 'neovim',
        name: 'Neovim',
        description: 'Hyperextensible Vim-based text editor',
        category: 'etc',
    },
    {
        id: 'tree',
        name: 'Tree',
        description:
            'Display directories as trees (with optional color/HTML output)',
        category: 'etc',
    },
    {
        id: 'htop',
        name: 'htop',
        description: 'Improved top (interactive process viewer)',
        category: 'etc',
    },
];
