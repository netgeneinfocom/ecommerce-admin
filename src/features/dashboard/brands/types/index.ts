// Brand-specific TypeScript types and interfaces

export interface Brand {
  brand_id: string;
  brand_name: string;
  brand_logo: string;
  total_products: number;
}

export interface BrandFormData {
  name: string;
  description: string;
  logo?: File;
  status: "active" | "inactive";
}
