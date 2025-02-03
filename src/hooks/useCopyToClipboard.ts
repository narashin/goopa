import { useContext } from 'react';

import { CopyToClipboardContext } from '../contexts/CopyToClipboardContext';

export const useCopyToClipboard = () => {
    const context = useContext(CopyToClipboardContext);
    if (context === undefined) {
        throw new Error(
            'useCopyToClipboard must be used within a CopyToClipboardProvider'
        );
    }
    return context.copyToClipboard;
};
