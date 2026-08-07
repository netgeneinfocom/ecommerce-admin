import { useState } from 'react';
import { Trash2, Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
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
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const lineTotal = item.quantity * item.price;
    const selectedItem = inventoryItems.find((inv) => inv._id === item.productId);

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
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className={cn(
                                "w-full justify-between font-normal h-10 px-3 py-2 border-input transition-colors",
                                selectedItem ? "bg-primary text-white hover:bg-primary/90 hover:text-white" : "bg-background"
                            )}
                        >
                            {selectedItem ? (
                                <span className="font-medium truncate text-white">{selectedItem.product_name}</span>
                            ) : (
                                <span className="text-muted-foreground">Select inventory item</span>
                            )}
                            <ChevronsUpDown className={cn("ml-2 h-4 w-4 shrink-0", selectedItem ? "text-white opacity-90" : "opacity-50")} />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[320px] p-0 z-50 bg-popover" align="start">
                        <Command>
                            <CommandInput
                                placeholder="Search by product name..."
                                value={searchValue}
                                onValueChange={setSearchValue}
                                onClear={() => setSearchValue("")}
                            />
                            <CommandList className="max-h-[240px]">
                                <CommandEmpty>No product found.</CommandEmpty>
                                <CommandGroup>
                                    {inventoryItems.map((invItem) => (
                                        <CommandItem
                                            key={invItem._id}
                                            value={`${invItem.product_name} ${invItem.dimension_name || ''} ${invItem.product_code || ''}`}
                                            onSelect={() => {
                                                onUpdate(item.id, {
                                                    productId: invItem._id,
                                                });
                                                setOpen(false);
                                            }}
                                            className="cursor-pointer py-2 data-[selected='true']:bg-primary data-[selected='true']:text-white group"
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4 shrink-0",
                                                    item.productId === invItem._id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            <span className="font-medium text-foreground group-data-[selected='true']:text-white">{invItem.product_name}</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
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
