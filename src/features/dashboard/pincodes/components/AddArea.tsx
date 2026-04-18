import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, X, MapPin, Map, Save, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/core/hooks/use-toast";
import { ROUTES } from "@/core/config/routes";
import { pincodeService } from '../services/pincodeService';
import { Loader } from '@/components/loader/Loader';
import { Pincode } from '../types';

export function AddArea() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const pincodeId = searchParams.get('pincode_id');
    const { toast } = useToast();
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [pincode, setPincode] = useState<Pincode | null>(null);
    const [areas, setAreas] = useState([{
        name: '',
        city: '',
        lng: '',
        lat: '',
        isActive: true
    }]);

    useEffect(() => {
        if (pincodeId) {
            fetchPincodeDetails();
        } else {
            toast({
                title: "Error",
                description: "Pincode ID is missing",
                variant: "destructive",
            });
            navigate(ROUTES.DASHBOARD.PINCODES);
        }
    }, [pincodeId]);

    const fetchPincodeDetails = async () => {
        try {
            setIsLoading(true);
            const response = await pincodeService.listPincodes();
            const found = response.data.find(p => p._id === pincodeId);
            if (found) {
                setPincode(found);
            } else {
                toast({
                    title: "Error",
                    description: "Pincode not found",
                    variant: "destructive",
                });
                navigate(ROUTES.DASHBOARD.PINCODES);
            }
        } catch (error) {
            console.error('Error fetching pincode:', error);
            toast({
                title: "Error",
                description: "Failed to fetch pincode details",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddMore = () => {
        setAreas([...areas, {
            name: '',
            city: '',
            lng: '',
            lat: '',
            isActive: true
        }]);
    };

    const handleRemove = (index: number) => {
        if (areas.length === 1) return;
        setAreas(areas.filter((_, i) => i !== index));
    };

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const newAreas = [...areas];
        (newAreas[index] as any)[name] = type === 'checkbox' ? checked : value;
        setAreas(newAreas);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pincodeId) return;

        const isValid = areas.every(a => 
            a.name.trim() && 
            a.city.trim() && 
            a.lng && !isNaN(parseFloat(a.lng)) && 
            a.lat && !isNaN(parseFloat(a.lat))
        );

        if (!isValid) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields with valid coordinates for all areas.",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsSaving(true);
            const formattedAreas = areas.map(a => ({
                name: a.name,
                city: a.city,
                coordinates: [parseFloat(a.lng), parseFloat(a.lat)] as [number, number],
                isActive: a.isActive
            }));

            const response = await pincodeService.addAreasToPincode(pincodeId, formattedAreas);
            
            if (response.success) {
                toast({
                    title: "Zones Expanded",
                    description: `Successfully added ${areas.length} new service area(s) to ${pincode?.pincode}`,
                });
                setTimeout(() => {
                    navigate(ROUTES.DASHBOARD.PINCODES);
                }, 1000);
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to add new areas",
                variant: "destructive",
            });
            setIsSaving(false);
        }
    };

    if (isLoading) return <Loader fullScreen message="Loading pincode details..." />;

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-10">
            {isSaving && <Loader fullScreen message="Expanding your service network..." />}
            
            <Card className="shadow-sm">
                <CardHeader className="border-b border-border bg-muted/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Map className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold tracking-tight">Expand Service Network</CardTitle>
                                <CardDescription className="text-sm font-medium mt-1">
                                    Registering new sub-delivery zones for pincode <span className="text-primary font-bold font-mono px-1.5 py-0.5 rounded bg-primary/5 border border-primary/10">{pincode?.pincode}</span>
                                </CardDescription>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                
                <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            {areas.map((area, index) => (
                                <div key={index} className="relative group bg-muted/5 rounded-2xl border border-border/40 p-6 pt-10 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
                                    <div className="absolute -top-3 left-6 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg z-10">
                                        Subarea #{index + 1}
                                    </div>
                                    
                                    {areas.length > 1 && (
                                        <Button 
                                            type="button"
                                            variant="ghost" 
                                            size="icon" 
                                            className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground shadow-md transition-all opacity-0 group-hover:opacity-100 ring-4 ring-background"
                                            onClick={() => handleRemove(index)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium ml-1">Area Identity / Name</Label>
                                            <Input 
                                                name="name" 
                                                value={area.name} 
                                                onChange={(e) => handleChange(index, e)} 
                                                placeholder="e.g. Bandra West (Shopping Hub)" 
                                                className="h-11 bg-background border-border/60 focus:ring-2 focus:ring-primary/10 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium ml-1">Parent City</Label>
                                            <Input 
                                                name="city" 
                                                value={area.city} 
                                                onChange={(e) => handleChange(index, e)} 
                                                placeholder="e.g. Mumbai" 
                                                className="h-11 bg-background border-border/60 focus:ring-2 focus:ring-primary/10 transition-all"
                                            />
                                        </div>
                                        
                                        <div className="md:col-span-2 bg-background/80 p-5 rounded-xl border border-dashed border-primary/20 space-y-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <MapPin className="w-4 h-4 text-primary" />
                                                </div>
                                                <span className="text-sm font-bold text-primary">Deployment Coordinates</span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold text-muted-foreground/60 uppercase ml-1">Longitude (X)</Label>
                                                    <Input 
                                                        name="lng" 
                                                        type="number" 
                                                        step="0.000001"
                                                        value={area.lng} 
                                                        onChange={(e) => handleChange(index, e)} 
                                                        placeholder="72.8777" 
                                                        className="h-11 bg-muted/20 font-mono"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold text-muted-foreground/60 uppercase ml-1">Latitude (Y)</Label>
                                                    <Input 
                                                        name="lat" 
                                                        type="number" 
                                                        step="0.000001"
                                                        value={area.lat} 
                                                        onChange={(e) => handleChange(index, e)} 
                                                        placeholder="19.0760" 
                                                        className="h-11 bg-muted/20 font-mono"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 flex items-center gap-3 bg-primary/5 p-4 rounded-lg border border-primary/10">
                                            <input
                                                type="checkbox"
                                                name="isActive"
                                                checked={area.isActive}
                                                onChange={(e) => handleChange(index, e as any)}
                                                className="w-4 h-4 rounded border-primary/30 text-primary focus:ring-primary/20 transition-all cursor-pointer"
                                            />
                                            <Label className="text-sm font-medium text-foreground/80 cursor-pointer">Enable immediate delivery services in this zone</Label>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <Button 
                                type="button"
                                variant="outline" 
                                onClick={handleAddMore} 
                                className="w-full h-14 border-dashed border-2 hover:border-primary hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all rounded-xl gap-2 font-bold uppercase text-[10px] tracking-widest shadow-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Add Another Subarea
                            </Button>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 mt-8 border-t border-border/40">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={() => navigate(ROUTES.DASHBOARD.PINCODES)}
                                className="h-11 px-8 font-semibold text-muted-foreground hover:text-foreground transition-all gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isSaving}
                                className="h-11 px-10 gap-2 shadow-lg shadow-primary/20 transition-all hover:translate-y-[-1px] active:translate-y-[0px] font-bold bg-primary hover:bg-primary/90"
                            >
                                {isSaving ? "Registering Areas..." : "Save Service Areas"}
                                {!isSaving && <Save className="w-4 h-4" />}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
