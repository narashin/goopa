export interface ZshPlugin {
    id: string;
    name: string;
    icon?: string;
    tooltip?: string;
    installCommand: string;
    zshrcCommand?: string;
}
