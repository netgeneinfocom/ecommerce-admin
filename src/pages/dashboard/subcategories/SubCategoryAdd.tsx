import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/core/hooks/use-toast";
import { FormPageHeader, ImageUploadSingle, FormActions } from "@/components/shared";
import { ROUTES } from "@/core/config/routes";
import { subcategoryService } from "@/features/dashboard/subcategories/services";
import { categoryService } from "@/features/dashboard/categories/services";
import { showErrorToast } from "@/core/errors";
import { Loader } from "@/components/loader/Loader";

type SubCategoryFormData = {
  sub_category_name: string;
  category: string;
  logo: string;
  logoFile: File | null;
};

type Category = {
  category_id: string;
  category_name: string;
  category_logo: string;
};

export default function SubCategoryAdd() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<SubCategoryFormData>({
    sub_category_name: "",
    category: "",
    logo: "",
    logoFile: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.listCategories();
        setCategories(response.catgoryProducts || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive"
        });
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.sub_category_name.trim()) {
      toast({
        title: "Error",
        description: "SubCategory name is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: "Error",
        description: "Category is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.logoFile) {
      toast({
        title: "Error",
        description: "SubCategory logo is required",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const formDataToSend = new FormData();
      formDataToSend.append('sub_category_name', formData.sub_category_name);
      formDataToSend.append('sub_category_logo', formData.logoFile);

      await subcategoryService.createSubcategory(formDataToSend, formData.category);

      toast({
        title: "Success",
        description: "SubCategory added successfully",
      });

      navigate(ROUTES.DASHBOARD.SUBCATEGORIES);
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <FormPageHeader
        title="Add New SubCategory"
        description="Fill in the details to add a new subcategory"
        backPath={ROUTES.DASHBOARD.SUBCATEGORIES}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic SubCategory Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sub_category_name">SubCategory Name *</Label>
              <Input
                id="sub_category_name"
                value={formData.sub_category_name}
                onChange={(e) => setFormData(prev => ({ ...prev, sub_category_name: e.target.value }))}
                placeholder="e.g., Smartphones"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                disabled={isLoadingCategories}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select category"} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.category_id} value={category.category_id}>
                      {category.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SubCategory Logo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ImageUploadSingle
              label="SubCategory Logo"
              value={formData.logo}
              onChange={(value) => setFormData(prev => ({ ...prev, logo: value }))}
              onFileChange={(file) => setFormData(prev => ({ ...prev, logoFile: file }))}
              alt="SubCategory logo"
            />
          </CardContent>
        </Card>

        <FormActions
          cancelPath={ROUTES.DASHBOARD.SUBCATEGORIES}
          submitLabel="Add SubCategory"
          isSubmitting={isSubmitting}
        />
      </form>
      {isSubmitting && <Loader fullScreen message="Adding subcategory..." />}
    </div>
  );
}
