import type React from 'react';
import { Fragment, useState } from 'react';

import { Popover, Transition } from '@headlessui/react';

interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Popover className="relative">
            {/* Tooltip trigger element */}
            <Popover.Button
                as="div" // Ensure it's a div element for proper ref forwarding
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
            >
                {children}
            </Popover.Button>

            <Transition
                show={isOpen}
                as={Fragment}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
            >
                <Popover.Panel className="absolute z-10 w-64 max-w-[16rem] mt-2 -translate-x-1/2 left-1/2">
                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="p-4 bg-white dark:bg-gray-800">
                            {typeof content === 'string' ? (
                                <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                                    {content}
                                </p>
                            ) : (
                                content
                            )}
                        </div>
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    );
};
