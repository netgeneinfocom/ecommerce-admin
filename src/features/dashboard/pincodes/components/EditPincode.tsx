import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Save, MapPin, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from "@/core/hooks/use-toast";
import { ROUTES } from "@/core/config/routes";
import { pincodeService } from '../services/pincodeService';
import { Loader } from '@/components/loader/Loader';
import { Pincode } from '../types';

export function EditPincode() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const pincodeId = searchParams.get('id');
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [pincode, setPincode] = useState<Pincode | null>(null);
    const [pincodeValue, setPincodeValue] = useState('');
    const [isActive, setIsActive] = useState(true);

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
                setPincodeValue(found.pincode);
                setIsActive(found.isActive);
            } else {
                toast({
                    title: "Error",
                    description: "Pincode not found",
                    variant: "destructive",
                });
                navigate(ROUTES.DASHBOARD.PINCODES);
            }
        } catch (error) {
            console.error('Error fetching pincode details:', error);
            toast({
                title: "Error",
                description: "Failed to fetch details",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!pincodeValue) {
            toast({
                title: "Error",
                description: "Pincode cannot be empty",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsSaving(true);
            const response = await pincodeService.updatePincodeStatus(pincodeId!, {
                pincode: pincodeValue,
                isActive: isActive
            });

            if (response.success) {
                toast({
                    title: "Success",
                    description: "Pincode updated successfully",
                });

                setTimeout(() => {
                    navigate(ROUTES.DASHBOARD.PINCODES);
                }, 1000);
            }
        } catch (error: any) {
            console.error('Error updating pincode:', error);
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to update pincode",
                variant: "destructive",
            });
            setIsSaving(false);
        }
    };

    if (isLoading) return <Loader fullScreen message="Fetching system status..." />;

    return (
        <Card className="max-w-xl mx-auto shadow-sm overflow-hidden border-border/60">
            {isSaving && <Loader fullScreen message="Updating network permissions..." />}
            <CardHeader className="border-b border-border bg-muted/5">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                        {isActive ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold tracking-tight">Edit Pincode: {pincode?.pincode}</CardTitle>
                        <CardDescription>Manage delivery hub details and global availability</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="pincode-value" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Pincode Number</Label>
                            <input
                                id="pincode-value"
                                type="text"
                                value={pincodeValue}
                                onChange={(e) => setPincodeValue(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-lg font-mono font-bold tracking-widest text-primary"
                                placeholder="e.g. 110001"
                            />
                        </div>

                        <div className="bg-background border rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center justify-between gap-6">
                                <div className="space-y-1">
                                    <Label className="text-base font-bold">Network Availability</Label>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        When disabled, all sub-areas under this hub will be marked as non-servable.
                                    </p>
                                </div>
                                <div className="relative inline-flex h-7 w-14 items-center">
                                    <input
                                        type="checkbox"
                                        id="pincode-status"
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <label
                                        htmlFor="pincode-status"
                                        className="inline-block h-7 w-14 cursor-pointer rounded-full bg-muted transition-colors peer-checked:bg-primary"
                                    />
                                    <span className="pointer-events-none absolute left-1 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-7" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="ghost" className="px-6" onClick={() => navigate(ROUTES.DASHBOARD.PINCODES)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSaving} className="px-8 gap-2 shadow-lg hover:shadow-xl transition-all">
                                {isSaving ? "Synchronizing..." : "Save Changes"}
                                {!isSaving && <Save className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
