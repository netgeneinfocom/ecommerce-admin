import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Eye } from "lucide-react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ROUTES } from "@/core/config/routes";
import { Loader } from "@/components/loader/Loader";
import { orderService } from "@/features/dashboard/orders/services";
import { Order, OrderStatus } from "@/features/dashboard/orders/types";

export default function Orders() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const loadOrders = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      const data = await orderService.fetchOrders(page, itemsPerPage);
      if (data.success) {
        setOrders(data.orders);
        setTotalPages(data.pagination.totalPages);
        setCurrentPage(data.pagination.currentPage);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    loadOrders(currentPage);
  }, [currentPage, loadOrders]);

  const filteredOrders = orders.filter(order =>
    order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${order.customer_id.first_name} ${order.customer_id.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: OrderStatus) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "confirmed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "shipping":
        return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20";
      case "delivered":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground mt-2">
          Track and manage customer orders
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle>All Orders</CardTitle>
              <CardDescription className="mt-1.5">
                View and manage customer orders
              </CardDescription>
            </div>
            <div className="relative lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <div className="min-w-full inline-block align-middle">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">{order.order_id}</TableCell>
                      <TableCell>{`${order.customer_id.first_name} ${order.customer_id.last_name}`}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(order.order_status)}>
                          {order.order_status}
                        </Badge>
                      </TableCell>
                      <TableCell>₹{order.total_amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(ROUTES.DASHBOARD.ORDER_DETAIL(order._id))}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Order
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {totalPages > 1 && (
          <div className="p-4 border-t">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>
      {isLoading && <Loader fullScreen message="Loading orders..." />}
    </div>
  );
}
