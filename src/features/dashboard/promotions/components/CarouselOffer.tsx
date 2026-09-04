import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { CarouselItem, PromotionAssociation, CarouselResponseItem } from "../types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { brandService } from "@/features/dashboard/brands/services/brandService";
import { categoryService } from "@/features/dashboard/categories/services/categoryService";
import { ImageUploadPreview } from "../../../../components/shared/ImageUploadPreview";
import { promotionsService } from "../services/promotionsService";
import { Loader } from "@/components/loader/Loader";

export function CarouselOffer() {
    // Removed local state items for fetched data
    // const [items, setItems] = useState<CarouselItem[]>([...mock]); - Removed

    const [form, setForm] = useState<Partial<CarouselItem>>({
        title: "",
        description: "",
        image: "",
    });

    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [association, setAssociation] = useState<Partial<PromotionAssociation>>({
        type: "category",
        id: ""
    });

    const queryClient = useQueryClient();

    // Fetch Carousel Items
    const { data: carouselData, isLoading: isLoadingCarousel } = useQuery({
        queryKey: ["carousel-items"],
        queryFn: promotionsService.getCarouselItems,
    });

    const { mutate: addCarousel, isPending: isAdding } = useMutation({
        mutationFn: promotionsService.addCarouselItem,
        onSuccess: (data) => {
            if (data.success) {
                // Invalidate query to refetch list
                queryClient.invalidateQueries({ queryKey: ["carousel-items"] });

                resetForm();
                alert("Carousel item added successfully");
            }
        },
        onError: (error) => {
            console.error(error);
            alert("Failed to add carousel item");
        }
    });

    const { mutate: updateCarousel, isPending: isUpdating } = useMutation({
        mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
            promotionsService.updateCarouselItem(id, formData),
        onSuccess: (data) => {
            if (data?.success) {
                queryClient.invalidateQueries({ queryKey: ["carousel-items"] });
                resetForm();
                alert(data.message || "Carousel item updated successfully");
            } else {
                alert(data?.message || "Failed to update carousel item");
            }
        },
        onError: (error: any) => {
            console.error("Update error:", error);
            const msg = error.response?.data?.message || error.message || "Failed to update carousel item";
            alert(msg);
        }
    });

    const { mutate: deleteCarousel, isPending: isDeleting } = useMutation({
        mutationFn: promotionsService.deleteCarouselItem,
        onSuccess: (data) => {
            if (data?.success) {
                queryClient.invalidateQueries({ queryKey: ["carousel-items"] });
                alert(data.message || "Carousel item deleted successfully");
            } else {
                alert(data?.message || "Failed to delete carousel item");
            }
        },
        onError: (error: any) => {
            console.error("Delete error:", error);
            const msg = error.response?.data?.message || error.message || "Failed to delete carousel item";
            alert(msg);
        }
    });

    const resetForm = () => {
        setForm({ title: "", description: "", image: "" });
        setAssociation({ type: "category", id: "" });
        setSelectedFile(null);
        setEditingId(null);
    };

    // Fetch brands and categories for association
    const { data: brandsData } = useQuery({
        queryKey: ["brands-list"],
        queryFn: () => brandService.listBrands(),
    });

    const { data: categoriesData } = useQuery({
        queryKey: ["categories-list"],
        queryFn: () => categoryService.listCategories(),
    });

    const handleAddItem = () => {
        if (!form.title) {
            alert("Please enter a title");
            return;
        }

        if (!association.id) {
            alert(`Please select a ${association.type || 'category'}`);
            return;
        }

        if (!editingId && !selectedFile) {
            alert("Please select an image file");
            return;
        }

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description || "");

        const assocType = association.type === 'brand' ? 'brand' : 'category';
        formData.append("association", assocType);

        if (assocType === 'brand') {
            formData.append("brand", association.id);
        } else {
            formData.append("category", association.id);
        }

        if (selectedFile) {
            formData.append("carousel_img", selectedFile);
        }

        if (editingId) {
            updateCarousel({ id: editingId, formData });
        } else {
            addCarousel(formData);
        }
    };

    const handleEdit = (item: CarouselResponseItem) => {
        setEditingId(item._id);
        setSelectedFile(null);
        setForm({
            title: item.carousel_title || "",
            description: item.carousel_description || "",
            image: item.carousel_url || ""
        });

        // Determine association type and ID
        let type: 'brand' | 'category' = 'category';
        let id = '';

        if (item.carousel_association) {
            const assoc = item.carousel_association.toLowerCase();
            if (assoc === 'brand') {
                type = 'brand';
                const rawBrand = item.carousel_brand;
                id = (typeof rawBrand === 'object' && rawBrand !== null)
                    ? ((rawBrand as any)._id || (rawBrand as any).brand_id || '')
                    : (rawBrand || '');
            } else {
                type = 'category';
                const rawCat = item.carousel_category;
                id = (typeof rawCat === 'object' && rawCat !== null)
                    ? ((rawCat as any)._id || (rawCat as any).category_id || '')
                    : (rawCat || '');
            }
        }

        setAssociation({ type, id });

        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this item?")) {
            deleteCarousel(id);
        }
    };

    return (
        <div className="space-y-6 relative">
            {(isAdding || isUpdating || isDeleting || isLoadingCarousel) && (
                <Loader
                    fullScreen
                    message={
                        isAdding ? "Adding Carousel Item..." :
                            isUpdating ? "Updating Carousel Item..." :
                                isDeleting ? "Deleting Carousel Item..." :
                                    "Loading Carousel Items..."
                    }
                />
            )}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Manage Carousel Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="Enter carousel title"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image">Slide Image</Label>
                            <ImageUploadPreview
                                value={form.image}
                                onChange={(val) => {
                                    setForm({ ...form, image: val });
                                    if (!val) setSelectedFile(null);
                                }}
                                onFileSelect={(file) => setSelectedFile(file)}
                                aspectRatio="video"
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
                        <div className="space-y-2 md:col-span-2 lg:col-span-3">
                            <Label htmlFor="desc">Description</Label>
                            <Textarea
                                id="desc"
                                placeholder="Enter short description"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button className="mt-4" onClick={handleAddItem} disabled={isAdding || isUpdating}>
                            {editingId ? <Edit2 className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                            {isAdding || isUpdating ? "Processing..." : (editingId ? "Update Carousel Item" : "Add Carousel Item")}
                        </Button>
                        {editingId && (
                            <Button className="mt-4" variant="outline" onClick={resetForm}>
                                Cancel
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Existing Carousel Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Preview</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Association</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Loading state handled by global loader now */}
                            {carouselData?.data.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell>
                                        <img src={item.carousel_url} alt={item.carousel_title} className="h-12 w-20 object-cover rounded shadow-sm" />
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{item.carousel_title}</div>
                                        <div className="text-xs text-muted-foreground line-clamp-1">{item.carousel_description}</div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full capitalize">
                                            {item.carousel_association}
                                            {item.carousel_association?.toLowerCase() === 'brand'
                                                ? ` - ${brandsData?.data?.find(b => b.brand_id === ((typeof item.carousel_brand === 'object' && item.carousel_brand !== null) ? ((item.carousel_brand as any)._id || (item.carousel_brand as any).brand_id) : item.carousel_brand))?.brand_name || ((typeof item.carousel_brand === 'object' && item.carousel_brand !== null) ? (item.carousel_brand as any).brand_name : '') || 'Unknown'}`
                                                : ` - ${categoriesData?.catgoryProducts?.find(c => c.category_id === ((typeof item.carousel_category === 'object' && item.carousel_category !== null) ? ((item.carousel_category as any)._id || (item.carousel_category as any).category_id) : item.carousel_category))?.category_name || ((typeof item.carousel_category === 'object' && item.carousel_category !== null) ? (item.carousel_category as any).category_name : '') || 'Unknown'}`
                                            }
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500" onClick={() => handleEdit(item)}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(item._id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!isLoadingCarousel && (!carouselData?.data || carouselData.data.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">No carousel items found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
