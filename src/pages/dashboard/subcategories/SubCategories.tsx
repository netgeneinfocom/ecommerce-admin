import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Search, Pencil, Trash2, FolderOpen } from "lucide-react";
import { useToast } from "@/core/hooks/use-toast";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ROUTES } from "@/core/config/routes";
import { subcategoryService, useSubCategoryStore } from "@/features/dashboard/subcategories";

import { Loader } from "@/components/loader/Loader";

interface SubCategory {
  sub_category_id: string;
  sub_category_name: string;
  sub_category_logo: string;
  category_name: string;
  products: number;
}



export default function SubCategories() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setCurrentSubCategory } = useSubCategoryStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const subCatsResponse = await subcategoryService.listSubcategories();

      if (subCatsResponse.success) {
        setSubCategories(subCatsResponse.data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast({
        title: "Error",
        description: "Failed to load subcategories",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };



  const filteredSubCategories = subCategories.filter(subCategory =>
    subCategory.sub_category_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSubCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubCategories = filteredSubCategories.slice(startIndex, startIndex + itemsPerPage);

  const handleDeleteSubCategory = async (id: string) => {
    try {
      // TODO: Call delete API when available
      setSubCategories(subCategories.filter(sub => sub.sub_category_id !== id));
      toast({
        title: "Success",
        description: "SubCategory deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete subcategory",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">SubCategories</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product subcategories
          </p>
        </div>

        <Button className="gap-2" onClick={() => navigate(ROUTES.DASHBOARD.SUBCATEGORIES_ADD)}>
          <Plus className="h-4 w-4" />
          Add SubCategory
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle>All SubCategories</CardTitle>
              <CardDescription className="mt-1.5">
                A list of all product subcategories in your store
              </CardDescription>
            </div>
            <div className="relative lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subcategories..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <div className="min-w-full inline-block align-middle">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">SubCategory</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Products</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      Loading subcategories...
                    </TableCell>
                  </TableRow>
                ) : paginatedSubCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No subcategories found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedSubCategories.map((subCategory) => (
                    <TableRow key={subCategory.sub_category_id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={subCategory.sub_category_logo} alt={subCategory.sub_category_name} />
                            <AvatarFallback>
                              <FolderOpen className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{subCategory.sub_category_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{subCategory.category_name}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm">{subCategory.products}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCurrentSubCategory(subCategory);
                              navigate(`${ROUTES.DASHBOARD.SUBCATEGORIES_EDIT}?id=${subCategory.sub_category_id}`);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSubCategory(subCategory.sub_category_id)}
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
      {isLoading && <Loader fullScreen message="Loading subcategories..." />}
    </div>
  );
}
