import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import { User } from 'firebase/auth';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { updateApp } from '../../../lib/firestore';
import type { ITool } from '../../../types/app';
import { AppCategoryType } from '../../../types/category';
import { IconDisplay } from '../../ui/IconDisplay';

interface SettingsModalProps {
    app: ITool;
    readOnly?: boolean;
    onClose: () => void;
    onSave: (updatedApp: ITool) => void;
    user: User | null;
    onUpdate: (updatedApp: ITool) => void;
}

export function SettingsModal({
    readOnly = false,
    app,
    onClose,
    onSave,
    user,
    onUpdate,
}: SettingsModalProps) {
    const [updatedApp, setUpdatedApp] = useState<ITool>({ ...app });
    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
    const [contentHeight, setContentHeight] = useState<number>(400);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setModalRoot(document.body);
    }, []);

    useEffect(() => {
        setUpdatedApp({ ...app });
    }, [app]);

    useEffect(() => {
        if (contentRef.current) {
            const newHeight = Math.max(contentRef.current.scrollHeight, 200);
            setContentHeight(Math.min(newHeight, 600));
        }
    }, [contentRef]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setUpdatedApp((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (readOnly) return;

        if (!user || !user.uid) {
            console.error('User not logged in or user.uid is not available.');
            return;
        }

        try {
            await updateApp(user.uid, updatedApp);
            onUpdate(updatedApp);
            onSave(updatedApp);
            onClose();
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    const modalContent = (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-xl">
                {/* macOS-style window header */}
                <div className="bg-gray-200 px-4 py-2 flex items-center rounded-t-lg border-b border-gray-300">
                    <div className="flex space-x-2">
                        <button
                            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600"
                            onClick={onClose}
                        ></button>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <h2 className="text-center flex-grow text-sm font-semibold text-gray-700">
                        {app.name} {readOnly ? 'Information' : 'Settings'}
                    </h2>
                </div>

                {/* App info area */}
                <div className="flex p-4 border-b border-gray-200">
                    <div className="w-16 h-16 mr-4">
                        <IconDisplay
                            icon={updatedApp.icon}
                            name={updatedApp.name}
                            onClick={() => {}}
                        />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold">{updatedApp.name}</h2>
                        {!readOnly ? (
                            <>
                                <div className="flex items-center mt-2">
                                    <p className="w-24 text-sm text-gray-600">
                                        URL
                                    </p>
                                    <input
                                        type="text"
                                        name="downloadUrl"
                                        value={updatedApp.downloadUrl || ''}
                                        onChange={handleInputChange}
                                        placeholder="Download URL"
                                        className="flex-1 p-1 text-sm border rounded"
                                        readOnly={readOnly}
                                    />
                                </div>
                                <div className="flex items-center mt-2">
                                    <p className="w-24 text-sm text-gray-600">
                                        Tooltip
                                    </p>
                                    <input
                                        type="text"
                                        name="tooltip"
                                        value={updatedApp.tooltip || ''}
                                        onChange={handleInputChange}
                                        placeholder="Tooltip"
                                        className="flex-1 p-1 text-sm border rounded"
                                        readOnly={readOnly}
                                    />
                                </div>
                                {updatedApp.category !==
                                    AppCategoryType.General &&
                                    updatedApp.category !==
                                        AppCategoryType.Dev && (
                                        <div className="flex items-center mt-2">
                                            <p className="w-24 text-sm text-gray-600">
                                                Install Command
                                            </p>
                                            <input
                                                type="text"
                                                name="installCommand"
                                                value={
                                                    updatedApp.installCommand ||
                                                    ''
                                                }
                                                onChange={handleInputChange}
                                                placeholder="Install Command"
                                                className="flex-1 p-1 text-sm border rounded"
                                                readOnly={readOnly}
                                            />
                                        </div>
                                    )}
                            </>
                        ) : (
                            <>
                                <p className="text-sm text-gray-600">
                                    URL: {updatedApp.downloadUrl || 'N/A'}
                                </p>
                                {updatedApp.tooltip && (
                                    <p className="text-sm text-gray-600">
                                        Tooltip: {updatedApp.tooltip}
                                    </p>
                                )}
                                {updatedApp.installCommand && (
                                    <p className="text-sm text-gray-600">
                                        Install Command:{' '}
                                        {updatedApp.installCommand}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Content area */}
                <div className="flex" style={{ height: `${contentHeight}px` }}>
                    {!readOnly && (
                        <div className="w-1/2 p-4 border-r border-gray-200 flex flex-col">
                            <h2 className="text-base font-semibold mb-2">
                                ✍️ Markdown Editor
                            </h2>
                            <textarea
                                name="description"
                                className="flex-1 w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={updatedApp.description || ''}
                                onChange={handleInputChange}
                                placeholder="Enter description in markdown format..."
                            />
                        </div>
                    )}

                    <div
                        className={`${readOnly ? 'w-full' : 'w-1/2'} p-4 flex flex-col`}
                    >
                        <h2 className="text-base font-semibold mb-2">
                            👁️ {readOnly ? 'Description' : 'Preview'}
                        </h2>
                        <div
                            ref={contentRef}
                            className="flex-1 border p-4 rounded bg-gray-50 overflow-auto prose prose-sm max-w-none"
                        >
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {updatedApp.description || ''}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-100 px-4 py-3 flex justify-end space-x-2 border-t border-gray-200 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="px-3 py-1 text-[11px] bg-white border border-gray-300 rounded-[4px] hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors shadow-sm"
                    >
                        {readOnly ? 'Close' : 'Cancel'}
                    </button>
                    {!readOnly && (
                        <button
                            onClick={handleSave}
                            className="px-3 py-1 text-[11px] bg-[#007AFF] text-white rounded-[4px] hover:bg-[#0063CC] focus:outline-none focus:ring-1 focus:ring-blue-400 transition-colors shadow-sm"
                        >
                            Save
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    return modalRoot ? ReactDOM.createPortal(modalContent, modalRoot) : null;
}
