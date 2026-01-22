import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InventoryBill } from '../types';
import { Badge } from '@/components/ui/badge';
import { inventoryService } from '../services/inventoryService';

interface RecentBillsProps {
    onViewBill: (billId: string) => void;
    onBillsExistChange?: (exists: boolean) => void;
    onLoadingChange?: (isLoading: boolean) => void;
}

export function RecentBills({ onViewBill, onBillsExistChange, onLoadingChange }: RecentBillsProps) {
    const [bills, setBills] = useState<InventoryBill[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchBills();
    }, []);

    useEffect(() => {
        onLoadingChange?.(isLoading);
    }, [isLoading, onLoadingChange]);

    const fetchBills = async () => {
        try {
            setIsLoading(true);
            const response = await inventoryService.getInventoryBills();
            if (response.success) {
                setBills(response.data);
                onBillsExistChange?.(response.data.length > 0);
            }
        } catch (error) {
            console.error('Error fetching bills:', error);
            onBillsExistChange?.(false);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading || bills.length === 0) {
        return null;
    }


    return (
        <Card className="shadow-sm mt-8">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Bills</CardTitle>
                <Badge variant="secondary">{bills.length} bill{bills.length !== 1 ? 's' : ''}</Badge>
            </CardHeader>
            <CardContent className="p-0">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Bill Number</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Date</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Items</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Total</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {bills.map((bill) => (
                            <tr key={bill._id} className="border-b border-border hover:bg-muted/50 transition-colors">
                                <td className="px-6 py-4">
                                    <span className="font-medium text-foreground">{bill.bill_number}</span>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">
                                    {bill.bill_date.split(' • ')[0]}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-muted-foreground">{bill.items_count}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-semibold text-foreground">₹{bill.total_amount}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onViewBill(bill._id)}
                                        className="h-8 gap-2"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                        Generate Bill
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}

