import { useState } from 'react';
import { Plus, X, MapPin, Map, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/core/hooks/use-toast";
import { pincodeService } from '../services/pincodeService';
import { Pincode } from '../types';

interface AddAreaDialogProps {
    pincode: Pincode | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function AddAreaDialog({ pincode, open, onOpenChange, onSuccess }: AddAreaDialogProps) {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [areas, setAreas] = useState([{
        name: '',
        city: '',
        lng: '',
        lat: '',
        isActive: true
    }]);

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

    const handleSave = async () => {
        if (!pincode) return;

        // Validation
        const isValid = areas.every(a => 
            a.name.trim() && 
            a.city.trim() && 
            a.lng && !isNaN(parseFloat(a.lng)) && 
            a.lat && !isNaN(parseFloat(a.lat))
        );
        if (!isValid) {
            toast({
                title: "Incomplete Data",
                description: "Please fill in all required fields with valid coordinates for each area.",
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

            const response = await pincodeService.addAreasToPincode(pincode._id, formattedAreas);
            
            if (response.success) {
                toast({
                    title: "Zones Expanded",
                    description: `Successfully added ${areas.length} new service area(s) to ${pincode.pincode}`,
                });
                setAreas([{ name: '', city: '', lng: '', lat: '', isActive: true }]);
                onSuccess();
                onOpenChange(false);
            }
        } catch (error: any) {
            toast({
                title: "Expansion Failed",
                description: error?.response?.data?.message || "Could not add new areas to the pincode.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="p-6 bg-gradient-to-br from-primary/10 via-background to-background border-b border-border/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20">
                            <Map className="w-6 h-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold tracking-tight">Expand Logistics Reach</DialogTitle>
                            <DialogDescription className="text-muted-foreground font-medium mt-1">
                                Adding new subareas to pincode <span className="text-primary font-bold font-mono px-1.5 py-0.5 rounded bg-primary/5 border border-primary/10">{pincode?.pincode}</span>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-muted/5">
                    {areas.map((area, index) => (
                        <div key={index} className="relative group bg-background rounded-2xl border border-border/60 p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
                            <div className="absolute -top-3 left-4 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                                Subarea #{index + 1}
                            </div>
                            
                            {areas.length > 1 && (
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground shadow-sm transition-all opacity-0 group-hover:opacity-100"
                                    onClick={() => handleRemove(index)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground/70 ml-1">Area Name</Label>
                                    <Input 
                                        name="name" 
                                        value={area.name} 
                                        onChange={(e) => handleChange(index, e)} 
                                        placeholder="e.g. Bandra West" 
                                        className="h-11 bg-muted/20 border-border/40 focus:bg-background transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground/70 ml-1">City</Label>
                                    <Input 
                                        name="city" 
                                        value={area.city} 
                                        onChange={(e) => handleChange(index, e)} 
                                        placeholder="e.g. Mumbai" 
                                        className="h-11 bg-muted/20 border-border/40 focus:bg-background transition-colors"
                                    />
                                </div>
                                <div className="space-y-4 md:col-span-2 bg-muted/30 p-4 rounded-xl border border-dashed border-border/60">
                                    <div className="flex items-center gap-2 mb-1">
                                        <MapPin className="w-3.5 h-3.5 text-primary" />
                                        <span className="text-[11px] font-bold uppercase text-primary tracking-tight">Geographic Coordinates</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold text-muted-foreground/80 ml-0.5">LONGITUDE</Label>
                                            <Input 
                                                name="lng" 
                                                type="number" 
                                                step="0.000001"
                                                value={area.lng} 
                                                onChange={(e) => handleChange(index, e)} 
                                                placeholder="72.8777" 
                                                className="h-9 bg-background/80"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold text-muted-foreground/80 ml-0.5">LATITUDE</Label>
                                            <Input 
                                                name="lat" 
                                                type="number" 
                                                step="0.000001"
                                                value={area.lat} 
                                                onChange={(e) => handleChange(index, e)} 
                                                placeholder="19.0760" 
                                                className="h-9 bg-background/80"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-2 flex items-center gap-3 px-2">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={area.isActive}
                                        onChange={(e) => handleChange(index, e as any)}
                                        className="w-4 h-4 rounded-sm border-muted-foreground/30 text-primary focus:ring-primary/30"
                                    />
                                    <Label className="text-sm font-medium text-foreground/80">Active Zone</Label>
                                </div>
                            </div>
                        </div>
                    ))}

                    <Button 
                        variant="outline" 
                        onClick={handleAddMore} 
                        className="w-full h-14 border-dashed border-2 hover:border-primary hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all rounded-2xl gap-2 font-bold uppercase text-xs tracking-widest"
                    >
                        <Plus className="w-5 h-5" />
                        Add Another Sub-Area
                    </Button>
                </div>

                <DialogFooter className="p-6 bg-background border-t border-border/50 gap-3 sm:gap-0">
                    <Button 
                        variant="ghost" 
                        onClick={() => onOpenChange(false)}
                        className="h-12 px-8 font-semibold"
                    >
                        Discard
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className="h-12 px-10 gap-2 shadow-xl shadow-primary/20 transition-all hover:translate-y-[-1px] active:translate-y-[1px] font-bold"
                    >
                        {isSaving ? "Registering Areas..." : "Save Service Zones"}
                        {!isSaving && <Save className="w-4 h-4" />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
