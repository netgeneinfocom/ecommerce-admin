import { create } from 'zustand';

import { persist } from 'zustand/middleware';
interface SubCategory {
    sub_category_id: string;
    sub_category_name: string;
    sub_category_logo: string;
    category_name: string;
    products: number;
}

interface SubCategoryState {
    currentSubCategory: SubCategory | null;
    setCurrentSubCategory: (subCategory: SubCategory | null) => void;
}


export const useSubCategoryStore = create<SubCategoryState>()(
    persist(
        (set) => ({
            currentSubCategory: null,
            setCurrentSubCategory: (subCategory) => set({ currentSubCategory: subCategory }),
        }),
        {
            name: 'subcategory-storage',
        }
    )
);
