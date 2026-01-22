// Order-specific TypeScript types and interfaces

export interface APIResponse<T> {
  success: boolean;
  message: string;
  orders: T[];
  pagination: Pagination;
}

export interface Pagination {
  totalOrders: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

export interface OrderCustomer {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface OrderItem {
  cart_id: string;
  p_id: string;
  product_name: string;
  product_logo: string;
  product_price: number;
  total_price: number;
  product_brand: string;
  product_dimension: string;
  no_of_products: number;
  _id: string;
}

export interface ShippingAddress {
  _id: string;
  customer_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  country: string;
  state: string;
  city: string;
  postal_code: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Order {
  _id: string;
  customer_id: OrderCustomer;
  order_status: "processing" | "confirmed" | "shipping" | "delivered" | "cancelled";
  order_items: OrderItem[];
  shipping_address: ShippingAddress;
  order_id: string;
  createdAt: string;
  updatedAt: string;
  total_amount: number;
  __v: number;
}

export type OrderStatus = Order["order_status"];
