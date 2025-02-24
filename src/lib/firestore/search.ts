import { ITool } from '../../types/item';
import { getAppsByCustomUserIdNoCategory, getUserApps } from './apps';

export const searchAppsByUserId = async (
    userId: string,
    searchQuery: string
): Promise<ITool[]> => {
    const apps = await getUserApps(userId);

    return apps.filter((app) =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
};

export const searchAppsByCustomUserId = async (
    customUserId: string,
    searchQuery: string
): Promise<ITool[]> => {
    const apps = await getAppsByCustomUserIdNoCategory(customUserId);

    return apps.filter((app) =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
};
