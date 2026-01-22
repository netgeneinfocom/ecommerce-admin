import { Product, Supplier, Unit } from '../types';

// Mock data for products (Removed - using API)

// Mock data for suppliers
export const mockSuppliers: Supplier[] = [
    { id: 'sup-1', name: 'Global Foods Inc.' },
    { id: 'sup-2', name: 'Organic Suppliers Co.' },
    { id: 'sup-3', name: 'Premium Wholesale Ltd.' },
    { id: 'sup-4', name: 'Fresh Direct Supply' },
    { id: 'sup-5', name: 'Quality Foods Distribution' },
];

// Generate bill number
export const generateBillNumber = (): string => {
    const prefix = 'INV';
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}-${year}${month}-${random}`;
};
