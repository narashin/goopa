import { create } from 'zustand';

interface TooltipState {
    isAnyTooltipOpen: boolean;
    isModalOpen: boolean;
    openTooltip: () => void;
    closeAllTooltips: () => void;
    setModalOpen: (isOpen: boolean) => void;
}

export const useTooltipStore = create<TooltipState>((set, get) => ({
    isAnyTooltipOpen: false,
    isModalOpen: false,
    openTooltip: () =>
        set((state) => {
            if (!state.isModalOpen) {
                return { isAnyTooltipOpen: true };
            }
            return {};
        }),
    closeAllTooltips: () => set({ isAnyTooltipOpen: false }),
    setModalOpen: (isOpen) =>
        set({
            isModalOpen: isOpen,
            isAnyTooltipOpen: isOpen ? false : get().isAnyTooltipOpen,
        }),
}));
