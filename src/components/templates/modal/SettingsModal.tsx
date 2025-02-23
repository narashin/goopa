import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import { useDropzone } from 'react-dropzone';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { useItems } from '../../../hooks/useItems';
import { uploadToS3 } from '../../../lib/s3';
import { removeUndefinedFields } from '../../../lib/utils';
import { AppCategoryType } from '../../../types/category';
import { ITool } from '../../../types/item';
import { IconDisplay } from '../../ui/IconDisplay';

interface SettingsModalProps {
    readOnly: boolean;
    onClose: () => void;
    onSave: (app: ITool) => void;
    onUpdate: (app: ITool) => void;
    initialApp: ITool;
}

export function SettingsModal({
    readOnly = false,
    initialApp,
    onClose,
    onSave,
    onUpdate,
}: SettingsModalProps) {
    const [updatedApp, setUpdatedApp] = useState<ITool>(initialApp);
    const { updateItem } = useItems();
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [iconPreview, setIconPreview] = useState<string | null>(null);
    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
    const [contentHeight, setContentHeight] = useState<number>(400);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setModalRoot(document.body);
    }, []);

    useEffect(() => {
        setUpdatedApp({ ...initialApp });
    }, [initialApp]);

    useEffect(() => {
        if (contentRef.current) {
            const newHeight = Math.max(contentRef.current.scrollHeight, 200);
            setContentHeight(Math.min(newHeight, 600));
        }
    }, [contentRef]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setIconFile(file);
            setIconPreview(URL.createObjectURL(file));
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': [],
        },
        multiple: false,
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setUpdatedApp((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (readOnly) return;

        let iconUrl = updatedApp.icon;
        if (iconFile) {
            try {
                iconUrl = await uploadToS3(iconFile);
            } catch (error) {
                console.error('Image upload failed:', error);
                return;
            }
        }

        const { id, ...updateFields } = {
            ...updatedApp,
            icon: iconUrl,
        };
        const cleanFields = removeUndefinedFields(updateFields);

        await updateItem(id, cleanFields);
        onUpdate({ ...updatedApp, icon: iconUrl });
        onSave({ ...updatedApp, icon: iconUrl });
        onClose();
    };

    const modalContent = (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-xl">
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
                        {initialApp.name}{' '}
                        {readOnly ? 'Information' : 'Settings'}
                    </h2>
                </div>

                {/* App info area */}
                <div className="flex p-4 border-b border-gray-200">
                    <div className="w-16 h-16 mr-4">
                        {!readOnly ? (
                            <div
                                {...getRootProps()}
                                className={`w-16 h-16 border-2 border-dashed rounded-md 
                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                cursor-pointer flex items-center justify-center transition-colors duration-200
                hover:border-blue-500 hover:bg-blue-50`} // hover 효과 추가
                                onClick={(e) => {
                                    e.stopPropagation(); // 이벤트 전파 중단
                                    getRootProps().onClick?.(e); // useDropzone의 클릭 핸들러 실행
                                }}
                            >
                                <input {...getInputProps()} />
                                <div className="w-full h-full relative">
                                    {iconPreview || updatedApp.icon ? (
                                        <>
                                            <img
                                                src={
                                                    iconPreview ||
                                                    updatedApp.icon ||
                                                    '/placeholder.svg'
                                                }
                                                alt={updatedApp.name}
                                                className="w-full h-full object-contain rounded-md"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200">
                                                <svg
                                                    className="w-6 h-6 text-white opacity-0 hover:opacity-100"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L12 8m4-4v12"
                                                    />
                                                </svg>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-gray-400 text-center">
                                            <svg
                                                className="mx-auto h-6 w-6"
                                                stroke="currentColor"
                                                fill="none"
                                                viewBox="0 0 48 48"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <p className="text-xs mt-1">
                                                Click to change
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <IconDisplay
                                icon={updatedApp.icon ?? ''}
                                name={updatedApp.name}
                            />
                        )}
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
                                        name="url"
                                        value={updatedApp.url || ''}
                                        onChange={handleInputChange}
                                        placeholder="URL"
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
                                    URL: {updatedApp.url || 'N/A'}
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

                <div className="bg-gray-100 px-4 py-3 flex justify-end spae-x-2 border-t border-gray-200 rounded-b-lg">
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
