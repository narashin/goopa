export type ModalType = 'warn' | 'info' | 'error' | 'success';

export const MODAL_ICONS: Record<ModalType, string> = {
    warn: '⚠️',
    info: 'ℹ️',
    error: '❌',
    success: '✅',
};
