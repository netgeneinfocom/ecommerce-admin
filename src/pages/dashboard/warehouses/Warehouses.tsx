import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Warehouse as WarehouseIcon, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader/Loader";
import { useToast } from "@/core/hooks/use-toast";
import { ROUTES } from "@/core/config/routes";
import { WarehouseTable, warehouseService, Warehouse } from "@/features/dashboard/warehouses";

export default function Warehouses() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const fetchWarehouses = async () => {
        try {
            setIsLoading(true);
            const response = await warehouseService.listWarehouses();
            if (response.success && response.warehouses) {
                setWarehouses(response.warehouses);
            } else {
                setWarehouses([]);
            }
        } catch (error: any) {
            console.error("Error fetching warehouses:", error);
            if (error?.response?.status !== 404) {
                toast({
                    title: "Status Update",
                    description: error?.response?.data?.message || "Successfully accessed warehouses interface",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (warehouse: Warehouse) => {
        navigate(`${ROUTES.DASHBOARD.WAREHOUSES}/edit?id=${warehouse._id}`);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this warehouse?")) return;

        try {
            setIsLoading(true);
            const response = await warehouseService.deleteWarehouse(id);
            if (response.success) {
                toast({
                    title: "Success",
                    description: "Warehouse deleted successfully",
                });
                fetchWarehouses();
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to delete warehouse",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-full overflow-hidden p-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/50">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shadow-md border border-primary/10">
                        <WarehouseIcon className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Logistics & Warehouses</h1>
                        <p className="text-sm text-muted-foreground mt-1 font-medium">
                            Streamline your supply chain and storage facility management
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => navigate(ROUTES.DASHBOARD.WAREHOUSES_ADD)} className="gap-2 shadow-lg hover:shadow-xl transition-all duration-200">
                        <Plus className="w-4 h-4" />
                        Add Warehouse
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <CardTitle>All Warehouses</CardTitle>
                            <CardDescription className="mt-1.5">
                                A complete list of all your registered storage hubs and facilities
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <WarehouseTable 
                        warehouses={warehouses} 
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </CardContent>
            </Card>

            {isLoading && <Loader fullScreen message="Synchronizing logistics network..." />}
        </div>
    );
}
