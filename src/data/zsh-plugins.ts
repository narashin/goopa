import { ZshPlugin } from '@/types/zsh-plugin';

export const zshPlugins: ZshPlugin[] = [
    {
        id: 'zsh-autosuggestions',
        name: 'zsh-autosuggestions',
        tooltip:
            'It suggests commands as you type based on history and completions.',
        installCommand:
            'git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions',
        zshrcCommand: "echo 'plugins+=(zsh-autosuggestions)' >> ~/.zshrc",
    },
    {
        id: 'zsh-syntax-highlighting',
        name: 'zsh-syntax-highlighting',
        tooltip: 'This package provides syntax highlighting for the shell zsh.',
        installCommand:
            'git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting',
        zshrcCommand: "echo 'plugins+=(zsh-syntax-highlighting)' >> ~/.zshrc",
    },
    {
        id: 'zsh-completions',
        name: 'zsh-completions',
        tooltip: 'Additional completion definitions for Zsh.',
        icon: '',
        installCommand:
            'git clone https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM:-${ZSH:-~/.oh-my-zsh}/custom}/plugins/zsh-completions',
        zshrcCommand:
            "echo 'plugins+=(zsh-completions)' >> ~/.zshrc && echo 'autoload -U compinit && compinit' >> ~/.zshrc",
    },
];
