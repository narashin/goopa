import React from 'react';

import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchInputProps {
    value: string;
    onChange: (query: string) => void;
    onClear: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChange,
    onClear,
}) => (
    <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-white/50" />
        <input
            className="pl-9 pr-8 bg-black/50 border border-white/20 rounded-md h-8 w-36 text-sm text-white/90 placeholder:text-white/30"
            placeholder="Search..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
        {value && (
            <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/70"
                onClick={onClear}
            >
                <XMarkIcon className="h-4 w-4" />
            </button>
        )}
    </div>
);
