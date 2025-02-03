'use client';

import type React from 'react';
import { createContext, useCallback, useContext } from 'react';

interface CopyToClipboardContextType {
    copyToClipboard: (text: string) => void;
}

const CopyToClipboardContext = createContext<
    CopyToClipboardContextType | undefined
>(undefined);

interface CopyToClipboardProviderProps {
    children: React.ReactNode;
}

export const CopyToClipboardProvider: React.FC<
    CopyToClipboardProviderProps
> = ({ children }) => {
    const copyToClipboard = useCallback((text: string) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                // TODO: Show a toast message
            })
            .catch((err) => {
                console.error('Failed to copy text: ', err);
            });
    }, []);

    return (
        <CopyToClipboardContext.Provider value={{ copyToClipboard }}>
            {children}
        </CopyToClipboardContext.Provider>
    );
};

export const useCopyToClipboard = () => {
    const context = useContext(CopyToClipboardContext);
    if (context === undefined) {
        throw new Error(
            'useCopyToClipboard must be used within a CopyToClipboardProvider'
        );
    }
    return context.copyToClipboard;
};

export default CopyToClipboardProvider;

export { CopyToClipboardContext };
