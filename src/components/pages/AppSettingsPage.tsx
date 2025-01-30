import type React from 'react';

import { Card } from '../../components/ui/Card';
import { allApps } from '../../data/all-apps';
import { MarkdownViewer } from './AppSettingsMarkdownViewer';

interface AppSettingsProps {
    appId: string;
}

const defaultMarkdown = `# 앱 설정

여기에 앱의 설정 정보를 기록하세요.

## 예시

- 키보드 단축키
- 사용자 지정 설정
- 추천 플러그인
`;

export const AppSettings: React.FC<AppSettingsProps> = ({ appId }) => {
    const app = allApps.find((app) => app.id === appId);

    if (!app) {
        return <div>App not found</div>;
    }

    return (
        <div className="flex-1 p-4 overflow-auto">
            <Card className="h-full bg-black/20 border-white/10 backdrop-blur-sm p-6">
                <h2 className="text-2xl font-bold text-white/90 mb-6">
                    {app.name} 설정
                </h2>
                <MarkdownViewer content={defaultMarkdown} />
            </Card>
        </div>
    );
};
