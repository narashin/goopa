import type React from 'react';
import { useState } from 'react';

import { Card } from '../../components/ui/Card';
import { allApps } from '../../data/all-apps';
import { MarkdownViewer } from './AppSettingsMarkdownViewer';

interface AppSettingsProps {
    appId: string;
    onClose: () => void;
}

const defaultMarkdown = `# 앱 설정

여기에 앱의 설정 정보를 기록하세요.

## 예시

- 키보드 단축키
- 사용자 지정 설정
- 추천 플러그인
`;

export const AppSettings: React.FC<AppSettingsProps> = ({ appId, onClose }) => {
    const app = allApps.find((app) => app.id === appId);
    const [markdown, setMarkdown] = useState(defaultMarkdown);

    if (!app) {
        return <div>App not found</div>;
    }

    const handleSave = () => {
        // TODO: Implement save functionality
        console.log('Saving markdown:', markdown);
    };

    return (
        <div className="flex-1 p-4 overflow-auto">
            <Card className="h-full bg-black/20 border-white/10 backdrop-blur-sm p-6">
                <div className="flex items-start mb-6">
                    <div className="w-16 h-16 mr-4">
                        <img
                            src={app.icon || '/placeholder.svg'}
                            alt={`${app.name} icon`}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white/90 mb-2">
                            {app.name} 설정
                        </h2>
                        <p className="text-white/70">
                            URL: {app.downloadUrl || 'N/A'}
                        </p>
                        {app.tooltip && (
                            <p className="text-white/70">설명: {app.tooltip}</p>
                        )}
                        {app.installCommand && (
                            <p className="text-white/70">
                                설치 명령어: {app.installCommand}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white/90 mb-2">
                            마크다운 에디터
                        </h3>
                        <textarea
                            className="w-full h-64 p-2 bg-black/10 text-white/90 border border-white/20 rounded"
                            value={markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                        />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white/90 mb-2">
                            미리보기
                        </h3>
                        <div className="h-64 overflow-auto bg-black/10 border border-white/20 rounded p-2">
                            <MarkdownViewer content={markdown} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        닫기
                    </button>
                    <button
                        type="submit"
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        저장
                    </button>
                </div>
            </Card>
        </div>
    );
};
