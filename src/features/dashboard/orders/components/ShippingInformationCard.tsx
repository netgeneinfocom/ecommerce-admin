import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail } from "lucide-react";
import type { ShippingAddress } from "../types";

interface ShippingInformationCardProps {
  shipping: ShippingAddress;
}

export function ShippingInformationCard({ shipping }: ShippingInformationCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          Shipping Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Recipient</p>
          <p className="font-medium">{`${shipping.first_name} ${shipping.last_name}`}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Mail className="h-3 w-3" />
            <span>{shipping.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Phone className="h-3 w-3" />
            <span>{shipping.phone_number}</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Address</p>
          <p className="font-medium leading-relaxed">
            {shipping.address},<br />
            {shipping.city}, {shipping.state}<br />
            {shipping.country} - {shipping.postal_code}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
