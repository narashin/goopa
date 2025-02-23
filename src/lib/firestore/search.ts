import { ITool } from '../../types/item';
import { getAppsByCustomUserId, getUserApps } from './apps';

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
    const apps = await getAppsByCustomUserId(customUserId);

    return apps.filter((app) =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
};
