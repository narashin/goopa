import { AppCategoryType } from '../types/category';
import { RequirementToolType } from '../types/requirement-tool';

export const requirementToolsData: RequirementToolType[] = [
    {
        id: 'git',
        name: 'Git',
        icon: '/icons/git_icon.png',
        description: 'Distributed version control system',
        installCommand: 'brew install git',
        category: AppCategoryType.Requirement,
    },
    {
        id: 'oh-my-zsh',
        category: AppCategoryType.Requirement,
        name: 'Oh My Zsh',
        icon: '/icons/oh-my-zsh_icon.png',
        description: 'Framework for managing Zsh configuration',
        installCommand:
            'sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"',
    },
];
