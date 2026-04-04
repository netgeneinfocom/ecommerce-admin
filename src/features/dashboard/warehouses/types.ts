export interface Warehouse {
  _id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  status: string;
  warehouseId: string;
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CreateWarehouseData {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  coordinates: [number, number];
}

export interface WarehouseResponse {
  success: boolean;
  message: string;
  warehouse?: Warehouse;
}

export interface WarehouseListResponse {
  success: boolean;
  message: string;
  warehouses: Warehouse[];
}
