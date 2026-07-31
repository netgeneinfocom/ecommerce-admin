// Product-specific TypeScript types and interfaces

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  manufacturer: string;
  categoryId: string;
  subCategoryId?: string;
  brandId?: string;
  dimensionId?: string;
  images: File[];
  tags: string[];
  isNew: boolean;
  sales: boolean;
  featured: boolean;
  status: "active" | "inactive" | "draft";
  return_policy_value: number;
  return_policy_unit: string;
  return_policy_notes: string;
}
