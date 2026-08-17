import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { InventoryItem, Supplier, Unit } from '../types';

interface InventoryState {
    inventoryItems: InventoryItem[];
    totalPages: number;
    currentPage: number;
    suppliers: Supplier[];
    units: Unit[];
    setInventoryItems: (items: InventoryItem[], totalPages?: number, currentPage?: number) => void;
    setSuppliers: (suppliers: Supplier[]) => void;
    setUnits: (units: Unit[]) => void;
}

export const useInventoryStore = create<InventoryState>()(
    persist(
        (set) => ({
            inventoryItems: [],
            totalPages: 1,
            currentPage: 1,
            suppliers: [],
            units: [],
            setInventoryItems: (inventoryItems, totalPages = 1, currentPage = 1) =>
                set({ inventoryItems, totalPages, currentPage }),
            setSuppliers: (suppliers) => set({ suppliers }),
            setUnits: (units) => set({ units }),
        }),
        {
            name: 'inventory-storage',
        }
    )
);
