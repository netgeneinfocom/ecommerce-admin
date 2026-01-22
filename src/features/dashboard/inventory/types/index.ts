// Inventory-specific TypeScript types and interfaces

export interface InventoryItem {
    _id: string;
    product_stock: number;
    product_code: string;
    stock_status: string;
    createdAt: string;
    product_name: string;
    product_url: string;
    dimension_name: string;
}

export interface InventoryListResponse {
    success: boolean;
    message: string;
    currentPage: number;
    limit: number;
    totalPages: number;
    data: InventoryItem[];
}

export interface InventoryListParams {
    page?: number;
    limit?: number;
}

// Add Inventory Form Types
export interface Unit {
    _id: string;
    dimension_name: string;
}

export interface Product {
    _id: string;
    product_name: string;
    product_code?: string;
    dimensions: string; // The selected dimension ID
}

export interface Supplier {
    _id?: string;
    id?: string; // for backward compatibility if needed, though strictly _id is from backend
    name: string;
    email?: string;
    phone?: string;
}

export interface AddSupplierParams {
    name: string;
    email: string;
    phone: string;
}

export interface AddSupplierResponse {
    success: boolean;
    message: string;
    supplier: Supplier;
}

export interface GetSuppliersResponse {
    success: boolean;
    message: string;
    totalCount: number;
    suppliers: Supplier[];
}

export interface AddInventoryItem {
    id: string;
    productId: string;
    unitId: string;
    quantity: number;
    price: number;
    supplierId: string;
}

export interface BillItem {
    id: string;
    productId: string;
    productName: string;
    unitId: string;
    unitName: string;
    quantity: number;
    price: number;
    total: number;
    supplierId: string;
    supplierName: string;
}

export interface Bill {
    id: string;
    billNumber: string;
    date: Date;
    items: BillItem[];
    grandTotal: number;
    status: 'saved' | 'pending';
}

export interface InventoryBill {
    _id: string;
    bill_number: string;
    bill_date: string;
    items_count: string;
    total_amount: string;
}

export interface InventoryBillResponse {
    success: boolean;
    totalBills: number;
    totalPages: number;
    currentPage: number;
    data: InventoryBill[];
}
export interface InventoryBillDetailItem {
    product: string;
    supplier: string;
    unit: string;
    price: string;
    qty: number;
    total: string;
}

export interface InventoryBillDetail {
    bill_number: string;
    bill_date: string;
    items: InventoryBillDetailItem[];
    grand_total: string;
}

export interface InventoryBillDetailResponse {
    success: boolean;
    data: InventoryBillDetail;
}
