import { AppCategoryType } from './category';

export interface ITool {
    id: string;
    name: string;
    icon?: string;
    tooltip?: string;
    installCommand?: string;
    zshrcCommand?: string;
    description?: string;
    hasScript?: boolean;
    hasSettings?: boolean;
    downloadUrl?: string;
    category: AppCategoryType;
}
