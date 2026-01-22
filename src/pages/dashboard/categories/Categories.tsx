import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Search, Pencil, Trash2, FolderOpen } from "lucide-react";
import { useToast } from "@/core/hooks/use-toast";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ROUTES } from "@/core/config/routes";
import { categoryService, useCategoryStore } from "@/features/dashboard/categories";
import { Loader } from "@/components/loader/Loader";
import { DeleteConfirmDialog } from "@/components/shared";

import { useAuth } from "@/features/auth/hooks";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Category {
  category_id: string;
  category_name: string;
  category_logo: string;
  total_subcategories: number;
}

export default function Categories() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setCurrentCategory } = useCategoryStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();

  const canAdd = user?.permission?.[0]?.can_add_records ?? false;
  const canDelete = user?.permission?.[0]?.can_delete_records ?? false;
  const canUpdate = user?.permission?.[0]?.can_update_records ?? false;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await categoryService.listCategories();
      if (response.success) {
        setCategories(response.catgoryProducts);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.category_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      setIsDeleting(true);
      const response = await categoryService.deleteCategory(categoryToDelete);
      if (response.success) {
        setCategories(categories.filter(cat => cat.category_id !== categoryToDelete));
        toast({
          title: "Success",
          description: response.message || "Category deleted successfully"
        });
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || error?.message || "Failed to delete category",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6 max-w-full overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Categories</h1>
            <p className="text-muted-foreground mt-1">
              Manage your product categories
            </p>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={!canAdd ? 0 : -1} className="inline-block">
                <Button
                  className="gap-2"
                  onClick={() => navigate(ROUTES.DASHBOARD.CATEGORIES_ADD)}
                  disabled={!canAdd}
                >
                  <Plus className="h-4 w-4" />
                  Add Category
                </Button>
              </span>
            </TooltipTrigger>
            {!canAdd && (
              <TooltipContent>
                <p>You are {user?.role}, you cannot add records</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle>All Categories</CardTitle>
                <CardDescription className="mt-1.5">
                  A list of all product categories in your store
                </CardDescription>
              </div>
              <div className="relative lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search categories..."
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
                    <TableHead className="w-[250px]">Category</TableHead>
                    <TableHead className="text-center">Sub Categories</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                        Loading categories...
                      </TableCell>
                    </TableRow>
                  ) : paginatedCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                        No categories found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedCategories.map((category) => (
                      <TableRow key={category.category_id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={category.category_logo} alt={category.category_name} />
                              <AvatarFallback>
                                <FolderOpen className="h-5 w-5" />
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{category.category_name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-sm">{category.total_subcategories}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span tabIndex={!canUpdate ? 0 : -1} className="inline-block">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setCurrentCategory(category);
                                      navigate(`${ROUTES.DASHBOARD.CATEGORIES_EDIT}?id=${category.category_id}`);
                                    }}
                                    disabled={!canUpdate}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </span>
                              </TooltipTrigger>
                              {!canUpdate && (
                                <TooltipContent>
                                  <p>You are {user?.role}, you cannot update records</p>
                                </TooltipContent>
                              )}
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span tabIndex={!canDelete ? 0 : -1} className="inline-block">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setCategoryToDelete(category.category_id);
                                      setDeleteDialogOpen(true);
                                    }}
                                    disabled={!canDelete}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </span>
                              </TooltipTrigger>
                              {!canDelete && (
                                <TooltipContent>
                                  <p>You are {user?.role}, you cannot delete records</p>
                                </TooltipContent>
                              )}
                            </Tooltip>
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
        {isLoading && <Loader fullScreen message="Loading categories..." />}

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteCategory}
          isLoading={isDeleting}
          title="Delete Category"
          description="Are you sure you want to delete this category? This cannot be undone."
          confirmText="Delete Category"
        />
      </div>
    </TooltipProvider>
  );
}
