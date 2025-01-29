import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { ITool } from '../types/app';

interface SettingsModalProps {
    app: ITool;
    onClose: () => void;
    onSave: (settings: string) => void;
}

export function SettingsModal({ app, onClose, onSave }: SettingsModalProps) {
    const [settings, setSettings] = useState(app.settings || '');
    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setModalRoot(document.body);
    }, []);

    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const modalContent = (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
        >
            <div
                className="bg-white rounded-lg shadow-2xl w-4/5 max-w-6xl overflow-hidden"
                onClick={handleContentClick}
            >
                {/* macOS-style window header */}
                <div className="bg-gray-200 px-4 py-2 flex items-center border-b border-gray-300">
                    <div className="flex space-x-2">
                        <button
                            className="w-3 h-3 rounded-full bg-red-500"
                            onClick={onClose}
                        ></button>
                        <button className="w-3 h-3 rounded-full bg-yellow-500"></button>
                        <button className="w-3 h-3 rounded-full bg-green-500"></button>
                    </div>
                    <h2 className="text-center flex-grow text-sm font-semibold text-gray-700">
                        {app.name} 설정
                    </h2>
                </div>

                {/* Content area */}
                <div className="flex h-[calc(80vh-2rem)]">
                    <div className="w-1/2 p-4 border-r border-gray-200">
                        <h2 className="text-lg font-semibold mb-2">✍️</h2>
                        <textarea
                            className="w-full h-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={settings}
                            onChange={(e) => setSettings(e.target.value)}
                            placeholder="마크다운 형식으로 설정을 입력하세요..."
                        />
                    </div>

                    <div className="w-1/2 p-4 overflow-auto">
                        <h2 className="text-lg font-semibold mb-2">👁️</h2>
                        <div className="border p-4 rounded bg-gray-50 h-[calc(100%-2rem)] overflow-auto prose prose-sm max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {settings}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-100 px-4 py-3 flex justify-end space-x-2 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        취소
                    </button>
                    <button
                        onClick={() => onSave(settings)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );

    return modalRoot ? ReactDOM.createPortal(modalContent, modalRoot) : null;
}
