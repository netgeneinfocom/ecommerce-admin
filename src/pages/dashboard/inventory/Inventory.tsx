import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Loader } from "@/components/loader/Loader";
import { ManageUnitsDialog, inventoryService, AddInventory, ManageSuppliersDialog } from "@/features/dashboard/inventory";
import { InventoryItem } from "@/features/dashboard/inventory/types";
import { useToast } from "@/core/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Inventory() {
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [stockFilter, setStockFilter] = useState<string>("all");
    const [availableUnits, setAvailableUnits] = useState<string[]>([]);
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeTab, setActiveTab] = useState("show-inventory");

    useEffect(() => {
        if (activeTab === "show-inventory") {
            fetchInventory();
        }
    }, [currentPage, activeTab]);

    const fetchInventory = async () => {
        try {
            setIsLoading(true);
            const response = await inventoryService.listInventory({
                page: currentPage,
                limit: 5,
            });
            if (response.success) {
                setInventoryItems(response.data);
                setTotalPages(response.totalPages);
            }
        } catch (error: any) {
            console.error("Error fetching inventory:", error);
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to load inventory",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getStockStatusKey = (status: string): "in_stock" | "low_stock" | "out_of_stock" => {
        const normalizedStatus = status.toLowerCase().replace(/\s+/g, '_');
        if (normalizedStatus.includes('out')) return 'out_of_stock';
        if (normalizedStatus.includes('low')) return 'low_stock';
        return 'in_stock';
    };

    const filteredItems = inventoryItems.filter(item => {
        const matchesSearch = item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.product_code.toLowerCase().includes(searchQuery.toLowerCase());

        const stockStatusKey = getStockStatusKey(item.stock_status);
        const matchesStockFilter = stockFilter === "all" ||
            (stockFilter === "in_stock" && stockStatusKey === "in_stock") ||
            (stockFilter === "low_stock" && stockStatusKey === "low_stock") ||
            (stockFilter === "out_of_stock" && stockStatusKey === "out_of_stock");

        return matchesSearch && matchesStockFilter;
    });

    return (
        <div className="space-y-6 max-w-full overflow-hidden">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your product inventory and Generate purchase bills
                    </p>
                </div>
                <div className="flex gap-2">
                    <ManageSuppliersDialog />
                    <ManageUnitsDialog
                        onUnitsChange={setAvailableUnits}
                    />
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-fit h-9 p-1 bg-muted/80 rounded-lg mb-8 flex justify-start gap-1">
                    <TabsTrigger
                        value="show-inventory"
                        className="px-4 py-1.5 text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all"
                    >
                        Show Inventory
                    </TabsTrigger>
                    <TabsTrigger
                        value="add-inventory"
                        className="px-4 py-1.5 text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all"
                    >
                        Add Inventory
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="show-inventory" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div>
                                    <CardTitle>Product Inventory</CardTitle>
                                    <CardDescription className="mt-1.5">
                                        Track product stock levels
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-muted-foreground">Filters:</span>
                                        <Select value={stockFilter} onValueChange={setStockFilter}>
                                            <SelectTrigger className="w-[200px]">
                                                <SelectValue placeholder="All Stock Levels" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Stock Levels</SelectItem>
                                                <SelectItem value="in_stock">In Stock</SelectItem>
                                                <SelectItem value="low_stock">Low Stock (&lt; 10)</SelectItem>
                                                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="relative lg:w-80">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search products..."
                                            className="pl-10"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="overflow-x-auto p-0">
                            <div className="min-w-full inline-block align-middle">
                                <Table className="w-full">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>PRODUCT</TableHead>
                                            <TableHead>SKU</TableHead>
                                            <TableHead>STOCK LEVEL</TableHead>
                                            <TableHead>STATUS</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredItems.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                                    No products found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredItems.map((item) => {
                                                const stockStatusKey = getStockStatusKey(item.stock_status);
                                                return (
                                                    <TableRow key={item._id}>
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <img
                                                                    src={item.product_url}
                                                                    alt={item.product_name}
                                                                    className="w-12 h-12 rounded-md object-cover"
                                                                />
                                                                <div>
                                                                    <div className="font-medium">{item.product_name}</div>
                                                                    <div className="text-sm text-muted-foreground">{item.dimension_name}</div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">{item.product_code}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium">
                                                                    {item.product_stock} {item.dimension_name}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {stockStatusKey === "in_stock" && (
                                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none shadow-none font-medium">
                                                                    In Stock
                                                                </Badge>
                                                            )}
                                                            {stockStatusKey === "low_stock" && (
                                                                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none shadow-none font-medium">
                                                                    Low Stock
                                                                </Badge>
                                                            )}
                                                            {stockStatusKey === "out_of_stock" && (
                                                                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none shadow-none font-medium">
                                                                    Out of Stock
                                                                </Badge>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {totalPages > 1 && (
                        <Pagination className="mt-4">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>

                                {[...Array(totalPages)].map((_, i) => {
                                    const page = i + 1;
                                    return (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                isActive={currentPage === page}
                                                onClick={() => setCurrentPage(page)}
                                                className="cursor-pointer"
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </TabsContent>

                <TabsContent value="add-inventory">
                    <AddInventory />
                </TabsContent>
            </Tabs>

            {isLoading && <Loader fullScreen message="Loading inventory..." />}
        </div>
    );
}
