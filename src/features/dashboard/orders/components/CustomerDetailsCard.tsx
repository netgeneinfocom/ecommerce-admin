import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone } from "lucide-react";
import type { OrderCustomer } from "../types";

interface CustomerDetailsCardProps {
  customer: OrderCustomer | null;
}

export function CustomerDetailsCard({ customer }: CustomerDetailsCardProps) {
  if (!customer) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Customer Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Customer information not available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          Customer Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <User className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">Full Name</p>
            <p className="font-medium">{`${customer.first_name} ${customer.last_name}`}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">Email Address</p>
            <p className="font-medium">{customer.email}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">Phone Number</p>
            <p className="font-medium">N/A</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
