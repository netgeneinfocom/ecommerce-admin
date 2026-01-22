import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Product, Supplier, AddInventoryItem, InventoryItem } from '../types';
import { cn } from '@/core/utils';

interface InventoryItemRowProps {
    item: AddInventoryItem;
    index: number;
    inventoryItems: InventoryItem[];
    suppliers: Supplier[];
    onUpdate: (id: string, updates: Partial<AddInventoryItem>) => void;
    onRemove: (id: string) => void;
}

export function InventoryItemRow({
    item,
    index,
    inventoryItems,
    suppliers,
    onUpdate,
    onRemove,
}: InventoryItemRowProps) {

    const lineTotal = item.quantity * item.price;

    return (
        <tr className={cn(
            "border-b border-border transition-colors animate-fade-in",
            "hover:bg-muted/50"
        )}>
            {/* Row Number */}
            <td className="px-4 py-3">
                <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                    {index + 1}
                </span>
            </td>

            {/* Product */}
            <td className="px-4 py-3">
                <Select
                    value={item.productId}
                    onValueChange={(value) => {
                        onUpdate(item.id, {
                            productId: value,
                        });
                    }}
                >
                    <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Select inventory item" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                        {inventoryItems.map((invItem) => (
                            <SelectItem key={invItem._id} value={invItem._id}>
                                <div className="flex flex-col text-left">
                                    <span className="font-medium">{invItem.product_name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {invItem.dimension_name} • {invItem.product_code}
                                    </span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </td>


            {/* Quantity */}
            <td className="px-4 py-3">
                <Input
                    type="number"
                    min="1"
                    value={item.quantity || ''}
                    onChange={(e) => onUpdate(item.id, { quantity: parseInt(e.target.value) || 0 })}
                    className="w-24 bg-background text-center"
                    placeholder="0"
                />
            </td>

            {/* Price */}
            <td className="px-4 py-3">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price || ''}
                        onChange={(e) => onUpdate(item.id, { price: parseFloat(e.target.value) || 0 })}
                        className="w-28 bg-background pl-7"
                        placeholder="0.00"
                    />
                </div>
            </td>

            {/* Supplier */}
            <td className="px-4 py-3">
                <Select
                    value={item.supplierId}
                    onValueChange={(value) => onUpdate(item.id, { supplierId: value })}
                >
                    <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                        {suppliers.map((supplier) => (
                            <SelectItem key={supplier._id || supplier.id!} value={supplier._id || supplier.id!}>
                                {supplier.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </td>

            {/* Line Total */}
            <td className="px-4 py-3">
                <span className="font-semibold text-foreground">
                    ₹{lineTotal.toFixed(2)}
                </span>
            </td>

            {/* Actions */}
            <td className="px-4 py-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(item.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </td>
        </tr>
    );
}
