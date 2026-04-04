import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, MapPin, Truck, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/core/hooks/use-toast";
import { ROUTES } from "@/core/config/routes";
import { pincodeService } from '../services/pincodeService';
import { Loader } from '@/components/loader/Loader';
import { CreateAreaData } from '../types';

export function AddPincode() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [pincode, setPincode] = useState('');
    const [areas, setAreas] = useState<CreateAreaData[]>([
        { name: '', city: '', coordinates: [0, 0] }
    ]);

    const handleAreaChange = (index: number, field: keyof CreateAreaData | 'lng' | 'lat', value: string) => {
        const newAreas = [...areas];
        if (field === 'lng') {
            newAreas[index].coordinates[0] = parseFloat(value) || 0;
        } else if (field === 'lat') {
            newAreas[index].coordinates[1] = parseFloat(value) || 0;
        } else {
            (newAreas[index] as any)[field] = value;
        }
        setAreas(newAreas);
    };

    const addArea = () => {
        setAreas([...areas, { name: '', city: '', coordinates: [0, 0] }]);
    };

    const removeArea = (index: number) => {
        if (areas.length > 1) {
            setAreas(areas.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!pincode || areas.some(a => !a.name || !a.city)) {
            toast({
                title: "Validation Error",
                description: "Please fill in pincode and all area details",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsSaving(true);
            const pincodeData = {
                pincode,
                areas
            };

            const response = await pincodeService.addPincode(pincodeData);

            if (response.success) {
                toast({
                    title: "Network Expanded",
                    description: response.message || "Pincode and areas registered successfully",
                });

                setTimeout(() => {
                    navigate(ROUTES.DASHBOARD.PINCODES);
                }, 1000);
            }
        } catch (error: any) {
            toast({
                title: "Registration Failed",
                description: error?.response?.data?.message || "Failed to add pincode network",
                variant: "destructive",
            });
            setIsSaving(false);
        }
    };

    return (
        <Card className="max-w-4xl mx-auto shadow-sm">
            {isSaving && <Loader fullScreen message="Expanding delivery network..." />}
            <CardHeader className="border-b border-border bg-muted/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Register Service Network</CardTitle>
                            <CardDescription>Link multiple sub-areas to a single pincode for delivery services.</CardDescription>
                        </div>
                    </div>
                    <div className="w-32">
                        <Label htmlFor="pincode" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pincode</Label>
                        <Input
                            id="pincode"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            placeholder="191111"
                            className="h-10 mt-1 border-primary/20"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {areas.map((area, index) => (
                        <div key={index} className="relative p-6 border rounded-xl bg-card hover:border-primary/30 transition-all duration-300">
                            {areas.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md"
                                    onClick={() => removeArea(index)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground">Area Name</Label>
                                    <Input
                                        value={area.name}
                                        onChange={(e) => handleAreaChange(index, 'name', e.target.value)}
                                        placeholder="Lal Chowk"
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground">City</Label>
                                    <Input
                                        value={area.city}
                                        onChange={(e) => handleAreaChange(index, 'city', e.target.value)}
                                        placeholder="Srinagar"
                                        className="h-10"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground">Longitude</Label>
                                    <Input
                                        type="number"
                                        step="0.0001"
                                        value={area.coordinates[0] || ''}
                                        onChange={(e) => handleAreaChange(index, 'lng', e.target.value)}
                                        placeholder="77.2167"
                                        className="h-10 bg-muted/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground">Latitude</Label>
                                    <Input
                                        type="number"
                                        step="0.0001"
                                        value={area.coordinates[1] || ''}
                                        onChange={(e) => handleAreaChange(index, 'lat', e.target.value)}
                                        placeholder="28.6333"
                                        className="h-10 bg-muted/20"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={addArea}
                            className="w-full md:w-auto gap-2 border-dashed h-11 px-8 hover:bg-primary/5 hover:text-primary transition-all transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Another Area
                        </Button>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => navigate(ROUTES.DASHBOARD.PINCODES)}
                                className="h-11 px-8"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSaving} className="h-11 px-12 gap-2 shadow-lg hover:shadow-xl transition-all duration-300">
                                {isSaving ? "Synchronizing..." : "Add Service Area"}
                                {!isSaving && <Save className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
