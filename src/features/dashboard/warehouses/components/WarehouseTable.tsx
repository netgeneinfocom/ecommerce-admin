import { Warehouse } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MapPin, Warehouse as WarehouseIcon, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WarehouseTableProps {
    warehouses: Warehouse[];
    onEdit?: (warehouse: Warehouse) => void;
    onDelete?: (id: string) => void;
}

export function WarehouseTable({ warehouses = [], onEdit, onDelete }: WarehouseTableProps) {
    return (
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="w-[180px] font-semibold py-4"> WAREHOUSE ID</TableHead>
                        <TableHead className="font-semibold py-4">WAREHOUSE NAME</TableHead>
                        <TableHead className="font-semibold py-4">LOCATION</TableHead>
                        <TableHead className="w-[100px] font-semibold py-4 text-center">PINCODE</TableHead>
                        <TableHead className="w-[100px] font-semibold py-4 text-center">STATUS</TableHead>
                        <TableHead className="w-[150px] font-semibold py-4 text-right">ACTIONS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {warehouses.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-16">
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                        <WarehouseIcon className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <p className="text-muted-foreground font-medium">No storage facilities registered yet</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        warehouses.map((warehouse) => (
                            <TableRow key={warehouse._id} className="hover:bg-muted/30 transition-colors">
                                <TableCell className="font-mono text-xs text-primary font-medium">
                                    {warehouse.warehouseId}
                                </TableCell>
                                <TableCell className="font-semibold text-foreground py-4 text-sm">
                                    {warehouse.name}
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-xs font-medium">{warehouse.address}</span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {warehouse.city}, {warehouse.state}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 text-center">
                                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                                        {warehouse.pincode}
                                    </span>
                                </TableCell>
                                <TableCell className="py-4 text-center">
                                    <Badge className={`${warehouse.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'} border-none text-[10px] uppercase font-bold px-2 py-0`}>
                                        {warehouse.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit?.(warehouse)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDelete?.(warehouse._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
