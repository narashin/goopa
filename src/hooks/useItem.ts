import {
    useAddItem,
    useDeleteItem,
    useGetItems,
    useGetItems as useItemsQuery,
    useItemsByCategoryAndUserId,
    usePublicItemsByCategory,
    useUpdateItem,
} from '../queries/itemQueries';
import { AppCategoryType } from '../types/category';
import type { ITool } from '../types/item';
import { useAuth } from './useAuth';

export function useItems() {
    const { user } = useAuth();
    const { data: items, isLoading } = useItemsQuery(user?.uid ?? '');
    const addItemMutation = useAddItem();
    const updateItemMutation = useUpdateItem();
    const deleteItemMutation = useDeleteItem();
    const itemsByCategoryAndUserIdResult = useItemsByCategoryAndUserId(
        AppCategoryType.General,
        user?.uid ?? ''
    );
    const itemsInPublicByCategory = usePublicItemsByCategory(
        AppCategoryType.General
    );

    const handleAddItem = (
        newItem: Omit<ITool, 'id' | 'starCount' | 'userId'>
    ) => {
        if (user) {
            addItemMutation.mutate({
                userId: user.uid,
                newItem: newItem as ITool,
            });
        }
    };

    const handleUpdateItem = (updatedItem: ITool) => {
        if (user) {
            updateItemMutation.mutate({ userId: user.uid, updatedItem });
        }
    };

    const handleDeleteItem = (itemId: string) => {
        if (user) {
            deleteItemMutation.mutate({ userId: user.uid, itemId });
        }
    };

    const itemsByUserId = useGetItems(user?.uid ?? '');
    const getItemsByUserId = () => {
        return itemsByUserId.data ?? [];
    };

    const getItemsByCategoryAndUserId = (category: AppCategoryType) => {
        return (
            itemsByCategoryAndUserIdResult.data?.filter(
                (item) => item.category === category
            ) ?? []
        );
    };

    const getPublicItemsByCategory = (category: AppCategoryType) => {
        return (
            itemsInPublicByCategory.data?.filter(
                (item) => item.category === category
            ) ?? []
        );
    };

    return {
        items,
        isLoading,
        addItem: handleAddItem,
        updateItem: handleUpdateItem,
        deleteItem: handleDeleteItem,
        getItemsByUserId,
        getItemsByCategoryAndUserId,
        getPublicItemsByCategory,
        addItemMutation,
        updateItemMutation,
        deleteItemMutation,
    };
}
