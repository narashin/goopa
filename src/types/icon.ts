export enum IconType {
    Warn = 'warn',
    Info = 'info',
    Error = 'error',
    Success = 'success',
    Delete = 'delete',
    Tada = 'tada',
    Sparkles = 'sparkles',
}

export const Icon: Record<IconType, string> = {
    [IconType.Warn]: '⚠️',
    [IconType.Info]: 'ℹ️',
    [IconType.Error]: '❌',
    [IconType.Success]: '✅',
    [IconType.Delete]: '🗑️',
    [IconType.Tada]: '🎉',
    [IconType.Sparkles]: '✨',
};
