import { type ClassValue, clsx } from 'clsx';
import { nanoid } from 'nanoid';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const generateShareUrl = (userId: string, category: string) => {
    const publishedId = nanoid(10);
    return `/share/${userId}/${publishedId}/${category}`;
};
