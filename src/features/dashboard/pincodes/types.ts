export interface Area {
  _id: string;
  areaId: string;
  name: string;
  city: string;
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pincode {
  _id: string;
  pincode: string;
  isActive: boolean;
  areas: Area[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAreaData {
  name: string;
  city: string;
  coordinates: [number, number];
}

export interface CreatePincodeData {
  pincode: string;
  areas: CreateAreaData[];
}

export interface PincodeResponse {
  success: boolean;
  message: string;
  pincode?: Pincode;
}

export interface PincodeListResponse {
  success: boolean;
  message: string;
  data: Pincode[];
}
