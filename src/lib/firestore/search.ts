import { ITool } from '../../types/item';
import { getAppsByCustomUserId, getUserApps } from './apps';

// ✅ 앱 검색 (사용자 ID 기반)
export const searchAppsByUserId = async (
    userId: string,
    searchQuery: string
): Promise<ITool[]> => {
    const apps = await getUserApps(userId);
    return apps.filter((app) =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
};

// ✅ 앱 검색 (customUserId 기반)
export const searchAppsByCustomUserId = async (
    searchQuery: string,
    customUserId: string
): Promise<ITool[]> => {
    const apps = await getAppsByCustomUserId(customUserId);
    return apps.filter((app) =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
};
