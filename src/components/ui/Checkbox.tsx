import type React from 'react';
import { forwardRef } from 'react';

import { cn } from '../../lib/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, ...props }, ref) => {
        return (
            <div className="relative inline-flex items-center">
                <input
                    type="checkbox"
                    className={cn(
                        'peer appearance-none w-4 h-4 border border-gray-300 rounded bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ease-in-out',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                <svg
                    className="absolute w-4 h-4 text-white fill-current pointer-events-none hidden peer-checked:block"
                    viewBox="0 0 20 20"
                >
                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                </svg>
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
