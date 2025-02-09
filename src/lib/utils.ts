import { type ClassValue, clsx } from 'clsx';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const generateShareUrl = (publishUrl: string, category: string) => {
    if (!publishUrl) return '';
    return `${publishUrl}${category === 'home' ? '' : `/${category}`}`;
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
