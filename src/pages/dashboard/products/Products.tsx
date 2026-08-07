import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Pencil, Trash2, Package, X } from "lucide-react";
import { useToast } from "@/core/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ROUTES } from "@/core/config/routes";
import { productService, useProductStore, type Product } from "@/features/dashboard/products";
import { brandService } from "@/features/dashboard/brands";
import { categoryService } from "@/features/dashboard/categories";
import { subcategoryService } from "@/features/dashboard/subcategories";
import { Loader } from "@/components/loader/Loader";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Map<string, string>>(new Map());
  const [categories, setCategories] = useState<Map<string, string>>(new Map());
  const [subcategories, setSubcategories] = useState<Map<string, string>>(new Map());
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const itemsPerPage = 10;
  const { toast } = useToast();
  const { setCurrentProduct } = useProductStore();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const queryTrimmed = debouncedSearchQuery.trim();
        const productsPromise = queryTrimmed
          ? productService.searchProducts(queryTrimmed, currentPage, itemsPerPage)
          : productService.listProducts(currentPage, itemsPerPage);

        const [productsRes, brandsRes, categoriesRes, subcategoriesRes] = await Promise.all([
          productsPromise,
          brands.size === 0 ? brandService.listBrands() : Promise.resolve(null),
          categories.size === 0 ? categoryService.listCategories() : Promise.resolve(null),
          subcategories.size === 0 ? subcategoryService.listSubcategories() : Promise.resolve(null),
        ]);

        setProducts(productsRes?.products || []);
        setTotalPages(productsRes?.pagination?.totalPages || 1);

        if (brandsRes?.data) {
          const brandsMap = new Map<string, string>((brandsRes.data || []).map(b => [b.brand_id, b.brand_name]));
          setBrands(brandsMap);
        }
        if (categoriesRes?.catgoryProducts) {
          const categoriesMap = new Map<string, string>((categoriesRes.catgoryProducts || []).map(c => [c.category_id, c.category_name]));
          setCategories(categoriesMap);
        }
        if (subcategoriesRes?.data) {
          const subcategoriesMap = new Map<string, string>((subcategoriesRes.data || []).map(s => [s.sub_category_id, s.sub_category_name]));
          setSubcategories(subcategoriesMap);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, debouncedSearchQuery, toast]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const getBrandName = (brand: Product['product_brand']) => {
    if (!brand) return "-";
    if (typeof brand === 'object' && brand.brand_name) return brand.brand_name;
    if (typeof brand === 'string') return brands.get(brand) || "-";
    return "-";
  };

  const getCategoryName = (category: Product['product_category']) => {
    if (!category) return "-";
    if (typeof category === 'object' && category.category_name) return category.category_name;
    if (typeof category === 'string') return categories.get(category) || "-";
    return "-";
  };

  const getSubCategoryName = (subCategory: Product['product_sub_category']) => {
    if (!subCategory) return "-";
    if (typeof subCategory === 'object' && subCategory.sub_category_name) return subCategory.sub_category_name;
    if (typeof subCategory === 'string') return subcategories.get(subCategory) || "-";
    return "-";
  };

  const handleDeleteProduct = (id: string) => {
    setProductToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      setIsDeleting(true);
      const response = await productService.deleteProduct(productToDelete);
      if (response.success) {
        setProducts(products.filter((p) => p._id !== productToDelete));
        toast({
          title: "Success",
          description: response.message || "Product deleted successfully"
        });
        setIsDeleteDialogOpen(false);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete product",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete product",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product inventory
          </p>
        </div>

        <Button onClick={() => navigate(ROUTES.DASHBOARD.PRODUCTS_ADD)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle>All Products</CardTitle>
              <CardDescription className="mt-1.5">
                A list of all products in your inventory
              </CardDescription>
            </div>
            <div className="relative lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10 pr-10"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-sm focus:outline-none"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <div className="min-w-full inline-block align-middle">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sub Category</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Final Price</TableHead>
                  <TableHead>Badges</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                      Loading products...
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={product.avatar} alt={product.product_name} />
                            <AvatarFallback>
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{product.product_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getBrandName(product.product_brand)}</TableCell>
                      <TableCell>{getCategoryName(product.product_category)}</TableCell>
                      <TableCell>{getSubCategoryName(product.product_sub_category)}</TableCell>
                      <TableCell>{product.manufacturer || "-"}</TableCell>
                      <TableCell>₹{product.product_price.toFixed(2)}</TableCell>
                      <TableCell className="text-red-600 font-medium">{product.discount_precentage}%</TableCell>
                      <TableCell className="font-semibold text-emerald-600">₹{product.final_price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {(product.isNew === true || product.isNew === "1" || product.isNew === "true") && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600">
                              New
                            </span>
                          )}
                          {(product.sales === true || product.sales === "1" || product.sales === "true") && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                              Sale
                            </span>
                          )}
                          {(product.featured === true || product.featured === "1" || product.featured === "true") && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-600">
                              Featured
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCurrentProduct(product);
                              navigate(ROUTES.DASHBOARD.PRODUCTS_EDIT(product._id));
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {totalPages > 1 && (
          <div className="p-4 border-t">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
      />

      {isLoading && <Loader fullScreen message="Loading products..." />}
    </div>
  );
}
