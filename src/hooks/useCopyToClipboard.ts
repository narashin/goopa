import { useContext } from 'react';

export const useCopyToClipboard = () => {
    const context = useContext(CopyToClipboardContext);
    if (context === undefined) {
        throw new Error(
            'useCopyToClipboard must be used within a CopyToClipboardProvider'
        );
    }
    return context.copyToClipboard;
};
