import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { RefreshCcw, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "@/core/hooks/use-toast";
import { orderService } from "../services";
import { OrderStatus } from "../types";

interface UpdateOrderStatusCardProps {
    orderId: string;
    currentStatus: OrderStatus;
}

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    processing: ["confirmed", "cancelled"],
    confirmed: ["shipping", "cancelled"],
    shipping: ["delivered", "cancelled"],
    delivered: [],
    cancelled: [],
};

export function UpdateOrderStatusCard({ orderId, currentStatus }: UpdateOrderStatusCardProps) {
    const queryClient = useQueryClient();
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");

    const nextPossibleStatuses = ALLOWED_TRANSITIONS[currentStatus] || [];
    const isFinalState = nextPossibleStatuses.length === 0;

    const updateStatusMutation = useMutation({
        mutationFn: (status: OrderStatus) => orderService.updateOrderStatus(orderId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["order", orderId] });
            toast({
                title: "Status Updated",
                description: `Order status has been changed to ${selectedStatus}`,
            });
            setSelectedStatus("");
        },
        onError: (error: any) => {
            toast({
                title: "Update Failed",
                description: error.response?.data?.message || "Failed to update order status",
                variant: "destructive",
            });
        },
    });

    const handleUpdate = () => {
        if (selectedStatus) {
            updateStatusMutation.mutate(selectedStatus as OrderStatus);
        }
    };

    return (
        <Card className="overflow-hidden border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <RefreshCcw className="h-4 w-4 text-primary" />
                    Update Order Status
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {isFinalState ? (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                        {currentStatus === "cancelled" ? (
                            <AlertCircle className="h-4 w-4 text-destructive" />
                        ) : (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                        This order is in a final state ({currentStatus}). No further changes are allowed.
                    </div>
                ) : (
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                            <Select
                                value={selectedStatus}
                                onValueChange={(value) => setSelectedStatus(value as OrderStatus)}
                                disabled={updateStatusMutation.isPending}
                            >
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Select next status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {nextPossibleStatuses.map((status) => (
                                        <SelectItem key={status} value={status} className="capitalize">
                                            {status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            onClick={handleUpdate}
                            disabled={!selectedStatus || updateStatusMutation.isPending}
                            className="sm:w-32"
                        >
                            Update
                        </Button>
                    </div>
                )}

                {!isFinalState && (
                    <p className="text-xs text-muted-foreground italic">
                        Note: Transitions are strictly enforced. Current status: <span className="font-bold capitalize">{currentStatus}</span>
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
