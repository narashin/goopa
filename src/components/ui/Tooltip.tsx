import type React from 'react';
import { Fragment, useState } from 'react';

import { Popover, Transition } from '@headlessui/react';

interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    return (
        <Popover className="relative">
            <div
                onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setPosition({
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height,
                    });
                    setIsOpen(true);
                }}
                onMouseLeave={() => setIsOpen(false)}
            ></div>
            <Popover.Button as={Fragment}>{children}</Popover.Button>

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
                <Popover.Panel
                    className="fixed z-[100] w-64 max-w-[16rem] mt-2"
                    style={{
                        pointerEvents: 'none',
                        position: 'fixed',
                        left: position.x,
                        top: position.y,
                        transform: 'translateX(-50%)',
                    }}
                >
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
