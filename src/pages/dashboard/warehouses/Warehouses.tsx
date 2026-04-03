import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Warehouses() {
    return (
        <div className="space-y-6 max-w-full overflow-hidden">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Warehouses</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your storage facilities and warehouse locations
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Warehouse Management</CardTitle>
                    <CardDescription>
                        View and manage all your warehouses from this central dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Warehouse management content will be displayed here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
