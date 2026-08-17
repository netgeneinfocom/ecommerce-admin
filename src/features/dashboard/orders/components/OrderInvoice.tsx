import React from 'react';
import { Order } from '../types';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/core/utils';

interface OrderInvoiceProps {
    order: Order;
    variant?: 'link' | 'outline' | 'button';
    className?: string;
}

/**
 * Renders a direct download/view action for the order invoice PDF.
 * Only rendered if the order status is confirmed (or later: shipped, delivered)
 * and a valid invoice_url exists.
 */
export const OrderInvoice: React.FC<OrderInvoiceProps> = ({
    order,
    variant = 'link',
    className,
}) => {
    // Only show download invoice once order status is confirmed (or subsequent status: shipped, delivered)
    const normalizedStatus = order.order_status?.toLowerCase();
    const isConfirmedOrLater = ['confirmed', 'shipped', 'delivered'].includes(normalizedStatus);

    if (!isConfirmedOrLater || !order.invoice_url) {
        return null;
    }

    if (variant === 'link') {
        return (
            <a
                href={order.invoice_url}
                target="_blank"
                rel="noopener noreferrer"
                download={`Invoice-${order.order_id}.pdf`}
                className={cn(
                    "text-blue-600 hover:text-blue-700 h-auto p-0 font-bold text-[10px] md:text-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer",
                    className
                )}
                title={`Download Invoice for Order #${order.order_id}`}
            >
                <Download className="w-3.5 h-3.5" />
                <span>Invoice</span>
            </a>
        );
    }

    if (variant === 'button') {
        return (
            <Button
                size="sm"
                asChild
                className={cn(
                    "bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-2 rounded-lg h-9 cursor-pointer shadow-sm",
                    className
                )}
            >
                <a
                    href={order.invoice_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={`Invoice-${order.order_id}.pdf`}
                    title={`Download Invoice for Order #${order.order_id}`}
                >
                    <Download className="w-4 h-4" />
                    <span>Download Invoice</span>
                </a>
            </Button>
        );
    }

    return (
        <Button
            variant="outline"
            size="sm"
            asChild
            className={cn(
                "font-bold text-xs gap-2 border-gray-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 rounded-lg h-9 cursor-pointer",
                className
            )}
        >
            <a
                href={order.invoice_url}
                target="_blank"
                rel="noopener noreferrer"
                download={`Invoice-${order.order_id}.pdf`}
                title={`Download Invoice for Order #${order.order_id}`}
            >
                <Download className="w-4 h-4" />
                <span>Download Invoice</span>
            </a>
        </Button>
    );
};
