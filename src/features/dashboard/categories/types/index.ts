// Category-specific TypeScript types and interfaces

export interface Category {
  id: string;
  name: string;
  description: string;
  image?: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
  image?: File;
  status: "active" | "inactive";
}
