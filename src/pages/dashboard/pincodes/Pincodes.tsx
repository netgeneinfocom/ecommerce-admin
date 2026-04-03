import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Pincodes() {
    return (
        <div className="space-y-6 max-w-full overflow-hidden">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Servable Pincodes</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage the pincodes where your services are available
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Pincode Management</CardTitle>
                    <CardDescription>
                        Configure and update your servable service areas.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Pincode list and service area configuration will be displayed here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
