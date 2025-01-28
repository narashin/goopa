export interface AdvancedDevApp {
    id: string;
    name: string;
    icon?: string;
    description?: string;
    tooltip?: string;
    category: 'general' | 'requirement' | 'zsh-plugin' | 'additional';
}
