import type { RequirementTool } from '../types/requirement-tool';

export const requirementTools: RequirementTool[] = [
    {
        id: 'git',
        name: 'Git',
        icon: '/icons/git_icon.png',
        description: 'Distributed version control system',
        installCommand: 'brew install git',
    },
    {
        id: 'oh-my-zsh',
        name: 'Oh My Zsh',
        icon: '/icons/oh-my-zsh_icon.png',
        description: 'Framework for managing Zsh configuration',
        installCommand:
            'sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"',
    },
];
