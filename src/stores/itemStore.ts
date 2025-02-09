import { create } from 'zustand';

import { useAuth } from '../hooks/useAuth';
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

interface ItemState {
    isEditMode: boolean;
    setIsEditMode: (isEditMode: boolean) => void;
    toggleEditMode: () => void;
}

export const useItemStore = create<ItemState>((set) => ({
    isEditMode: false,
    setIsEditMode: (isEditMode) => {
        set({ isEditMode });
        const { user } = useAuth();
        if (user) {
            localStorage.setItem('isEditMode', JSON.stringify(isEditMode));
        } else {
            localStorage.removeItem('isEditMode');
        }
    },
    toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
}));

export function useItemsWithStore() {
    const { user } = useAuth();
    const { data: items, isLoading } = useItemsQuery(user?.uid ?? '');
    const addItemMutation = useAddItem();
    const updateItemMutation = useUpdateItem();
    const deleteItemMutation = useDeleteItem();
    const itemsByCategoryAndUserIdResult = useItemsByCategoryAndUserId(
        AppCategoryType.General,
        user?.uid ?? ''
    );

    const handleAddItem = (newItem: Omit<ITool, 'id'>) => {
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
        const { data } = usePublicItemsByCategory(category);
        return data ?? [];
    };

    const { isEditMode, setIsEditMode, toggleEditMode } = useItemStore();

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
        isEditMode,
        setIsEditMode,
        toggleEditMode,
    };
}
