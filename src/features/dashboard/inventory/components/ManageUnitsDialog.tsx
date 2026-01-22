import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tag, Plus, Loader2 } from "lucide-react";
import { dimensionService } from "../services";
import { useToast } from "@/core/hooks/use-toast";

interface ManageUnitsDialogProps {
    onUnitsChange?: (units: string[]) => void;
}

export function ManageUnitsDialog({ onUnitsChange }: ManageUnitsDialogProps) {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [units, setUnits] = useState<string[]>([]);
    const [newUnit, setNewUnit] = useState("");
    const [isAddingUnit, setIsAddingUnit] = useState(false);
    const [isLoadingUnits, setIsLoadingUnits] = useState(false);

    // Fetch units from database
    useEffect(() => {
        if (open) {
            fetchMetrics();
        }
    }, [open]);

    const fetchMetrics = async () => {
        setIsLoadingUnits(true);
        try {
            const response = await dimensionService.getMetrics();
            if (response.success) {
                const dimensionNames = response.metrics.map(metric => metric.dimension_name.toLowerCase());
                setUnits(dimensionNames);
                onUnitsChange?.(dimensionNames);
            }
        } catch (error: any) {
            console.error("Error fetching metrics:", error);
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to load dimensions",
                variant: "destructive",
            });
        } finally {
            setIsLoadingUnits(false);
        }
    };

    const handleAddUnit = async () => {
        if (!newUnit.trim()) {
            toast({
                title: "Error",
                description: "Please enter a unit name",
                variant: "destructive",
            });
            return;
        }

        if (units.includes(newUnit.trim().toLowerCase())) {
            toast({
                title: "Error",
                description: "This unit already exists",
                variant: "destructive",
            });
            return;
        }

        setIsAddingUnit(true);
        try {
            const response = await dimensionService.addMetrics({
                dimension_name: newUnit.trim(),
            });

            if (response.success) {
                setNewUnit("");
                toast({
                    title: "Success",
                    description: response.message || "Dimension added successfully",
                });
                // Refetch all metrics to ensure we have the latest data
                await fetchMetrics();
            }
        } catch (error: any) {
            console.error("Error adding metrics:", error);
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to add dimension",
                variant: "destructive",
            });
        } finally {
            setIsAddingUnit(false);
        }
    };


    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleAddUnit();
        }
    };

    const handleDone = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 bg-white hover:bg-primary hover:text-white shadow-sm">
                    <Tag className="h-4 w-4" />
                    Manage Units
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Tag className="h-5 w-5 text-primary" />
                            <DialogTitle>Manage Units</DialogTitle>
                        </div>
                    </div>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {/* Add Unit Input */}
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="New unit (e.g. box)"
                            value={newUnit}
                            onChange={(e) => setNewUnit(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-1"
                            disabled={isAddingUnit}
                        />
                        <Button
                            onClick={handleAddUnit}
                            size="icon"
                            className="shrink-0"
                            disabled={isAddingUnit}
                        >
                            {isAddingUnit ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Plus className="h-4 w-4" />
                            )}
                        </Button>
                    </div>

                    {/* Available Dimensions */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase">
                            Available Dimensions
                        </h4>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                            {isLoadingUnits ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : units.length > 0 ? (
                                units.map((unit, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 rounded-lg border bg-background hover:bg-accent/50 transition-colors"
                                    >
                                        <span className="text-sm font-medium">{unit}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-sm text-muted-foreground">
                                    No units added yet. Add your first unit above.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Done Button */}
                    <div className="flex justify-end pt-2">
                        <Button onClick={handleDone}>
                            Done
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
