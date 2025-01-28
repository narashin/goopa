export type MenuType =
    | 'home'
    | 'general'
    | 'dev'
    | 'advanced'
    | 'requirement'
    | 'additional'
    | 'search'
    | 'zsh-plugin';

export const Menu: MenuType[] = [
    'home',
    'general',
    'dev',
    'advanced',
    'requirement',
    'additional',
    'search',
    'zsh-plugin',
];

export type View = 'home' | 'general' | 'dev' | 'advanced' | 'search';
