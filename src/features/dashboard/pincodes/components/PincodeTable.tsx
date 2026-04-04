import { Pincode, Area } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MapPin, Trash2, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PincodeTableProps {
    pincodes: Pincode[];
    onStatusUpdate?: (id: string, status: string) => void;
    onEdit?: (pincode: Pincode) => void;
    onDelete?: (id: string) => void;
    onDeleteArea?: (areaId: string) => void;
    onEditArea?: (area: Area) => void;
}

export function PincodeTable({ pincodes = [], onStatusUpdate, onEdit, onDelete, onDeleteArea, onEditArea }: PincodeTableProps) {
    return (
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="w-[120px] font-semibold py-4">PINCODE</TableHead>
                        <TableHead className="font-semibold py-4">SERVABLE AREAS</TableHead>
                        <TableHead className="w-[120px] font-semibold py-4 text-center">STATUS</TableHead>
                        <TableHead className="w-[180px] font-semibold py-4 text-right">ACTIONS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pincodes.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-20">
                                <div className="flex flex-col items-center justify-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                                        <MapPin className="w-7 h-7 text-muted-foreground/50" />
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground font-semibold">No service areas registered</p>
                                        <p className="text-xs text-muted-foreground mt-1 text-center">Expand your logistics reach by adding new pincodes.</p>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        pincodes.map((pincode) => (
                            <TableRow key={pincode._id} className="hover:bg-muted/30 transition-colors">
                                <TableCell className="font-bold text-primary font-mono text-base py-4">
                                    {pincode.pincode}
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex flex-wrap gap-2">
                                        {pincode.areas.map(area => (
                                            <Badge key={area._id} variant="outline" className="bg-background/50 border-border/50 text-[10px] py-0 pr-1 pl-2 h-7 flex items-center gap-1.5 font-medium group/badge">
                                                <div className={`w-1.5 h-1.5 rounded-full ${area.isActive ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                                                <span onClick={() => onEditArea?.(area)} className="cursor-pointer hover:text-primary transition-colors">
                                                    {area.name} ({area.city})
                                                </span>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDeleteArea?.(area._id);
                                                    }}
                                                    className="ml-1 p-0.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all opacity-0 group-hover/badge:opacity-100"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 text-center">
                                    <Badge className={`${pincode.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'} border-none text-[10px] uppercase font-bold px-2.5 py-0.5`}>
                                        {pincode.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit?.(pincode)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDelete?.(pincode._id)}
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
