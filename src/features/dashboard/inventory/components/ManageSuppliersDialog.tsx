import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Users, Plus, Loader2 } from "lucide-react";
import { inventoryService } from "../services/inventoryService";
import { useToast } from "@/core/hooks/use-toast";
import { AddSupplierParams } from "../types";

export function ManageSuppliersDialog() {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState<AddSupplierParams>({
        name: "",
        email: "",
        phone: "",
    });

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
                setOpen(false);
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
                </div>
            </DialogContent>
        </Dialog>
    );
}
