import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { BannerItem, PromotionAssociation, BannerResponseItem } from "../types"; // Import types
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"; // Ensure imports
import { brandService } from "@/features/dashboard/brands/services/brandService";
import { categoryService } from "@/features/dashboard/categories/services/categoryService";
import { ImageUploadPreview } from "../../../../components/shared/ImageUploadPreview";
import { promotionsService } from "../services/promotionsService";
import { Loader } from "@/components/loader/Loader";

export function BannerOffer() {
    // Removed mocked banners state
    // const [banners, setBanners] = useState<BannerItem[]>([...]); 

    const [imageUrl, setImageUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [association, setAssociation] = useState<Partial<PromotionAssociation>>({
        type: "category",
        id: ""
    });

    const { data: brandsData } = useQuery({
        queryKey: ["brands-list"],
        queryFn: () => brandService.listBrands(),
    });

    const { data: categoriesData } = useQuery({
        queryKey: ["categories-list"],
        queryFn: () => categoryService.listCategories(),
    });

    const { data: bannerData, isLoading: isLoadingBanners } = useQuery({
        queryKey: ["banner-items"],
        queryFn: promotionsService.getBannerItems,
    });

    const queryClient = useQueryClient();

    const { mutate: addBanner, isPending: isAdding } = useMutation({
        mutationFn: promotionsService.addBannerItem,
        onSuccess: (data) => {
            if (data.success) {
                // Invalidate query to refetch list (if we had one) or update local
                // Invalidate query to refetch list
                queryClient.invalidateQueries({ queryKey: ["banner-items"] });

                setImageUrl("");
                setAssociation({ type: "category", id: "" });
                setSelectedFile(null);
                alert("Banner added successfully");
            }
        },
        onError: (error) => {
            console.error(error);
            alert("Failed to add banner");
        }
    });

    const { mutate: deleteBanner, isPending: isDeleting } = useMutation({
        mutationFn: promotionsService.deleteBannerItem,
        onSuccess: (data) => {
            if (data.success) {
                queryClient.invalidateQueries({ queryKey: ["banner-items"] });
                alert("Banner deleted successfully");
            }
        },
        onError: (error) => {
            console.error(error);
            alert("Failed to delete banner");
        }
    });

    const handleAddBanner = () => {
        if (!imageUrl || !association.id) {
            alert("Please select an image and an association");
            return;
        }

        const formData = new FormData();
        formData.append("association", association.type === 'brand' ? 'Brand' : 'Category');

        if (association.type === 'brand') {
            formData.append("brand", association.id);
        } else {
            formData.append("category", association.id);
        }

        if (selectedFile) {
            formData.append("banner_img", selectedFile);
        } else {
            alert("Please select an image file to upload");
            return;
        }

        addBanner(formData);
    };

    const handleDeleteBanner = (id: string) => {
        if (confirm("Are you sure you want to delete this banner?")) {
            deleteBanner(id);
        }
    };

    return (
        <div className="space-y-6 relative">
            {(isAdding || isDeleting || isLoadingBanners) && (
                <Loader fullScreen message={
                    isAdding ? "Adding Banner..." :
                        isDeleting ? "Deleting Banner..." :
                            "Loading Banners..."
                } />
            )}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Add New Banner</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2 md:col-span-1 lg:col-span-2">
                            <Label htmlFor="banner-image">Banner Image</Label>
                            <ImageUploadPreview
                                value={imageUrl}
                                onChange={setImageUrl}
                                onFileSelect={setSelectedFile}
                                aspectRatio="banner"
                                className="h-40"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Association Type</Label>
                            <Select
                                value={association.type}
                                onValueChange={(val: 'brand' | 'category') => setAssociation({ ...association, type: val, id: "" })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="category">Category</SelectItem>
                                    <SelectItem value="brand">Brand</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Select {association.type === 'brand' ? 'Brand' : 'Category'}</Label>
                            <Select
                                value={association.id}
                                onValueChange={(val) => setAssociation({ ...association, id: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={`Select ${association.type}`} />
                                </SelectTrigger>
                                <SelectContent>
                                    {association.type === 'brand'
                                        ? brandsData?.data.map(b => (
                                            <SelectItem key={b.brand_id} value={b.brand_id}>{b.brand_name}</SelectItem>
                                        ))
                                        : categoriesData?.catgoryProducts.map(c => (
                                            <SelectItem key={c.category_id} value={c.category_id}>{c.category_name}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button className="mt-4" onClick={handleAddBanner}>
                        <Plus className="mr-2 h-4 w-4" /> Add Banner
                    </Button>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {isLoadingBanners ? (
                    <div>Loading banners...</div>
                ) : bannerData?.data.map((banner: BannerResponseItem) => (
                    <Card key={banner._id} className="overflow-hidden group relative">
                        <img src={banner.banner_url} alt="Banner" className="w-full h-48 object-cover transition-transform group-hover:scale-105" />
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDeleteBanner(banner._id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="p-3 bg-card border-t flex justify-between items-center">
                            <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full capitalize">
                                {banner.banner_association.toUpperCase()}
                                {banner.banner_association.toLowerCase() === 'brand'
                                    ? ` - ${brandsData?.data.find(b => b.brand_id === banner.banner_brand)?.brand_name || 'Unknown'}`
                                    : ` - ${categoriesData?.catgoryProducts.find(c => c.category_id === banner.banner_category)?.category_name || 'Unknown'}`
                                }
                            </span>
                        </div>
                    </Card>
                ))}
                {!isLoadingBanners && (!bannerData?.data || bannerData.data.length === 0) && (
                    <div className="text-muted-foreground">No banners found</div>
                )}
            </div>
        </div>
    );
}
