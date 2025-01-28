import { ITool } from '../types/app';
import { AppCategoryType } from '../types/category';

export const generalApps: ITool[] = [
    {
        id: 'chrome',
        name: 'Chrome',
        category: AppCategoryType.General,
        icon: '/icons/chrome_icon.png',
        downloadUrl: 'https://www.google.com/chrome/',
    },
    {
        id: 'arc',
        name: 'Arc',
        category: AppCategoryType.General,
        icon: '/icons/arc_icon.webp',
        downloadUrl: 'https://arc.net/',
    },
    {
        id: 'magnet',
        name: 'Magnet',
        category: AppCategoryType.General,
        icon: '/icons/magnet_icon.png',
        downloadUrl: 'https://magnet.crowdcafe.com/',
    },
    {
        id: '1password',
        name: '1Password',
        category: AppCategoryType.General,
        icon: '/icons/1password_icon.png',
        downloadUrl: 'https://1password.com/downloads/mac/',
        hasSettings: true,
    },
    {
        id: 'scroll-reverser',
        name: 'Scroll Reverser',
        category: AppCategoryType.General,
        icon: '/icons/scroll-reverser_icon.png',
        downloadUrl: 'https://pilotmoon.com/scrollreverser/',
    },
    {
        id: 'batfi',
        name: 'BatFi',
        category: AppCategoryType.General,
        icon: '/icons/batfi_icon.png',
        downloadUrl: 'https://github.com/dwarvesf/Batfi',
    },
    {
        id: 'karabiner-elements',
        name: 'Karabiner Elements',
        category: AppCategoryType.General,
        icon: '/icons/karabiner-elements_icon.png',
        downloadUrl: 'https://karabiner-elements.pqrs.org/',
    },
    {
        id: 'notion',
        name: 'Notion',
        category: AppCategoryType.General,
        icon: '/icons/notion_icon.png',
        downloadUrl: 'https://www.notion.so/desktop',
    },
    {
        id: 'obsidian',
        name: 'Obsidian',
        category: AppCategoryType.General,
        icon: '/icons/obsidian_icon.png',
        downloadUrl: 'https://obsidian.md/',
    },
    {
        id: 'alfred',
        name: 'Alfred',
        category: AppCategoryType.General,
        icon: '/icons/alfred_icon.webp',
        downloadUrl: 'https://www.alfredapp.com/',
    },
];
