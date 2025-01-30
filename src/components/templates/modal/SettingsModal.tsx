import type React from 'react';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { User } from 'firebase/auth';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { updateAppDescription } from '../../../lib/firestore';
import type { ITool } from '../../../types/app';

interface SettingsModalProps {
    app: ITool;
    onClose: () => void;
    onSave: (settings: string) => void;
    user: User | null;
    onUpdate: (updatedApp: ITool) => void;
}

export function SettingsModal({
    app,
    onClose,
    onSave,
    user,
    onUpdate,
}: SettingsModalProps) {
    const [description, setDescription] = useState(app.description || '');
    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setModalRoot(document.body);
    }, []);

    useEffect(() => {
        setDescription(app.description || '');
    }, [app]);

    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const handleSave = async () => {
        if (!user || !user.uid) {
            console.error('User not logged in or user.uid is not available.');
            return;
        }

        try {
            await updateAppDescription(user.uid, app.id, description);
            const updatedApp = { ...app, description };
            onUpdate(updatedApp);
            onSave(description);
            onClose();
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    const modalContent = (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-2xl w-4/5 max-w-6xl overflow-hidden flex flex-col"
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

                {/* App info area */}
                <div className="flex p-4 border-b border-gray-200">
                    <div className="w-16 h-16 mr-4">
                        <img
                            src={app.icon || '/placeholder.svg'}
                            alt={`${app.name} icon`}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold">{app.name}</h2>
                        <p className="text-sm text-gray-600">
                            URL: {app.downloadUrl || 'N/A'}
                        </p>
                        {app.tooltip && (
                            <p className="text-sm text-gray-600">
                                설명: {app.tooltip}
                            </p>
                        )}
                        {app.installCommand && (
                            <p className="text-sm text-gray-600">
                                설치 명령어: {app.installCommand}
                            </p>
                        )}
                    </div>
                </div>

                {/* Content area */}
                <div className="flex min-h-[400px] h-[60vh]">
                    <div className="w-1/2 p-4 border-r border-gray-200 flex flex-col">
                        <h2 className="text-lg font-semibold mb-2">
                            ✍️ 마크다운 에디터
                        </h2>
                        <textarea
                            className="flex-1 w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="마크다운 형식으로 설정을 입력하세요..."
                        />
                    </div>

                    <div className="w-1/2 p-4 flex flex-col">
                        <h2 className="text-lg font-semibold mb-2">
                            👁️ 미리보기
                        </h2>
                        <div className="flex-1 border p-4 rounded bg-gray-50 overflow-auto prose prose-sm max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {description}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-100 px-4 py-3 flex justify-between border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        닫기
                    </button>
                    <button
                        onClick={handleSave}
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
