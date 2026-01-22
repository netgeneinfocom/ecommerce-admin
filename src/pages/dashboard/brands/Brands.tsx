import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Search, Pencil, Trash2, Package } from "lucide-react";
import { useToast } from "@/core/hooks/use-toast";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ROUTES } from "@/core/config/routes";
import { brandService, useBrandStore } from "@/features/dashboard/brands";
import { Loader } from "@/components/loader/Loader";

import { Brand as BrandType } from "@/features/dashboard/brands/types";

export default function Brand() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setCurrentBrand } = useBrandStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [brands, setBrands] = useState<BrandType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setIsLoading(true);
      const response = await brandService.listBrands();
      if (response.success) {
        setBrands(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch brands:", error);
      toast({
        title: "Error",
        description: "Failed to load brands",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBrands = brands.filter(brand =>
    brand.brand_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBrands = filteredBrands.slice(startIndex, startIndex + itemsPerPage);

  const handleDeleteBrand = async (id: string) => {
    try {
      // TODO: Call delete API when available
      setBrands(brands.filter(brand => brand.brand_id !== id));
      toast({
        title: "Success",
        description: "Brand deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete brand",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Brands</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product brands
          </p>
        </div>

        <Button className="gap-2" onClick={() => navigate(ROUTES.DASHBOARD.BRAND_ADD)}>
          <Plus className="h-4 w-4" />
          Add Brand
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle>All Brands</CardTitle>
              <CardDescription className="mt-1.5">
                A list of all product brands in your store
              </CardDescription>
            </div>
            <div className="relative lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search brands..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <div className="min-w-full inline-block align-middle">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Brand</TableHead>
                  <TableHead className="text-center">Products</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      Loading brands...
                    </TableCell>
                  </TableRow>
                ) : paginatedBrands.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      No brands found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedBrands.map((brand) => (
                    <TableRow key={brand.brand_id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={brand.brand_logo} alt={brand.brand_name} />
                            <AvatarFallback>
                              <Package className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{brand.brand_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-muted-foreground">{brand.total_products}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCurrentBrand(brand);
                              navigate(`${ROUTES.DASHBOARD.BRAND_EDIT}?id=${brand.brand_id}`);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteBrand(brand.brand_id)}
                          >
                            <Trash2 className="h-4 w-4" />
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
      {isLoading && <Loader fullScreen message="Loading brands..." />}
    </div>
  );
}
