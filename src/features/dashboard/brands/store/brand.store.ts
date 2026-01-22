import { create } from 'zustand';
import { Brand } from '../types';

interface BrandState {
    currentBrand: Brand | null;
    setCurrentBrand: (brand: Brand | null) => void;
}

import { persist } from 'zustand/middleware';

export const useBrandStore = create<BrandState>()(
    persist(
        (set) => ({
            currentBrand: null,
            setCurrentBrand: (brand) => set({ currentBrand: brand }),
        }),
        {
            name: 'brand-storage',
        }
    )
);
