import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Category {
    category_id: string;
    category_name: string;
    category_logo: string;
    total_subcategories: number;
}

interface CategoryState {
    currentCategory: Category | null;
    setCurrentCategory: (category: Category | null) => void;
}

export const useCategoryStore = create<CategoryState>()(
    persist(
        (set) => ({
            currentCategory: null,
            setCurrentCategory: (category) => set({ currentCategory: category }),
        }),
        {
            name: 'category-storage',
        }
    )
);
