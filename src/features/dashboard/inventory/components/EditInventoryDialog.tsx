import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/core/hooks/use-toast";
import { inventoryService } from "../services/inventoryService";
import { InventoryItem } from "../types";

interface EditInventoryDialogProps {
    item: InventoryItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function EditInventoryDialog({ item, open, onOpenChange, onSuccess }: EditInventoryDialogProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        product_stock: 0,
        stock_status: "",
    });

    useEffect(() => {
        if (item) {
            setFormData({
                product_stock: item.product_stock,
                stock_status: item.stock_status,
            });
        }
    }, [item]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!item) return;

        try {
            setIsLoading(true);
            const response = await inventoryService.updateInventory(item._id, formData);
            if (response.success) {
                toast({
                    title: "Success",
                    description: "Inventory updated successfully",
                });
                onSuccess();
                onOpenChange(false);
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update inventory",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Inventory</DialogTitle>
                    <DialogDescription>
                        Update stock level and status for <span className="font-semibold text-foreground">{item?.product_name}</span>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock Level ({item?.dimension_name})</Label>
                            <Input
                                id="stock"
                                type="number"
                                value={formData.product_stock}
                                onChange={(e) => setFormData({ ...formData, product_stock: parseInt(e.target.value) || 0 })}
                                className="bg-background"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Stock Status</Label>
                            <Select
                                value={formData.stock_status}
                                onValueChange={(value) => setFormData({ ...formData, stock_status: value })}
                            >
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="In Stock">In Stock</SelectItem>
                                    <SelectItem value="Low Stock">Low Stock</SelectItem>
                                    <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Updating..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
