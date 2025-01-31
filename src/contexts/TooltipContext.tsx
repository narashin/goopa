import type React from 'react';
import { createContext, type ReactNode, useContext, useState } from 'react';

interface TooltipContextType {
    isAnyTooltipOpen: boolean;
    isModalOpen: boolean;
    openTooltip: () => void;
    closeAllTooltips: () => void;
    setModalOpen: (isOpen: boolean) => void;
}

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

export const TooltipProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [isAnyTooltipOpen, setIsAnyTooltipOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openTooltip = () => {
        if (!isModalOpen) {
            setIsAnyTooltipOpen(true);
        }
    };

    const closeAllTooltips = () => setIsAnyTooltipOpen(false);

    const setModalOpen = (isOpen: boolean) => {
        setIsModalOpen(isOpen);
        if (isOpen) {
            closeAllTooltips();
        }
    };

    return (
        <TooltipContext.Provider
            value={{
                isAnyTooltipOpen,
                isModalOpen,
                openTooltip,
                closeAllTooltips,
                setModalOpen,
            }}
        >
            {children}
        </TooltipContext.Provider>
    );
};

export const useTooltip = () => {
    const context = useContext(TooltipContext);
    if (context === undefined) {
        throw new Error('useTooltip must be used within a TooltipProvider');
    }
    return context;
};
