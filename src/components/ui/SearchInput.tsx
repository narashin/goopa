import type React from 'react';

import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchInputProps {
    value: string;
    onChange: (query: string) => void;
    onClear: () => void;
    onSubmit?: (e: React.FormEvent) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChange,
    onClear,
    onSubmit,
}) => (
    <form onSubmit={onSubmit} className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-white/50" />
        <input
            type="text"
            className="w-full pl-10 pr-10 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
    </form>
);
