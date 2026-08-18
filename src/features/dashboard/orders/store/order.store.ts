import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, OrderStatus } from '../types';

interface OrderState {
    currentOrder: Order | null;
    orders: Order[];
    totalPages: number;
    currentPage: number;
    setCurrentOrder: (order: Order | null) => void;
    setOrders: (orders: Order[], totalPages?: number, currentPage?: number) => void;
    updateOrderStatusInStore: (orderId: string, status: OrderStatus) => void;
    clearCurrentOrder: () => void;
}

export const useOrderStore = create<OrderState>()(
    persist(
        (set) => ({
            currentOrder: null,
            orders: [],
            totalPages: 1,
            currentPage: 1,
            setCurrentOrder: (order) => set({ currentOrder: order }),
            setOrders: (orders, totalPages = 1, currentPage = 1) =>
                set({ orders, totalPages, currentPage }),
            updateOrderStatusInStore: (orderId, status) =>
                set((state) => ({
                    currentOrder:
                        state.currentOrder?._id === orderId
                            ? { ...state.currentOrder, order_status: status }
                            : state.currentOrder,
                    orders: state.orders.map((o) =>
                        o._id === orderId ? { ...o, order_status: status } : o
                    ),
                })),
            clearCurrentOrder: () => set({ currentOrder: null }),
        }),
        {
            name: 'order-storage',
        }
    )
);
