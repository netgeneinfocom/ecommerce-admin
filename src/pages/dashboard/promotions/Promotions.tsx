import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutPanelLeft, Image as ImageIcon, Timer } from "lucide-react";
import { CarouselOffer } from "@/features/dashboard/promotions/components/CarouselOffer";
import { BannerOffer } from "@/features/dashboard/promotions/components/BannerOffer";
import { CountdownOffer } from "@/features/dashboard/promotions/components/CountdownOffer";

export default function Promotions() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Promotions</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your store's visual offers, banners and spotlight campaigns
                    </p>
                </div>
            </div>

            <Tabs defaultValue="carousel" className="space-y-6">
                <TabsList className="bg-card border p-1 rounded-xl shadow-sm">
                    <TabsTrigger value="carousel" className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <LayoutPanelLeft className="mr-2 h-4 w-4" />
                        Carousel
                    </TabsTrigger>
                    <TabsTrigger value="banners" className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Banners
                    </TabsTrigger>
                    <TabsTrigger value="countdown" className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Timer className="mr-2 h-4 w-4" />
                        Countdown
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="carousel">
                    <CarouselOffer />
                </TabsContent>

                <TabsContent value="banners">
                    <BannerOffer />
                </TabsContent>

                <TabsContent value="countdown">
                    <CountdownOffer />
                </TabsContent>
            </Tabs>
        </div>
    );
}
