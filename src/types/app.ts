import { AppCategoryType } from './category';

export interface App {
    id: string;
    name: string;
    icon?: string;
    tooltip?: string;
    url?: string;
    category: AppCategoryType;
    userId: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ITool extends App {
    installCommand?: string;
    zshrcCommand?: string;
    description?: string;
    hasScript?: boolean;
    hasSettings?: boolean;
    settings?: string;
    starCount: number;
}
