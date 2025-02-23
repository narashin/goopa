import { type ClassValue, clsx } from 'clsx';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';

import { ITool } from '../types/item';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const generateShareUrl = (shareUrl: string, category: string) => {
    if (!shareUrl) return '';
    return `${shareUrl}${category === 'home' ? '' : `/${category}`}`;
};

export const copyToClipboard = (
    text: string,
    message = '🎉 Copied to clipboard!'
) => {
    navigator.clipboard
        .writeText(text)
        .then(() => {
            toast.success(message, {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        })
        .catch((err) => {
            console.error('Failed to copy text: ', err);
            toast.error('Failed to copy to clipboard', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        });
};

export const removeUndefinedFields = (obj: Partial<ITool>): Partial<ITool> => {
    return Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(obj).filter(([_, value]) => value !== undefined)
    ) as Partial<ITool>;
};
