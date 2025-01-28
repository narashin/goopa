import { SubCategoryType } from './category';

export interface IAdvancedDevApp {
    id: string;
    name: string;
    icon?: string;
    description?: string;
    tooltip?: string;
    category: SubCategoryType;
}
