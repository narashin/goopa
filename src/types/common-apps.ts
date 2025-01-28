export interface AppIcon {
    id: string;
    name: string;
    icon?: string;
    downloadUrl?: string;
    category: 'general' | 'dev' | 'requirement' | 'zsh-plugin' | 'additional';
    description?: string;
    tooltip?: string;
    hasScript?: boolean;
    hasSettings?: boolean;
}
