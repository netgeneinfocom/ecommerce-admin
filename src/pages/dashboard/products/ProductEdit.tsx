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
import { productService, useProductStore } from "@/features/dashboard/products";

type ProductFormData = {
  name: string;
  description: string;
  manufacturer: string;
  tags: string[];
  price: number;
  discount: number;
  newBadge: boolean;
  salesBadge: boolean;
  featured: boolean;
  avatar: string;
  avatarFile: File | null;
  coverImages: string[];
  coverImageFiles: File[];
};

export default function ProductEdit() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { toast } = useToast();

  const { currentProduct } = useProductStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with current product data from store
  const [formData, setFormData] = useState<ProductFormData>({
    name: currentProduct?.product_name || "",
    description: currentProduct?.product_description || "",
    manufacturer: currentProduct?.manufacturer || "",
    tags: currentProduct?.tags?.map(t => t.tag_name) || [],
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

  const actualPrice = formData.price - (formData.price * formData.discount / 100);

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

      // Append new cover images if any were selected
      formData.coverImageFiles.forEach((file) => {
        apiFormData.append('cover_images', file);
      });

      await productService.updateProduct(productId, apiFormData);

      toast({
        title: "Success",
        description: "Product updated successfully",
      });

      navigate(ROUTES.DASHBOARD.PRODUCTS);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
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
