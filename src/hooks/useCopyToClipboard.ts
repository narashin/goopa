'use client';

import { useCallback } from 'react';

import { copyToClipboard } from '../lib/utils';

export const useCopyToClipboard = () => {
    return useCallback((text: string, message?: string) => {
        copyToClipboard(text, message);
    }, []);
};
