import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCcw, Calendar, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../services";
import { toast } from "@/core/hooks/use-toast";
import type { OrderItem } from "../types";

interface ReturnInformationCardProps {
  items: OrderItem[];
}

export function ReturnInformationCard({ items }: ReturnInformationCardProps) {
  const queryClient = useQueryClient();
  const itemsWithReturns = items.filter((item) => item.return_info);

  const updateReturnMutation = useMutation({
    mutationFn: ({ returnId, status }: { returnId: string; status: "returned" }) =>
      orderService.updateReturnStatus(returnId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({
        title: "Return Status Updated",
        description: "The item has been marked as returned and inventory has been restored.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Failed to update return status",
        variant: "destructive",
      });
    },
  });

  if (itemsWithReturns.length === 0) return null;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200",
      approved: "bg-green-100 text-green-700 hover:bg-green-100 border-green-200",
      rejected: "bg-red-100 text-red-700 hover:bg-red-100 border-red-200",
      returned: "bg-red-100 text-red-700 hover:bg-red-100 border-red-200",
      completed: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200",
    };
    return colors[status.toLowerCase()] || "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200";
  };

  const handleUpdateStatus = (returnId: string) => {
    updateReturnMutation.mutate({ returnId, status: "returned" });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <RefreshCcw className="h-4 w-4 text-primary" />
          Return Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {itemsWithReturns.map((item) => (
          <div key={item._id} className="border-b last:border-0 pb-4 last:pb-0 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{item.product_name}</span>
                <Badge variant="outline" className={`${getStatusColor(item.return_status || "")} capitalize text-[10px] h-5 px-1.5`}>
                  {item.return_status}
                </Badge>
              </div>
              {item.return_status === "pending" && (
                <Button
                  size="sm"
                  className="h-7 text-[10px] px-2 gap-1.5 bg-primary text-white hover:bg-white hover:text-primary border border-primary transition-colors"
                  onClick={() => handleUpdateStatus(item.return_info?.return_id || "")}
                  disabled={updateReturnMutation.isPending}
                >
                  {updateReturnMutation.isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-3 w-3" />
                  )}
                  Mark as Returned
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Requested: <span className="text-foreground font-medium">{new Date(item.return_info?.requested_at || "").toLocaleString()}</span></span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <FileText className="h-3.5 w-3.5 mt-0.5" />
                  <div>
                    <p className="mb-0.5">Reason for return:</p>
                    <p className="text-foreground font-medium leading-relaxed italic">"{item.return_info?.reason}"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
