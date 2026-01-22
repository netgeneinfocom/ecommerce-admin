import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingCart } from "lucide-react";
import type { OrderItem } from "../types";

interface OrderItemsCardProps {
  items: OrderItem[];
}

export function OrderItemsCard({ items }: OrderItemsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-primary" />
          Order Items
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(item => (
              <TableRow key={item._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product_logo}
                      alt={item.product_name}
                      className="h-10 w-10 rounded object-cover border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                    <div>
                      <span className="font-medium block">{item.product_name}</span>
                      <span className="text-xs text-muted-foreground">{item.product_brand} | {item.product_dimension}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">x{item.no_of_products}</TableCell>
                <TableCell className="text-right">₹{item.product_price.toFixed(2)}</TableCell>
                <TableCell className="text-right">₹{item.total_price.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
