export interface RequirementTool {
    id: string;
    name: string;
    icon?: string;
    description?: string;
    installCommand: string;
    tooltip?: string;
    selected?: boolean;
}
