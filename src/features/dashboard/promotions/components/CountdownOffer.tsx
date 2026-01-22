import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ShoppingBasket, Save, Calendar as CalendarIcon, Clock, CheckCircle2 } from "lucide-react";
import { CountdownConfig, PromotionAssociation } from "../types";
import { useQuery } from "@tanstack/react-query";
import { brandService } from "@/features/dashboard/brands/services/brandService";
import { categoryService } from "@/features/dashboard/categories/services/categoryService";
import { cn } from "@/core/utils";
import { ImageUploadPreview } from "../../../../components/shared/ImageUploadPreview";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { promotionsService } from "../services/promotionsService";
import { Loader } from "@/components/loader/Loader";
import { Plus } from "lucide-react";

export function CountdownOffer() {
    const [config, setConfig] = useState<CountdownConfig>({
        title: "",
        description: "",
        endDate: new Date().toISOString(),
        image: "",
        discountBadge: "",
        association: { type: "category", id: "", name: "" }
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Local state for the date picker and time
    const [date, setDate] = useState<Date | undefined>(new Date(config.endDate));
    const [time, setTime] = useState(format(new Date(config.endDate), "HH:mm"));

    const [association, setAssociation] = useState<Partial<PromotionAssociation>>({
        type: "category",
        id: ""
    });

    // Flag to ensure data is loaded only once to avoid "recoil" after clearing
    const [dataLoaded, setDataLoaded] = useState(false);

    const queryClient = useQueryClient();

    const { data: brandsData } = useQuery({
        queryKey: ["brands-list"],
        queryFn: () => brandService.listBrands(),
    });

    const { data: categoriesData } = useQuery({
        queryKey: ["categories-list"],
        queryFn: () => categoryService.listCategories(),
    });

    const { data: countdownData, isLoading: isLoadingCountdown } = useQuery({
        queryKey: ["countdown-items"],
        queryFn: promotionsService.getCountdownItems,
    });

    // Load data once when available
    useEffect(() => {
        if (!dataLoaded && countdownData?.data && countdownData.data.length > 0) {
            const item = countdownData.data[0];

            // Wait for dependencies to load associated names correctly if possible
            const assocType = item.countdown_association.toLowerCase() as 'brand' | 'category';
            if (assocType === 'brand' && !brandsData) return;
            if (assocType === 'category' && !categoriesData) return;

            // Find the name of the associated item
            let associatedName = "";
            if (assocType === 'brand' && brandsData?.data) {
                const brand = brandsData.data.find(b => b.brand_id === item.countdown_brand);
                if (brand) associatedName = brand.brand_name;
            } else if (assocType === 'category' && categoriesData?.catgoryProducts) {
                const category = categoriesData.catgoryProducts.find(c => c.category_id === item.countdown_category);
                if (category) associatedName = category.category_name;
            }

            const initialAssociation: PromotionAssociation = {
                type: assocType,
                id: item.countdown_brand || item.countdown_category || "",
                name: associatedName
            };

            setConfig({
                title: item.countdown_title,
                description: item.countdown_description,
                endDate: item.countdown_end_time,
                image: item.countdown_url,
                discountBadge: item.countdown_discount,
                association: initialAssociation
            });

            // Sync local state controls
            const dateObj = new Date(item.countdown_end_time);
            setDate(dateObj);
            setTime(format(dateObj, "HH:mm"));

            setAssociation(initialAssociation);
            setDataLoaded(true);
        }
    }, [countdownData, brandsData, categoriesData, dataLoaded]);



    const [activeTimeLeft, setActiveTimeLeft] = useState({
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00"
    });

    // Timer for the ACTIVE offer (from DB)
    useEffect(() => {
        const activeItem = countdownData?.data?.[0];
        if (!activeItem) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(activeItem.countdown_end_time).getTime();
            const distance = end - now;

            if (distance < 0) {
                clearInterval(timer);
                setActiveTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
                return;
            }

            setActiveTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0'),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0'),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0'),
                seconds: Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0')
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [countdownData]);

    // Automatically update config.endDate when date or time selection changes
    useEffect(() => {
        if (!date) return;
        const [hours, minutes] = time.split(":").map(Number);
        const newEndDate = new Date(date);
        newEndDate.setHours(hours, minutes, 0);

        const newIsoString = newEndDate.toISOString();
        if (config.endDate !== newIsoString) {
            setConfig(prev => ({
                ...prev,
                endDate: newIsoString
            }));
        }
    }, [date, time]);

    const { mutate: addCountdown, isPending: isAdding } = useMutation({
        mutationFn: promotionsService.addCountdownItem,
        onSuccess: (data) => {
            if (data.success) {
                alert("Countdown offer added successfully");
                // Invalidate query to update the "Active Spotlight" preview
                queryClient.invalidateQueries({ queryKey: ["countdown-items"] });

                // Clear fields
                setConfig({
                    title: "",
                    description: "",
                    endDate: new Date().toISOString(),
                    image: "",
                    discountBadge: "",
                    association: { type: "category", id: "", name: "" }
                });
                setSelectedFile(null);
                setAssociation({ type: "category", id: "" });
                setDate(undefined);
                setTime("");
            }
        },
        onError: (error) => {
            console.error(error);
            alert("Failed to add countdown offer");
        }
    });

    const handleSave = () => {
        if (!config.title || !config.description || !config.discountBadge || !selectedFile || !association.id) {
            alert("Please fill in all required fields and select an image.");
            return;
        }

        const formData = new FormData();
        formData.append("title", config.title);
        formData.append("description", config.description);
        formData.append("discount", config.discountBadge); // Mapped as per requirement
        formData.append("endTime", config.endDate);
        formData.append("association", association.type === 'brand' ? 'Brand' : 'Category');

        if (association.type === 'brand') {
            formData.append("brand", association.id);
        } else {
            formData.append("category", association.id);
        }

        if (selectedFile) {
            formData.append("countdown_img", selectedFile);
        }

        addCountdown(formData);
    };

    const activeOffer = countdownData?.data?.[0];

    return (
        <div className="grid gap-6 lg:grid-cols-2 relative h-full">
            {/* Added h-full and removed relative from here if causing layout issues, but kept per structure */}
            {isAdding && (
                <Loader fullScreen message="Saving Countdown Offer..." />
            )}
            <div className="space-y-6">
                <Card className="border-none shadow-premium bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            Spotlight Configuration
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {/* Form Fields from original code */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Offer Title</Label>
                            <Input
                                value={config.title}
                                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                                className="bg-background/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Description</Label>
                            <Textarea
                                value={config.description}
                                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                                className="bg-background/50 min-h-[100px]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Discount Badge</Label>
                                <Input
                                    value={config.discountBadge}
                                    onChange={(e) => setConfig({ ...config, discountBadge: e.target.value })}
                                    placeholder="e.g. 20% OFF"
                                    className="bg-background/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Promotion Image</Label>
                                <ImageUploadPreview
                                    value={config.image}
                                    onChange={(val) => setConfig({ ...config, image: val })}
                                    onFileSelect={setSelectedFile}
                                    aspectRatio="video"
                                    className="h-24"
                                />
                            </div>
                        </div>

                        <Divider />

                        <div className="space-y-3">
                            <Label className="text-sm font-semibold block">End Date & Time</Label>
                            <div className="flex flex-wrap gap-3">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] justify-start text-left font-normal bg-background/50",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>

                                <div className="flex items-center gap-2 bg-background/50 border rounded-md px-3 py-2 h-10 w-[140px]">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
                                    />
                                </div>


                            </div>
                            <p className="text-[10px] text-muted-foreground italic">
                                * Countdown timer runs on the active offer end date
                            </p>
                        </div>

                        <Divider />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-muted-foreground">Association Type</Label>
                                <Select
                                    value={association.type}
                                    onValueChange={(val: 'brand' | 'category') => setAssociation({ ...association, type: val, id: "" })}
                                >
                                    <SelectTrigger className="bg-background/50">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="category">Category</SelectItem>
                                        <SelectItem value="brand">Brand</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-muted-foreground">Select Target</Label>
                                <Select
                                    value={association.id}
                                    onValueChange={(val) => setAssociation({ ...association, id: val })}
                                >
                                    <SelectTrigger className="bg-background/50">
                                        <SelectValue placeholder={`Select ${association.type}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {association.type === 'brand'
                                            ? brandsData?.data.map(b => (
                                                <SelectItem key={b.brand_id} value={b.brand_id}>{b.brand_name}</SelectItem>
                                            ))
                                            : categoriesData?.catgoryProducts.map(c => (
                                                <SelectItem key={c.category_id} value={c.category_id}>{c.category_name}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Button className="w-full mt-2 shadow-lg h-12 text-base font-bold" onClick={handleSave}>
                            <Save className="mr-2 h-5 w-5" /> Finish & Save Spotlight
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", activeOffer ? "bg-green-500" : "bg-gray-400")} />
                    Active Spotlight Offer
                </h3>

                {isLoadingCountdown ? (
                    <div className="flex h-[440px] w-full items-center justify-center rounded-[2.5rem] bg-gray-50 border-8 border-white p-8 border-dashed shadow-inner">
                        <div className="text-center space-y-4">
                            <div className="mx-auto flex items-center justify-center">
                                <Loader />
                            </div>
                            <h3 className="text-lg font-bold text-gray-600">Loading Preview...</h3>
                        </div>
                    </div>
                ) : activeOffer ? (
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-[#CCF5E1] p-8 md:p-12 min-h-[440px] flex items-center shadow-2xl border-8 border-white">
                        <div className="relative z-10 max-w-[55%] space-y-6">
                            <h2 className="text-3xl md:text-4xl font-black text-[#2D3A4B] leading-tight tracking-tight uppercase">
                                {activeOffer.countdown_title}
                            </h2>
                            <p className="text-[#5B6B7C] text-sm md:text-base max-w-sm leading-relaxed">
                                {activeOffer.countdown_description}
                            </p>

                            <div className="flex gap-3 md:gap-5">
                                <CountdownItem value={activeTimeLeft.days} label="Days" />
                                <span className="text-xl font-bold self-start mt-1 text-[#00A76F]">:</span>
                                <CountdownItem value={activeTimeLeft.hours} label="Hours" />
                                <span className="text-xl font-bold self-start mt-1 text-[#00A76F]">:</span>
                                <CountdownItem value={activeTimeLeft.minutes} label="Minutes" />
                                <span className="text-xl font-bold self-start mt-1 text-[#00A76F]">:</span>
                                <CountdownItem value={activeTimeLeft.seconds} label="Seconds" />
                            </div>

                            <Button className="bg-[#009B5D] hover:bg-[#00814D] text-white px-8 py-6 text-base font-black rounded-2xl transition-all hover:scale-105 shadow-[0_10px_20px_rgba(0,155,93,0.2)] group mt-4">
                                <ShoppingBasket className="mr-2 h-6 w-6 group-hover:animate-bounce" />
                                SHOP NOW
                            </Button>
                        </div>

                        {/* Image area */}
                        <div className="absolute right-0 top-0 bottom-0 w-[45%] flex items-center justify-end pr-8 md:pr-12">
                            <div className="relative group/img">
                                <div className="absolute -top-10 -right-6 bg-[#FF4842] text-white w-24 h-24 rounded-full flex flex-col items-center justify-center font-black text-xl shadow-2xl border-4 border-white transform rotate-12 z-20 group-hover/img:scale-110 transition-transform duration-300">
                                    {activeOffer.countdown_discount.split(' ')[0]}
                                    <span className="text-xs font-medium tracking-tight uppercase">{activeOffer.countdown_discount.split(' ')[1]}</span>
                                </div>
                                <img
                                    src={activeOffer.countdown_url || "placeholder-image-url"}
                                    alt="Spotlight"
                                    className="h-auto max-h-[360px] w-auto max-w-full object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.15)] group-hover/img:scale-105 transition-transform duration-700 ease-out"
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-[440px] w-full items-center justify-center rounded-[2.5rem] bg-gray-50 border-8 border-white p-8 border-dashed shadow-inner">
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                <Plus className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-600">No Active Spotlight Offer</h3>
                            <p className="text-muted-foreground text-sm max-w-[250px] mx-auto">
                                Add a new spotlight offer to see it previewed here.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function CountdownItem({ value, label }: { value: string; label: string }) {
    return (
        <div className="flex flex-col items-center gap-0.5">
            <span className="text-2xl md:text-3xl font-black text-[#009B5D] tabular-nums tracking-tighter">{value}</span>
            <span className="text-[7px] font-black text-[#5B6B7C] uppercase tracking-[0.2em]">{label}</span>
        </div>
    );
}

function Divider() {
    return <div className="h-px bg-border/50 w-full my-6 shadow-sm" />;
}
