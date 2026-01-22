import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../services/productService';

interface ProductState {
    currentProduct: Product | null;
    setCurrentProduct: (product: Product | null) => void;
}

export const useProductStore = create<ProductState>()(
    persist(
        (set) => ({
            currentProduct: null,
            setCurrentProduct: (product) => set({ currentProduct: product }),
        }),
        {
            name: 'product-storage',
        }
    )
);
