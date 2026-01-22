import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/core/hooks/use-toast";
import { FormPageHeader, ImageUploadSingle, FormActions } from "@/components/shared";
import { ROUTES } from "@/core/config/routes";

import { Loader } from "@/components/loader/Loader";
import { useSubCategoryStore, subcategoryService } from "@/features/dashboard/subcategories";

type SubCategoryFormData = {
  sub_category_name: string;
  logo: string;
  logoFile: File | null;
};

export default function SubCategoryEdit() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const subCategoryId = searchParams.get("id");
  const { toast } = useToast();

  const { currentSubCategory } = useSubCategoryStore();

  const [formData, setFormData] = useState<SubCategoryFormData>({
    sub_category_name: currentSubCategory?.sub_category_name || "",
    logo: currentSubCategory?.sub_category_logo || "",
    logoFile: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);




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



    setIsSubmitting(true);

    try {
      const apiFormData = new FormData();
      apiFormData.append("sub_category_name", formData.sub_category_name);
      // apiFormData.append("category_id", formData.category); // Assuming backend might need this, but user request only mentioned name and logo
      if (formData.logoFile) {
        apiFormData.append("sub_category_logo", formData.logoFile);
      }

      if (subCategoryId) {
        await subcategoryService.updateSubcategory(subCategoryId, apiFormData);
        toast({
          title: "SubCategory updated",
          description: "The subcategory has been updated successfully.",
        });
        navigate(ROUTES.DASHBOARD.SUBCATEGORIES);
      }
    } catch (error: any) {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || error?.message || "Failed to update subcategory",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <FormPageHeader
        title="Edit SubCategory"
        description="Update subcategory information"
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
              <Label>Category</Label>
              <Input
                value={currentSubCategory?.category_name || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground">Category cannot be changed</p>
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
          submitLabel="Update SubCategory"
        />
      </form>
      {isSubmitting && <Loader fullScreen message="Updating subcategory..." />}
    </div>
  );
}
