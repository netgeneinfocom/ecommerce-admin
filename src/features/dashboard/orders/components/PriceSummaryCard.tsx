import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface PriceSummaryCardProps {
  totalAmount: number;
}

export function PriceSummaryCard({ totalAmount }: PriceSummaryCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-primary" />
          Price Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Order Total:</span>
          <span className="font-medium">₹{totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t pt-3">
          <span className="font-semibold">Grand Total:</span>
          <span className="font-bold text-lg text-primary">₹{totalAmount.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
