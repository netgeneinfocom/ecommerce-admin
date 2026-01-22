import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/core/hooks/use-toast";
import { FormPageHeader, ImageUploadSingle, FormActions } from "@/components/shared";
import { ROUTES } from "@/core/config/routes";
import { categoryService } from "@/features/dashboard/categories/services";
import { showErrorToast } from "@/core/errors";
import { Loader } from "@/components/loader/Loader";

type CategoryFormData = {
  category_name: string;
  category_logo: string;
  logoFile: File | null;
};

export default function CategoryAdd() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<CategoryFormData>({
    category_name: "",
    category_logo: "",
    logoFile: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category_name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.logoFile) {
      toast({
        title: "Error",
        description: "Category logo is required",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const formDataToSend = new FormData();
      formDataToSend.append('category_name', formData.category_name);
      formDataToSend.append('category_logo', formData.logoFile);

      await categoryService.createCategory(formDataToSend);

      toast({
        title: "Success",
        description: "Category added successfully",
      });

      navigate(ROUTES.DASHBOARD.CATEGORIES);
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <FormPageHeader
        title="Add New Category"
        description="Fill in the details to add a new category"
        backPath={ROUTES.DASHBOARD.CATEGORIES}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Category Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category_name">Category Name *</Label>
              <Input
                id="category_name"
                value={formData.category_name}
                onChange={(e) => setFormData(prev => ({ ...prev, category_name: e.target.value }))}
                placeholder="e.g., Electronics"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Logo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ImageUploadSingle
              label="Category Logo"
              value={formData.category_logo}
              onChange={(value) => setFormData(prev => ({ ...prev, category_logo: value }))}
              onFileChange={(file) => setFormData(prev => ({ ...prev, logoFile: file }))}
              alt="Category logo"
            />
          </CardContent>
        </Card>

        <FormActions
          cancelPath={ROUTES.DASHBOARD.CATEGORIES}
          submitLabel="Add Category"
          isSubmitting={isSubmitting}
        />
      </form>
      {isSubmitting && <Loader fullScreen message="Adding category..." />}
    </div>
  );
}
