import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Trash2, User as UserIcon, ShieldCheck, UserCheck } from "lucide-react";
import { useToast } from "@/core/hooks/use-toast";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ROUTES } from "@/core/config/routes";
import { Loader } from "@/components/loader/Loader";
import { userService } from "@/features/dashboard/users/services/userService";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { cn } from "@/core/utils";

export default function Users() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"customers" | "admins">("customers");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const itemsPerPage = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getUsers(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  const users = data?.users || [];

  const customerCount = users.filter((u) => u.role === "customer").length;
  const adminCount = users.filter((u) => u.role === "admin" || u.role === "superadmin").length;

  const tabFilteredUsers = users.filter((user) => {
    if (activeTab === "admins") return user.role === "admin" || user.role === "superadmin";
    return user.role === "customer";
  });

  const filteredUsers = tabFilteredUsers.filter((user) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase();
    const email = (user.email || "").toLowerCase();
    const phone = (user.phone_number || "").toLowerCase();
    const role = (user.role || "").toLowerCase();
    return (
      fullName.includes(query) ||
      email.includes(query) ||
      phone.includes(query) ||
      role.includes(query)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleDeleteUser = (id: string) => {
    setUserToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role?.toLowerCase()) {
      case "superadmin":
        return (
          <Badge className="bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 border border-purple-200 capitalize font-semibold shadow-none">
            Super Admin
          </Badge>
        );
      case "admin":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border border-blue-200 capitalize font-semibold shadow-none">
            Admin
          </Badge>
        );
      case "customer":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border border-emerald-200 capitalize font-semibold shadow-none">
            Customer
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="capitalize">
            {role}
          </Badge>
        );
    }
  };

  const getTabInfo = () => {
    if (activeTab === "admins") {
      return {
        title: "Admin & Super Admin Accounts",
        description: "A list of administrative team members and their roles",
      };
    }
    return {
      title: "Customer Accounts",
      description: "A list of registered customer accounts",
    };
  };

  const tabInfo = getTabInfo();

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage your customers, admins, and permissions
          </p>
        </div>

        <Button className="gap-2" onClick={() => navigate(ROUTES.DASHBOARD.USERS_ADD)}>
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Smooth Animated Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative inline-flex p-1.5 bg-muted/80 backdrop-blur rounded-full border border-border/50 shadow-inner w-full sm:w-[360px] h-12">
          {/* Animated Sliding Background Indicator */}
          <div
            className={cn(
              "absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-primary rounded-full shadow-md transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
              activeTab === "customers"
                ? "left-1.5"
                : "left-[calc(50%+3px)]"
            )}
          />

          {/* Tab Button: Customers */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("customers");
              setCurrentPage(1);
            }}
            className={cn(
              "relative z-10 flex-1 inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer select-none",
              activeTab === "customers"
                ? "text-primary-foreground font-bold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <UserCheck className={cn("h-4 w-4 transition-transform duration-200", activeTab === "customers" && "scale-110")} />
            <span>Customers</span>
            <span
              className={cn(
                "ml-1 px-2 py-0.5 text-[11px] font-bold rounded-full transition-all duration-200",
                activeTab === "customers"
                  ? "bg-primary-foreground/20 text-primary-foreground scale-105"
                  : "bg-muted-foreground/15 text-muted-foreground"
              )}
            >
              {customerCount}
            </span>
          </button>

          {/* Tab Button: Admins */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("admins");
              setCurrentPage(1);
            }}
            className={cn(
              "relative z-10 flex-1 inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer select-none",
              activeTab === "admins"
                ? "text-primary-foreground font-bold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ShieldCheck className={cn("h-4 w-4 transition-transform duration-200", activeTab === "admins" && "scale-110")} />
            <span>Admins</span>
            <span
              className={cn(
                "ml-1 px-2 py-0.5 text-[11px] font-bold rounded-full transition-all duration-200",
                activeTab === "admins"
                  ? "bg-primary-foreground/20 text-primary-foreground scale-105"
                  : "bg-muted-foreground/15 text-muted-foreground"
              )}
            >
              {adminCount}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Card with smooth transition */}
      <Card className="transition-all duration-300">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="transition-all duration-200">{tabInfo.title}</CardTitle>
              <CardDescription className="mt-1.5 transition-all duration-200">
                {tabInfo.description}
              </CardDescription>
            </div>
            <div className="relative lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${activeTab}...`}
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
          <div key={activeTab} className="min-w-full inline-block align-middle animate-in fade-in-50 duration-200">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                      {isLoading ? (
                        "Loading users..."
                      ) : searchQuery ? (
                        `No users found matching "${searchQuery}" in ${activeTab}`
                      ) : (
                        `No ${activeTab} found`
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user._id} className="transition-colors hover:bg-muted/40">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {user.first_name?.[0]?.toUpperCase() || <UserIcon className="h-5 w-5" />}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-medium block">{user.first_name} {user.last_name}</span>
                            <span className="text-xs text-muted-foreground md:hidden">{user.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{user.email}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{user.phone_number || "N/A"}</span>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`${ROUTES.DASHBOARD.USERS_EDIT}?id=${user._id}`)}
                            title="Edit user"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteUser(user._id)}
                            disabled={deleteMutation.isPending}
                            title="Delete user"
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
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
        isLoading={deleteMutation.isPending}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
      />

      {isLoading && <Loader fullScreen message="Loading users..." />}
    </div>
  );
}
