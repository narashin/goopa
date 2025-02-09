import type React from 'react';
import { useEffect, useState } from 'react';

import { Popover, Transition } from '@headlessui/react';

import { useTooltipStore } from '../../stores/tooltipStore';

interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAnyTooltipOpen, openTooltip, closeAllTooltips } =
        useTooltipStore();

    useEffect(() => {
        if (!isAnyTooltipOpen) {
            setIsOpen(false);
        }
    }, [isAnyTooltipOpen]);

    const handleMouseEnter = () => {
        setIsOpen(true);
        openTooltip();
    };

    const handleMouseLeave = () => {
        setIsOpen(false);
        closeAllTooltips();
    };

    const isContentEmpty = (content: React.ReactNode): boolean => {
        return content === null || content === undefined || content === '';
    };

    if (isContentEmpty(content)) {
        return <>{children}</>;
    }

    const truncateContent = (text: string, maxLength = 200): string => {
        return text.length > maxLength
            ? text.slice(0, maxLength) + '...'
            : text;
    };

    return (
        <Popover className="relative inline-block">
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Popover.Button as="div" className="outline-none">
                    {children}
                </Popover.Button>

                <Transition
                    show={isOpen}
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                >
                    <Popover.Panel
                        static
                        className="absolute z-20 w-max max-w-[300px] mt-2 transform -translate-x-1/2 left-1/2"
                    >
                        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                            <div className="p-4 bg-white dark:bg-gray-800">
                                {typeof content === 'string' ? (
                                    <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                                        {truncateContent(content)}
                                    </p>
                                ) : (
                                    content
                                )}
                            </div>
                        </div>
                    </Popover.Panel>
                </Transition>
            </div>
        </Popover>
    );
};
