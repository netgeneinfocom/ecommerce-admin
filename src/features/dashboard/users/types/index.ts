// User-specific TypeScript types and interfaces

export interface UserPermission {
  can_add_superadmin: boolean;
  can_add_admin: boolean;
  can_add_records: boolean;
  can_update_records: boolean;
  can_read_records: boolean;
  can_delete_records: boolean;
  is_customer: boolean;
  _id: string;
}

export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  password?: string;
  role: "customer" | "admin" | "superadmin";
  permission_component: UserPermission[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  password?: string;
  role: "customer" | "admin" | "superadmin";
  permission_component?: Partial<UserPermission>[];
}
