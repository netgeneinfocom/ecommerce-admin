import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingCart, RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { OrderItem } from "../types";

interface OrderItemsCardProps {
  items: OrderItem[];
}

export function OrderItemsCard({ items }: OrderItemsCardProps) {
  const getReturnStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200",
      approved: "bg-green-100 text-green-700 hover:bg-green-100 border-green-200",
      rejected: "bg-red-100 text-red-700 hover:bg-red-100 border-red-200",
      returned: "bg-red-100 text-red-700 hover:bg-red-100 border-red-200",
      completed: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200",
    };
    return colors[status.toLowerCase()] || "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200";
  };

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
              <TableHead className="text-center">Return Status</TableHead>
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
                <TableCell className="text-center">
                  {item.return_status ? (
                    <Badge variant="outline" className={`${getReturnStatusColor(item.return_status)} capitalize`}>
                      <RefreshCcw className="h-3 w-3 mr-1" />
                      {item.return_status}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
