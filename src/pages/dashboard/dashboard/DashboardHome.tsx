import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package, Tag, Eye, FolderOpen, Layers } from "lucide-react";
import { ROUTES } from "@/core/config/routes";
import { dashboardService } from "@/features/dashboard/services";
import { orderService } from "@/features/dashboard/orders/services";
import { OrderStatus } from "@/features/dashboard/orders/types";
import { Loader } from "@/components/loader/Loader";

export default function DashboardHome() {
  const navigate = useNavigate();

  const { data: ordersData, isLoading: isLoadingOrders, error: ordersError } = useQuery({
    queryKey: ["recentOrders"],
    queryFn: () => orderService.fetchOrders(1, 5),
  });

  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () => dashboardService.getDashboardData(),
  });

  const recentOrders = ordersData?.orders || [];
  const stats = statsData?.data || {
    totalOrders: 0,
    totalProducts: 0,
    totalBrands: 0,
    totalCategories: 0,
    totalSubCategories: 0,
  };

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your dashboard overview
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats.totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Brands</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Tag className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalBrands}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <FolderOpen className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats.totalCategories}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sub Categories</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Layers className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalSubCategories}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.DASHBOARD.ORDERS)}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(isLoadingOrders || isLoadingStats) ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20">
                      <Loader message="Loading dashboard data..." />
                    </TableCell>
                  </TableRow>
                ) : ordersError || recentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      {ordersError ? "Error loading orders" : "No recent orders found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  recentOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium text-primary">{order.order_id}</TableCell>
                      <TableCell>{order.customer_id ? `${order.customer_id.first_name} ${order.customer_id.last_name}` : 'Unknown Customer'}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(order.order_status)}>
                          {order.order_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold text-foreground">₹{order.total_amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-primary/10 hover:text-primary transition-colors"
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
      </Card>
      {(isLoadingOrders || isLoadingStats) && <Loader fullScreen message="Loading dashboard..." />}
    </div>
  );
}