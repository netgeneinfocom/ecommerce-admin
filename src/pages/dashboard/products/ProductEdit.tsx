import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/core/hooks/use-toast";
import { ROUTES } from "@/core/config/routes";
import {
  FormPageHeader,
  ImageUploadSingle,
  ImageUploadMultiple,
  FormActions,
  TagInput,
  RichTextEditor
} from "@/components/shared";
import { Loader } from "@/components/loader/Loader";
import {
  productService,
  useProductStore,
} from "@/features/dashboard/products";
import { brandService } from "@/features/dashboard/brands";
import { categoryService } from "@/features/dashboard/categories";
import { subcategoryService } from "@/features/dashboard/subcategories";
import { dimensionService } from "@/features/dashboard/inventory";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Dimension = {
  _id: string;
  dimension_name: string;
};

type ProductFormData = {
  name: string;
  description: string;
  brand: string;
  category: string;
  subCategory: string;
  manufacturer: string;
  tags: string[];
  dimensionId: string;
  price: number;
  discount: number;
  newBadge: boolean;
  salesBadge: boolean;
  featured: boolean;
  avatar: string;
  avatarFile: File | null;
  coverImages: string[]; // Current cover image URLs (both existing and newly added)
  coverImageFiles: File[];
};

type Brand = {
  brand_id: string;
  brand_name: string;
  brand_logo: string;
};

type Category = {
  category_id: string;
  category_name: string;
  category_logo: string;
};

type Subcategory = {
  sub_category_id: string;
  sub_category_name: string;
  sub_category_logo: string;
  category_name: string;
  parent_category?: string;
};

export default function ProductEdit() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { toast } = useToast();

  const { currentProduct } = useProductStore();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track original cover images to detect changes
  const [originalCoverImages, setOriginalCoverImages] = useState<string[]>(
    currentProduct?.cover_images?.map(img => img.url) || []
  );

  // Initialize form with current product data from store
  const [formData, setFormData] = useState<ProductFormData>({
    name: currentProduct?.product_name || "",
    description: currentProduct?.product_description || "",
    brand: currentProduct?.product_brand || "",
    category: currentProduct?.product_category || "",
    subCategory: currentProduct?.product_sub_category || "",
    manufacturer: currentProduct?.manufacturer || "",
    tags: currentProduct?.tags?.map(t => t.tag_name) || [],
    dimensionId: currentProduct?.dimensions || "", // Initialize with dimensions (could be ID or name)
    price: currentProduct?.product_price || 0,
    discount: currentProduct?.discount_precentage || 0,
    newBadge: currentProduct?.isNew === true || currentProduct?.isNew === "1" || currentProduct?.isNew === "true",
    salesBadge: currentProduct?.sales === true || currentProduct?.sales === "1" || currentProduct?.sales === "true",
    featured: currentProduct?.featured === true || currentProduct?.featured === "1" || currentProduct?.featured === "true",
    avatar: currentProduct?.avatar || "",
    avatarFile: null,
    coverImages: currentProduct?.cover_images?.map(img => img.url) || [],
    coverImageFiles: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [brandsRes, categoriesRes, subcategoriesRes, metricsRes] = await Promise.all([
          brandService.listBrands(),
          categoryService.listCategories(),
          subcategoryService.listSubcategories(),
          dimensionService.getMetrics(),
        ]);

        setBrands(brandsRes.data);
        setCategories(categoriesRes.catgoryProducts);

        // Set dimensions and find current product's dimension ID
        if (metricsRes.success) {
          const dimensionsList = metricsRes.metrics.map(m => ({
            _id: m._id,
            dimension_name: m.dimension_name,
          }));
          setDimensions(dimensionsList);

          // Find the dimension ID that matches currentProduct.dimensions (which could be name or ID)
          if (currentProduct?.dimensions) {
            const currentDim = dimensionsList.find(d => 
              d.dimension_name === currentProduct.dimensions || 
              d._id === currentProduct.dimensions
            );
            if (currentDim) {
              setFormData(prev => ({ ...prev, dimensionId: currentDim._id }));
            }
          }
        }

        // Map subcategories to include parent_category ID based on category_name
        const mappedSubcategories = subcategoriesRes.data.map(sub => {
          const parentCat = categoriesRes.catgoryProducts.find(c => c.category_name === sub.category_name);
          return {
            ...sub,
            parent_category: parentCat?.category_id
          };
        });

        setSubcategories(mappedSubcategories);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load form data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const actualPrice = formData.price - (formData.price * formData.discount / 100);
  const availableSubCategories = formData.category
    ? subcategories.filter(sub => sub.parent_category === formData.category)
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId) {
      toast({
        title: "Error",
        description: "Product ID is missing",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const apiFormData = new FormData();
      apiFormData.append('product_name', formData.name);
      apiFormData.append('product_description', formData.description);
      apiFormData.append('product_price', formData.price.toString());
      apiFormData.append('discount_percentage', formData.discount.toString());
      apiFormData.append('sales', formData.salesBadge ? "1" : "0");
      apiFormData.append('featured', formData.featured ? "1" : "0");
      apiFormData.append('manufacturer', formData.manufacturer);
      apiFormData.append('isNew', formData.newBadge ? "1" : "0");

      // Append avatar if a new file was selected
      if (formData.avatarFile) {
        apiFormData.append('avatar', formData.avatarFile);
      }

      // Append tags individually
      formData.tags.forEach((tag) => {
        apiFormData.append('tags', tag);
      });

      // Check if there are image changes (deletions, additions, or reordering)
      const hasImageChanges = 
        formData.coverImages.length !== originalCoverImages.length ||
        formData.coverImageFiles.length > 0 ||
        formData.coverImages.some((url, idx) => url !== originalCoverImages[idx]);

      // Only send existing_cover_images if there are changes
      // This tells the backend which images to keep; omitted ones will be deleted
      if (hasImageChanges) {
        formData.coverImages.forEach((url) => {
          // Only append URLs that aren't new (already existed on the server)
          if (originalCoverImages.includes(url)) {
            apiFormData.append('existing_cover_images', url);
          }
        });
      }

      // Append new cover images if any were selected
      formData.coverImageFiles.forEach((file) => {
        apiFormData.append('cover_images', file);
      });

      // Append IDs to FormData as the URL now only contains product_id and dimension_id
      apiFormData.append('brand_id', formData.brand);
      apiFormData.append('category_id', formData.category);
      apiFormData.append('sub_category_id', formData.subCategory);

      // Get dimension name from ID for the dimensions field
      const selectedDimension = dimensions.find(d => d._id === formData.dimensionId);
      apiFormData.append('dimensions', selectedDimension?.dimension_name || '');

      await productService.updateProduct(
        productId,
        apiFormData,
        formData.dimensionId
      );

      toast({
        title: "Success",
        description: "Product updated successfully",
      });

      navigate(ROUTES.DASHBOARD.PRODUCTS);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update product";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If no current product in store, show error
  if (!currentProduct) {
    return (
      <div className="space-y-6">
        <FormPageHeader
          title="Edit Product"
          description="Update product information"
          backPath={ROUTES.DASHBOARD.PRODUCTS}
        />
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              No product data found. Please select a product from the products list.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return <Loader fullScreen message="Loading product data..." />;
  }

  return (
    <div className="space-y-6">
      <FormPageHeader
        title="Edit Product"
        description="Update product information"
        backPath={ROUTES.DASHBOARD.PRODUCTS}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Product Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  placeholder="Enter product name"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand *</Label>
                <Select
                  value={formData.brand}
                  onValueChange={(value) => setFormData({ ...formData, brand: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.brand_id} value={brand.brand_id}>
                        {brand.brand_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value, subCategory: "" })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.category_id} value={cat.category_id}>
                        {cat.category_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subCategory">Sub Category *</Label>
                <Select
                  value={formData.subCategory}
                  onValueChange={(value) => setFormData({ ...formData, subCategory: value })}
                  disabled={!formData.category}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder={formData.category ? "Select sub category" : "Select category first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubCategories.map((subCat) => (
                      <SelectItem key={subCat.sub_category_id} value={subCat.sub_category_id}>
                        {subCat.sub_category_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-1">
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  placeholder="Enter manufacturer name"
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <RichTextEditor
                placeholder="Enter description"
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
              />
            </div>

            <TagInput
              label="Tags"
              tags={formData.tags}
              onChange={(tags) => setFormData({ ...formData, tags })}
              placeholder="Type and press Enter"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dimensions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dimensions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No Dimensions found.{" "}
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.DASHBOARD.INVENTORY)}
                  className="text-primary hover:underline font-medium"
                >
                  Add a dimension
                </button>
              </p>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="dimensionId">Dimension Type *</Label>
                <Select
                  value={formData.dimensionId}
                  onValueChange={(value) => setFormData({ ...formData, dimensionId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select dimension" />
                  </SelectTrigger>
                  <SelectContent>
                    {dimensions.map((dim) => (
                      <SelectItem key={dim._id} value={dim._id}>
                        {dim.dimension_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">Product Price *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount Percentage</Label>
                <Input
                  id="discount"
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="actualPrice">Final Price</Label>
                <Input
                  id="actualPrice"
                  value={actualPrice.toFixed(2)}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status & Flags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex items-center gap-4">
                <Label htmlFor="newBadge" className="flex flex-col space-y-1">
                  <span>New Badge</span>
                  <span className="font-normal text-xs text-muted-foreground">Show as new product</span>
                </Label>
                <Switch
                  id="newBadge"
                  checked={formData.newBadge}
                  onCheckedChange={(checked) => setFormData({ ...formData, newBadge: checked })}
                />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="salesBadge" className="flex flex-col space-y-1">
                  <span>Sales Badge</span>
                  <span className="font-normal text-xs text-muted-foreground">Show on sale</span>
                </Label>
                <Switch
                  id="salesBadge"
                  checked={formData.salesBadge}
                  onCheckedChange={(checked) => setFormData({ ...formData, salesBadge: checked })}
                />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="featured" className="flex flex-col space-y-1">
                  <span>Featured</span>
                  <span className="font-normal text-xs text-muted-foreground">Highlight this product</span>
                </Label>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ImageUploadSingle
              label="Avatar (Main Product Image)"
              value={formData.avatar}
              onChange={(value) => setFormData(prev => ({ ...prev, avatar: value }))}
              onFileChange={(file) => setFormData(prev => ({ ...prev, avatarFile: file }))}
              alt="Product avatar"
            />

            <ImageUploadMultiple
              label="Cover Images (Multiple)"
              values={formData.coverImages}
              onChange={(values) => setFormData(prev => ({ ...prev, coverImages: values }))}
              onFilesChange={(files) => setFormData(prev => ({ ...prev, coverImageFiles: [...prev.coverImageFiles, ...files] }))}
            />
          </CardContent>
        </Card>

        <FormActions
          cancelPath={ROUTES.DASHBOARD.PRODUCTS}
          submitLabel="Update Product"
          isSubmitting={isSubmitting}
        />
      </form>
      {isSubmitting && <Loader fullScreen message="Updating product..." />}
    </div>
  );
}
