// SubCategory-specific TypeScript types and interfaces

export interface SubCategory {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  image?: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface SubCategoryFormData {
  name: string;
  description: string;
  categoryId: string;
  image?: File;
  status: "active" | "inactive";
}
