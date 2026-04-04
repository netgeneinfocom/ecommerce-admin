import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Save, MapPin, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/core/hooks/use-toast";
import { ROUTES } from "@/core/config/routes";
import { pincodeService } from '../services/pincodeService';
import { Loader } from '@/components/loader/Loader';
import { Pincode, Area } from '../types';

export function EditArea() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const areaId = searchParams.get('id');
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        lng: '',
        lat: '',
        isActive: true
    });

    useEffect(() => {
        if (areaId) {
            fetchAreaDetails();
        } else {
            toast({
                title: "Error",
                description: "Area ID is missing",
                variant: "destructive",
            });
            navigate(ROUTES.DASHBOARD.PINCODES);
        }
    }, [areaId]);

    const fetchAreaDetails = async () => {
        try {
            setIsLoading(true);
            const response = await pincodeService.listPincodes();
            
            // Find the area within all pincodes
            let areaFound: Area | undefined;
            for (const p of response.data) {
                const a = p.areas.find(a => a._id === areaId);
                if (a) {
                    areaFound = a;
                    break;
                }
            }
            
            if (areaFound) {
                setFormData({
                    name: areaFound.name,
                    city: areaFound.city,
                    lng: areaFound.location.coordinates[0].toString(),
                    lat: areaFound.location.coordinates[1].toString(),
                    isActive: areaFound.isActive
                });
            } else {
                toast({
                    title: "Error",
                    description: "Suburb area not found",
                    variant: "destructive",
                });
                navigate(ROUTES.DASHBOARD.PINCODES);
            }
        } catch (error) {
            console.error('Error fetching area details:', error);
            toast({
                title: "Error",
                description: "Failed to fetch area details",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.city || !formData.lng || !formData.lat) {
            toast({
                title: "Error",
                description: "Please fill in all fields",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsSaving(true);
            const updateData = {
                name: formData.name,
                city: formData.city,
                coordinates: [parseFloat(formData.lng), parseFloat(formData.lat)] as [number, number],
                isActive: formData.isActive
            };

            const response = await pincodeService.updateArea(areaId!, updateData);

            if (response.success) {
                toast({
                    title: "Success",
                    description: response.message || "Suburb area updated successfully",
                });

                setTimeout(() => {
                    navigate(ROUTES.DASHBOARD.PINCODES);
                }, 1000);
            }
        } catch (error: any) {
            console.error('Error updating area:', error);
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update area",
                variant: "destructive",
            });
            setIsSaving(false);
        }
    };

    if (isLoading) return <Loader fullScreen message="Fetching suburb details..." />;

    return (
        <Card className="max-w-3xl mx-auto shadow-sm">
            {isSaving && <Loader fullScreen message="Updating suburb data..." />}
            <CardHeader className="border-b border-border bg-muted/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Map className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-xl">Edit Suburb Area</CardTitle>
                        <CardDescription>Modify name and geographic coordinates for this specific delivery zone</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">Area Name</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Connaught Place" className="h-11" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="city" className="text-sm font-medium">City</Label>
                            <Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="e.g. New Delhi" className="h-11" />
                        </div>
                    </div>

                    <div className="bg-muted/30 p-5 rounded-xl border border-primary/5 space-y-4">
                        <h4 className="text-sm font-bold flex items-center gap-2 text-primary">
                            <MapPin className="w-4 h-4" />
                            Precise Location Coordinates
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="lng" className="text-xs uppercase font-bold text-muted-foreground">Longitude</Label>
                                <Input id="lng" name="lng" type="number" step="0.000001" value={formData.lng} onChange={handleChange} placeholder="77.2167" className="h-11 bg-background" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lat" className="text-xs uppercase font-bold text-muted-foreground">Latitude</Label>
                                <Input id="lat" name="lat" type="number" step="0.000001" value={formData.lat} onChange={handleChange} placeholder="28.6333" className="h-11 bg-background" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 bg-muted/20 p-4 rounded-lg border border-dashed">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData(p => ({ ...p, isActive: e.target.checked }))}
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
                            Mark as active and enable delivery services in this zone
                        </Label>
                    </div>

                    <div className="flex justify-end pt-4 gap-4">
                        <Button type="button" variant="ghost" className="h-11 px-8" onClick={() => navigate(ROUTES.DASHBOARD.PINCODES)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSaving} className="h-11 px-12 gap-2 shadow-md hover:shadow-lg transition-all duration-300">
                            {isSaving ? "Synchronizing..." : "Update Service Zone"}
                            {!isSaving && <Save className="w-4 h-4" />}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
