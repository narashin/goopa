import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const generateShareUrl = (publishUrl: string, category: string) => {
    if (!publishUrl) return '';
    return `${publishUrl}${category === 'home' ? '' : `/${category}`}`;
};
