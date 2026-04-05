import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Hash } from "lucide-react";
import type { BestWarehouse } from "../types";

interface WarehouseInformationCardProps {
  warehouse: BestWarehouse;
}

export function WarehouseInformationCard({ warehouse }: WarehouseInformationCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Home className="h-4 w-4 text-primary" />
          Fulfilling Warehouse
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Warehouse Details</p>
          <p className="font-medium">{warehouse.name}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Hash className="h-3 w-3" />
            <span>ID: {warehouse.warehouseId}</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Address</p>
          <p className="font-medium leading-relaxed">
            {warehouse.address},<br />
            {warehouse.city}, {warehouse.state}<br />
            {warehouse.country} - {warehouse.pincode}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
