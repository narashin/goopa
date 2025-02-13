import { AppCategoryType } from './category';

export interface Item {
    id: string;
    name: string;
    icon?: string | null;
    tooltip?: string | null;
    url?: string | null;
    category: AppCategoryType;
    userId: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ITool extends Item {
    installCommand?: string | null;
    zshrcCommand?: string | null;
    description?: string | null;
    hasScript?: boolean | null;
    hasSettings?: boolean | null;
    settings?: string | null;
    starCount: number;
}
