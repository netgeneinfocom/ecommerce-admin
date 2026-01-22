import { useEffect, useState } from 'react';
import { Plus, Save, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InventoryItemRow } from './InventoryItemRow';
import { RecentBills } from './RecentBills';
import { BillSummary } from './BillSummary';
import { AddInventoryItem, InventoryItem, Supplier } from '../types';
import { useToast } from "@/core/hooks/use-toast";
import { inventoryService } from '../services/inventoryService';
import { Loader } from '@/components/loader/Loader';

export function AddInventory() {
    const { toast } = useToast();
    const [items, setItems] = useState<AddInventoryItem[]>([]);
    const [selectedBill, setSelectedBill] = useState<any | null>(null);
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshBillsKey, setRefreshBillsKey] = useState(0);
    const [billsExist, setBillsExist] = useState(false);
    const [billsLoading, setBillsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [inventoryData, suppliersData] = await Promise.all([
                    inventoryService.listInventory({ limit: 100 }), // Get more for the dropdown
                    inventoryService.getSuppliers()
                ]);
                setInventoryItems(inventoryData.data);
                setSuppliers(suppliersData);
            } catch (error) {
                console.error('Error fetching inventory data:', error);
                toast({
                    title: "Error",
                    description: "Failed to load inventory and suppliers",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const addItem = () => {
        const newItem: AddInventoryItem = {
            id: `item-${Date.now()}`,
            productId: '', // We'll use this for inventory_id
            unitId: '',   // Not needed for the new payload but keeping type compatibility for now
            quantity: 1,
            price: 0,
            supplierId: '',
        };
        setItems([...items, newItem]);
    };

    const updateItem = (id: string, updates: Partial<AddInventoryItem>) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, ...updates } : item
        ));
    };

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const grandTotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    const isValidItem = (item: AddInventoryItem) => {
        return item.productId && item.supplierId && item.quantity > 0 && item.price > 0;
    };

    const allItemsValid = items.length > 0 && items.every(isValidItem);

    const handleSubmit = async () => {
        if (!allItemsValid) {
            toast({
                title: "Error",
                description: "Please fill in all fields for each item",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsSaving(true);
            const billData = {
                bill_date: new Date().toISOString(),
                items: items.map(item => ({
                    inventory_id: item.productId,
                    supplier_id: item.supplierId,
                    quantity: item.quantity,
                    unit_price: item.price,
                })),
            };

            const response = await inventoryService.addInventoryBill(billData);

            if (response.success) {
                toast({
                    title: "Success",
                    description: `Bill ${response.bill_number || ''} created successfully!`,
                });
                setItems([]);
                setRefreshBillsKey(prev => prev + 1);
            }
        } catch (error: any) {
            console.error('Error saving bill:', error);
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Failed to save bill",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleViewBill = (billId: string) => {
        setSelectedBill(billId);
    };

    const handleBackToForm = () => {
        setSelectedBill(null);
    };

    // Show bill summary if a bill is selected
    if (selectedBill) {
        return <BillSummary billId={selectedBill} onBack={handleBackToForm} />;
    }


    return (
        <>
            <Card className="shadow-sm">
                <CardHeader className="border-b border-border">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">New Purchase Bill</CardTitle>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                    Add items to create a new inventory bill
                                </p>
                            </div>
                        </div>
                        <Button onClick={addItem} className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add Item
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {items.length === 0 && !billsExist ? (
                        <div className="py-16 text-center">
                            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                                <Plus className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium text-foreground mb-1">No items added yet</h3>
                            <p className="text-muted-foreground mb-4">Click "Add Item" to start adding products to this bill</p>
                            <Button onClick={addItem} variant="outline" className="gap-2">
                                <Plus className="w-4 h-4" />
                                Add First Item
                            </Button>
                        </div>
                    ) : items.length === 0 ? null : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-muted text-muted-foreground">
                                            <th className="px-4 py-3 text-left font-semibold text-sm w-12">#</th>
                                            <th className="px-4 py-3 text-left font-semibold text-sm min-w-[200px]">Product</th>
                                            <th className="px-4 py-3 text-left font-semibold text-sm w-28">Quantity</th>
                                            <th className="px-4 py-3 text-left font-semibold text-sm w-32">Price</th>
                                            <th className="px-4 py-3 text-left font-semibold text-sm min-w-[180px]">Supplier</th>
                                            <th className="px-4 py-3 text-left font-semibold text-sm w-28">Total</th>
                                            <th className="px-4 py-3 text-left font-semibold text-sm w-16"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, index) => (
                                            <InventoryItemRow
                                                key={item.id}
                                                item={item}
                                                index={index}
                                                inventoryItems={inventoryItems}
                                                suppliers={suppliers}
                                                onUpdate={updateItem}
                                                onRemove={removeItem}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer with totals and submit */}
                            <div className="border-t border-border p-6 bg-muted/30">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        {items.length} item{items.length !== 1 ? 's' : ''} added
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground">Grand Total</p>
                                            <p className="text-3xl font-bold text-foreground">
                                                ₹{grandTotal.toFixed(2)}
                                            </p>
                                        </div>
                                        <Button
                                            size="lg"
                                            className="gap-2 px-8"
                                            onClick={handleSubmit}
                                            disabled={!allItemsValid}
                                        >
                                            <Save className="w-5 h-5" />
                                            Save Bill
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Recent Bills Section */}
            <RecentBills
                key={refreshBillsKey}
                onViewBill={handleViewBill}
                onBillsExistChange={setBillsExist}
                onLoadingChange={setBillsLoading}
            />

            {(isLoading || billsLoading || isSaving) && (
                <Loader
                    fullScreen
                    message={
                        isSaving
                            ? "Saving bill..."
                            : isLoading
                                ? "Loading inventory data..."
                                : "Loading bills..."
                    }
                />
            )}
        </>
    );
}

