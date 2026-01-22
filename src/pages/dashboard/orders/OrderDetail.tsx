import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "@/core/hooks/use-toast";
import { ROUTES } from "@/core/config/routes";
import { orderService } from "@/features/dashboard/orders/services";
import {
  CustomerDetailsCard,
  ShippingInformationCard,
  OrderItemsCard,
  PriceSummaryCard,
  UpdateOrderStatusCard,
} from "@/features/dashboard/orders";

export default function OrderDetail() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", "detail", orderId],
    queryFn: async () => {
      // Since there is no detail endpoint, we fetch all (or a large batch) and find the one we need
      const response = await orderService.fetchOrders(1, 100);
      const foundOrder = response.orders.find(o => o._id === orderId);
      if (!foundOrder) throw new Error("Order not found");
      return foundOrder;
    },
    enabled: !!orderId,
  });

  const order = data;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      processing: "bg-blue-500 hover:bg-blue-500",
      confirmed: "bg-green-500 hover:bg-green-500",
      shipping: "bg-purple-500 hover:bg-purple-500",
      delivered: "bg-green-600 hover:bg-green-600",
      cancelled: "bg-red-500 hover:bg-red-500",
    };
    return colors[status.toLowerCase()] || "bg-gray-500 hover:bg-gray-500";
  };

  const handleStatusChange = (status: string) => {
    toast({
      title: "Status Updated",
      description: `Order status changed to: ${status}`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Fetching order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-destructive mb-2">Error</h2>
        <p className="text-muted-foreground mb-6">Failed to load order details. Please try again later.</p>
        <Button onClick={() => navigate(ROUTES.DASHBOARD.ORDERS)}>
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" className="mb-4" onClick={() => navigate(ROUTES.DASHBOARD.ORDERS)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders List
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-primary">Order #{order.order_id}</h1>
              <Badge className={`${getStatusColor(order.order_status)} text-white capitalize`}>
                {order.order_status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          {/* Status update dropdown removed, now handled by UpdateOrderStatusCard */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <UpdateOrderStatusCard orderId={order._id} currentStatus={order.order_status} />
          <CustomerDetailsCard customer={order.customer_id} />
          <ShippingInformationCard shipping={order.shipping_address} />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <OrderItemsCard items={order.order_items} />
          <PriceSummaryCard totalAmount={order.total_amount} />
        </div>
      </div>
    </div>
  );
}
