'use client';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuth } from '../../hooks/useAuth';
import { useShare } from '../../hooks/useShare';
import { ConfirmModal } from '../templates/modal/ConfirmModal';

interface LogoProps {
    isEditMode?: boolean;
}

export function Logo({ isEditMode = false }: LogoProps) {
    const { user, setIsEditMode } = useAuth();
    const { shareData } = useShare(user?.uid ?? null);
    const pathname = usePathname();
    const isSharePage = pathname?.startsWith('/share/');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleEditModeClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsConfirmModalOpen(true);
    };

    const handleConfirm = () => {
        setIsEditMode(false);
        setIsConfirmModalOpen(false);
    };

    return (
        <div className="relative">
            {' '}
            {/* 새로운 wrapper div 추가 */}
            <Link href={shareData?.shareUrl || '/'} className="block">
                <div
                    className={`w-32 h-8 overflow-hidden hover:opacity-90 transition-opacity ${
                        isEditMode || (!user && isSharePage) ? 'opacity-50' : ''
                    }`}
                >
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-[250px] h-[120px] relative">
                            <Image
                                src="/images/goopa-char-outlined-logo.png"
                                alt="GOOPA Logo"
                                fill
                                className={`object-contain transition-all duration-300 ${
                                    isEditMode ? 'filter blur-[1px]' : ''
                                }`}
                                priority
                            />
                        </div>
                    </div>
                </div>
                {isEditMode && (
                    <div
                        className="absolute top-[20%] left-[20%] bg-transparent border-x-2 border-green-500 text-green-500 px-2 py-1 rounded-md text-xs font-bold cursor-pointer"
                        onClick={handleEditModeClick}
                    >
                        <span className="neon-text-outline">Edit mode</span>
                    </div>
                )}
                {isSharePage && (
                    <div className="absolute top-[20%] left-[20%] bg-transparent border-x-2 border-blue-500 text-blue-500 px-2 py-1 rounded-md text-xs font-bold">
                        <span className="neon-text-outline-blue">
                            Read Mode
                        </span>
                    </div>
                )}
            </Link>
            {createPortal(
                <ConfirmModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={handleConfirm}
                    title="Switch to View Mode"
                    message="Are you sure you want to turn off Edit Mode?"
                />,
                document.body
            )}
        </div>
    );
}
