import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Warehouse as WarehouseIcon, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/core/hooks/use-toast";
import { ROUTES } from "@/core/config/routes";
import { warehouseService } from '../services/warehouseService';
import { Loader } from '@/components/loader/Loader';

export function AddWarehouse() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        lng: '',
        lat: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.address || !formData.city || !formData.state || !formData.country || !formData.pincode || !formData.lng || !formData.lat) {
            toast({
                title: "Error",
                description: "Please fill in all fields",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsSaving(true);
            const warehouseData = {
                name: formData.name,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                pincode: formData.pincode,
                coordinates: [parseFloat(formData.lng), parseFloat(formData.lat)] as [number, number]
            };

            const response = await warehouseService.addWarehouse(warehouseData);

            if (response.success) {
                toast({
                    title: "Success",
                    description: response.message || "Warehouse added successfully",
                });

                // Navigate back to the list page after successful addition
                setTimeout(() => {
                    navigate(ROUTES.DASHBOARD.WAREHOUSES);
                }, 1000);
            }
        } catch (error: any) {
            console.error('Error adding warehouse:', error);
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to add warehouse",
                variant: "destructive",
            });
            setIsSaving(false); // Stop loading if error occurs
        }
    };

    return (
        <Card className="max-w-3xl mx-auto shadow-sm">
            {isSaving && <Loader fullScreen message="Adding warehouse..." />}
            <CardHeader className="border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <WarehouseIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-xl">Add New Warehouse</CardTitle>
                        <CardDescription>Enter details to register a new storage facility in the system</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">Warehouse Name</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Main Warehouse" className="h-11" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pincode" className="text-sm font-medium">Pincode</Label>
                            <Input id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="e.g. 10001" className="h-11" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-medium">Full Address</Label>
                        <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Street address, Industrials, etc." className="h-11" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="city" className="text-sm font-medium">City</Label>
                            <Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Srinagar   " className="h-11" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state" className="text-sm font-medium">State</Label>
                            <Input id="state" name="state" value={formData.state} onChange={handleChange} placeholder="e.g. J&K" className="h-11" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country" className="text-sm font-medium">Country</Label>
                            <Input id="country" name="country" value={formData.country} onChange={handleChange} placeholder="e.g. India" className="h-11" />
                        </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg space-y-4">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            Geographic Coordinates
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="lng" className="text-sm font-medium">Longitude</Label>
                                <Input id="lng" name="lng" type="number" step="0.000001" value={formData.lng} onChange={handleChange} placeholder="-74.0060" className="h-11 bg-background" />
                                <p className="text-[10px] text-muted-foreground">Standard longitude coordinate</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lat" className="text-sm font-medium">Latitude</Label>
                                <Input id="lat" name="lat" type="number" step="0.000001" value={formData.lat} onChange={handleChange} placeholder="40.7128" className="h-11 bg-background" />
                                <p className="text-[10px] text-muted-foreground">Standard latitude coordinate</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 gap-4">
                        <Button type="button" variant="outline" className="h-11 px-8" onClick={() => setFormData({ name: '', address: '', city: '', state: '', country: '', pincode: '', lng: '', lat: '' })}>
                            Clear Form
                        </Button>
                        <Button type="submit" disabled={isSaving} className="h-11 px-10 gap-2">
                            {isSaving ? "Adding..." : "Save Warehouse"}
                            {!isSaving && <Save className="w-4 h-4" />}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}


