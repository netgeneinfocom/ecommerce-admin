import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader/Loader";
import { useToast } from "@/core/hooks/use-toast";
import { ROUTES } from "@/core/config/routes";
import { PincodeTable, pincodeService, Pincode, Area } from "@/features/dashboard/pincodes";

export default function Pincodes() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [pincodes, setPincodes] = useState<Pincode[]>([]);

    useEffect(() => {
        fetchPincodes();
    }, []);

    const fetchPincodes = async () => {
        try {
            setIsLoading(true);
            const response = await pincodeService.listPincodes();
            if (response.success && response.data) {
                setPincodes(response.data);
            } else {
                setPincodes([]);
            }
        } catch (error: any) {
            console.error("Error fetching pincodes:", error);
            if (error?.response?.status !== 404) {
                toast({
                    title: "Network Status",
                    description: "Synchronizing with service area database...",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (pincode: Pincode) => {
        navigate(`${ROUTES.DASHBOARD.PINCODES_EDIT}?id=${pincode._id}`);
    };

    const handleAddArea = (pincode: Pincode) => {
        navigate(`${ROUTES.DASHBOARD.AREA_ADD}?pincode_id=${pincode._id}`);
    };

    const handleEditArea = (area: Area) => {
        navigate(`${ROUTES.DASHBOARD.AREA_EDIT}?id=${area._id}`);
    };

    const handleDeleteArea = async (areaId: string) => {
        if (!confirm("Are you sure you want to remove this specific suburb area?")) return;
        
        try {
            setIsLoading(true);
            const response = await pincodeService.deleteArea(areaId);
            if (response.success) {
                toast({
                    title: "Area Removed",
                    description: "Individual area deleted successfully",
                });
                fetchPincodes();
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete area",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Removing this pincode will delete all its associated suburb areas. Proceed?")) return;
        
        try {
            setIsLoading(true);
            const response = await pincodeService.deletePincode(id);
            if (response.success) {
                toast({
                    title: "Pincode Removed",
                    description: "Pincode and all its areas have been deleted successfully",
                });
                fetchPincodes();
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete pincode",
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
                        <MapPin className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Servable Pincodes</h1>
                        <p className="text-sm text-muted-foreground mt-1 font-medium">
                            Manage the geographic areas where your logistics network is active
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => navigate(ROUTES.DASHBOARD.PINCODES_ADD)} className="gap-2 shadow-lg hover:shadow-xl transition-all duration-200">
                        <Plus className="w-4 h-4" />
                        Add Pincode
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <CardTitle>Active Service Areas</CardTitle>
                            <CardDescription className="mt-1.5">
                                A list of all pincodes currently supported by your delivery fleet
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <PincodeTable 
                        pincodes={pincodes} 
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onDeleteArea={handleDeleteArea}
                        onEditArea={handleEditArea}
                        onAddArea={handleAddArea}
                    />
                </CardContent>
            </Card>

            {isLoading && <Loader fullScreen message="Updating service network..." />}
        </div>
    );
}
