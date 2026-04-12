import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Users, Plus, Loader2, Trash2 } from "lucide-react";
import { inventoryService } from "../services/inventoryService";
import { useToast } from "@/core/hooks/use-toast";
import { AddSupplierParams, Supplier } from "../types";
import { useEffect } from "react";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";

export function ManageSuppliersDialog() {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [formData, setFormData] = useState<AddSupplierParams>({
        name: "",
        email: "",
        phone: "",
    });
    const [isDeleting, setIsDeleting] = useState(false);
    const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        if (open) {
            fetchSuppliers();
        }
    }, [open]);

    const fetchSuppliers = async () => {
        setIsLoading(true);
        try {
            const data = await inventoryService.getSuppliers();
            setSuppliers(data || []);
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSupplier = async () => {
        if (!formData.name.trim()) {
            toast({
                title: "Error",
                description: "Please enter a supplier name",
                variant: "destructive",
            });
            return;
        }

        setIsAdding(true);
        try {
            const response = await inventoryService.addSupplier(formData);

            if (response.success) {
                setFormData({ name: "", email: "", phone: "" });
                toast({
                    title: "Success",
                    description: response.message || "Supplier added successfully",
                });
                await fetchSuppliers();
            }
        } catch (error: any) {
            console.error("Error adding supplier:", error);
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to add supplier",
                variant: "destructive",
            });
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteSupplier = (supplier: Supplier) => {
        setSupplierToDelete(supplier);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!supplierToDelete?._id) return;

        setIsDeleting(true);
        try {
            const response = await inventoryService.deleteSupplier(supplierToDelete._id);
            if (response.success) {
                toast({
                    title: "Success",
                    description: response.message || "Supplier deleted successfully",
                });
                await fetchSuppliers();
            }
        } catch (error: any) {
            console.error("Error deleting supplier:", error);
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to delete supplier",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
            setSupplierToDelete(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 bg-white hover:bg-primary hover:text-white shadow-sm">
                    <Users className="h-4 w-4" />
                    Add Supplier
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            <DialogTitle>Add New Supplier</DialogTitle>
                        </div>
                    </div>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input
                                name="name"
                                placeholder="Supplier Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                name="email"
                                type="email"
                                placeholder="contact@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone</label>
                            <Input
                                name="phone"
                                placeholder="+1234567890"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddSupplier}
                            disabled={isAdding}
                            className="gap-2"
                        >
                            {isAdding ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Plus className="h-4 w-4" />
                            )}
                            Add Supplier
                        </Button>
                    </div>

                    <div className="mt-8 space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase">Current Suppliers</h3>
                        <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                            {isLoading ? (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                            ) : (
                                suppliers.map((supplier) => (
                                    <div key={supplier._id} className="flex items-center justify-between p-3 rounded-lg border bg-background hover:bg-accent/50 transition-colors">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{supplier.name}</span>
                                            <span className="text-xs text-muted-foreground">{supplier.email}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => handleDeleteSupplier(supplier)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <DeleteConfirmDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    onConfirm={confirmDelete}
                    isLoading={isDeleting}
                    title="Delete Supplier"
                    description={`Are you sure you want to delete "${supplierToDelete?.name}"? This action cannot be undone.`}
                />
            </DialogContent>
        </Dialog>
    );
}
