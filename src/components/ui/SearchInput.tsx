import type React from 'react';

import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchInputProps {
    value: string;
    disabled?: boolean;
    onChange: (query: string) => void;
    onClear: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
    value,
    disabled = false,
    onChange,
    onClear,
}) => {
    return (
        <div className="relative ml-4">
            <MagnifyingGlassIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
            <input
                disabled={disabled}
                type="text"
                className="w-36 pl-8 pr-8 py-1.5 bg-white/10 border border-white/20 rounded-md text-xs text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {value && (
                <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/70"
                    onClick={onClear}
                >
                    <XMarkIcon className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};
