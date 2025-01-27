export interface AdvancedDevApp {
    id: string;
    name: string;
    description: string;
    category: 'general' | 'database' | 'docker' | 'etc' | 'language';
}
