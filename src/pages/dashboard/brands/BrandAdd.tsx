import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/core/hooks/use-toast";
import { FormPageHeader, ImageUploadSingle, FormActions } from "@/components/shared";
import { ROUTES } from "@/core/config/routes";
import { brandService } from "@/features/dashboard/brands/services";
import { showErrorToast } from "@/core/errors";
import { Loader } from "@/components/loader/Loader";

type BrandFormData = {
  brand_name: string;
  logo: string;
  logoFile: File | null;
};

export default function BrandAdd() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<BrandFormData>({
    brand_name: "",
    logo: "",
    logoFile: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.brand_name.trim()) {
      toast({
        title: "Error",
        description: "Brand name is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.logoFile) {
      toast({
        title: "Error",
        description: "Brand logo is required",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const formDataToSend = new FormData();
      formDataToSend.append('brand_name', formData.brand_name);
      formDataToSend.append('brand_logo', formData.logoFile);

      await brandService.createBrand(formDataToSend);

      toast({
        title: "Success",
        description: "Brand added successfully",
      });

      navigate(ROUTES.DASHBOARD.BRAND);
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <FormPageHeader
        title="Add New Brand"
        description="Fill in the details to add a new brand"
        backPath={ROUTES.DASHBOARD.BRAND}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Brand Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brand_name">Brand Name *</Label>
              <Input
                id="brand_name"
                value={formData.brand_name}
                onChange={(e) => setFormData(prev => ({ ...prev, brand_name: e.target.value }))}
                placeholder="e.g., Apple"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Brand Logo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ImageUploadSingle
              label="Brand Logo"
              value={formData.logo}
              onChange={(value) => setFormData(prev => ({ ...prev, logo: value }))}
              onFileChange={(file) => setFormData(prev => ({ ...prev, logoFile: file }))}
              alt="Brand logo"
            />
          </CardContent>
        </Card>

        <FormActions
          cancelPath={ROUTES.DASHBOARD.BRAND}
          submitLabel="Add Brand"
          isSubmitting={isSubmitting}
        />
      </form>
      {isSubmitting && <Loader fullScreen message="Adding brand..." />}
    </div>
  );
}
