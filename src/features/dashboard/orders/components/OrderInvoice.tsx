import React from 'react';
import { Order } from '../types';
import { FileText, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface OrderInvoiceProps {
    order: Order;
    variant?: 'link' | 'outline' | 'button';
}

export const OrderInvoice: React.FC<OrderInvoiceProps> = ({ order, variant = 'link' }) => {
    const [isDownloading, setIsDownloading] = React.useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            // High fidelity printing approach using a separate window
            // This bypasses html2canvas oklab issues and CORS image restrictions
            const printContent = document.getElementById('invoice-content');
            if (!printContent) return;

            const printWindow = window.open('', '', 'height=800,width=1000');
            if (!printWindow) {
                alert('Please allow popups to download the invoice.');
                return;
            }

            const styles = Array.from(document.styleSheets)
                .map(styleSheet => {
                    try {
                        return Array.from(styleSheet.cssRules)
                            .map(rule => rule.cssText)
                            .join('');
                    } catch (e) {
                        return '';
                    }
                })
                .join('');

            printWindow.document.write('<html><head><title>Invoice - ' + order.order_id + '</title>');
            printWindow.document.write('<style>' + styles + '</style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write('<div style="padding: 20px;">' + printContent.innerHTML + '</div>');
            printWindow.document.write('<script>window.onload = function() { window.print(); window.close(); }</script>');
            printWindow.document.write('</body></html>');
            printWindow.document.close();

        } catch (error) {
            console.error('Download failed:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    const formattedDate = new Date(order.createdAt).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const getTrigger = () => {
        if (variant === 'link') {
            return (
                <Button 
                    variant="link" 
                    size="sm" 
                    className="text-blue-600 hover:text-blue-700 h-auto p-0 font-bold text-[10px] md:text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                    <FileText className="w-3.5 h-3.5" />
                    View Invoice
                </Button>
            );
        }

        return (
            <Button 
                variant="outline" 
                size="sm" 
                className="font-bold text-xs gap-2 border-gray-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 rounded-lg h-9 cursor-pointer"
            >
                <FileText className="w-4 h-4" />
                <span>Order Invoice</span>
            </Button>
        );
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {getTrigger()}
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto p-0 border-none shadow-2xl">
                {/* Accessibility: DialogTitle and DialogDescription are required */}
                <div className="sr-only">
                    <DialogHeader>
                        <DialogTitle>Order Invoice - {order.order_id}</DialogTitle>
                        <DialogDescription>
                            This invoice contains billing and shipping details for order number {order.order_id}, placed on {formattedDate}.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div id="invoice-content" className="p-8 md:p-12 bg-white text-[#1a1a1a] min-h-full flex flex-col" style={{ backgroundColor: '#ffffff', color: '#1a1a1a' }}>
                    {/* Invoice Header */}
                    <div className="flex justify-between items-start mb-12 gap-6 pb-8 border-b-2 border-[#0a7c43]">
                        <div className="space-y-4">
                            <img 
                                src="/logos/panun-logo.svg" 
                                alt="PANUN" 
                                className="h-12 md:h-16 w-auto object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                            <div className="text-xs text-[#666666] leading-relaxed font-medium">
                                <p className="text-sm font-bold text-[#111111] mb-1">PANUN E-Commerce Solutions</p>
                                <p>Srinagar, Jammu & Kashmir, India</p>
                                <p>Contact: +91 9149959600</p>
                                <p>Email: support@panun.com</p>
                            </div>
                        </div>
                        <div className="text-right flex flex-col justify-between h-full">
                            <div>
                                <h2 className="text-3xl font-black text-[#0a7c43] uppercase tracking-tighter mb-2 italic">INVOICE</h2>
                                <p className="text-sm font-bold text-[#111111]"># INV-{order.order_id.slice(-8).toUpperCase()}</p>
                                <p className="text-xs text-[#666666] mt-1">Date: {formattedDate}</p>
                            </div>
                            <div className="mt-8">
                                <p className="text-[10px] font-bold text-[#999999] uppercase tracking-[0.2em] mb-1">Order #</p>
                                <p className="text-sm font-mono font-bold bg-[#f3f4f6] px-3 py-1.5 rounded inline-block">{order.order_id}</p>
                            </div>
                        </div>
                    </div>

                    {/* Customer & Shipping Info */}
                    <div className="grid grid-cols-2 gap-12 mb-12">
                        <div className="bg-[#f9fafb] p-6 rounded-2xl border border-[#f3f4f6]">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#0a7c43] mb-4">Bill To</h4>
                            <div className="space-y-1">
                                <p className="font-bold text-lg text-[#111111] leading-none mb-2">{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                                <p className="text-sm text-[#4b5563] flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-[#d1d5db]"></span>
                                    {order.shipping_address.email}
                                </p>
                                <p className="text-sm text-[#4b5563] flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-[#d1d5db]"></span>
                                    {order.shipping_address.phone_number}
                                </p>
                            </div>
                        </div>
                        <div className="p-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#0a7c43] mb-4">Ship To</h4>
                            <p className="text-sm text-[#1f2937] leading-relaxed font-semibold italic">
                                {order.shipping_address.address}
                            </p>
                            <p className="text-sm text-[#4b5563] mt-1">
                                {order.shipping_address.city}, {order.shipping_address.state}
                            </p>
                            <p className="text-sm text-[#4b5563]">
                                {order.shipping_address.country} - <span className="font-bold text-[#111111]">{order.shipping_address.postal_code}</span>
                            </p>
                        </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="mb-12 flex-grow">
                        <table className="w-full text-left text-sm border-separate border-spacing-y-2">
                            <thead>
                                <tr className="text-[#9ca3af] font-black uppercase text-[10px] tracking-widest">
                                    <th className="px-4 py-2">Product Description</th>
                                    <th className="px-4 py-2 text-center">Qty</th>
                                    <th className="px-4 py-2 text-right">Unit Price</th>
                                    <th className="px-4 py-2 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.order_items.map((item) => (
                                    <tr key={item._id} className="bg-white hover:bg-[#f9fafb] transition-colors">
                                        <td className="px-4 py-5 rounded-l-2xl border-l border-y border-[#f3f4f6]">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 bg-[#f9fafb] rounded-xl p-2 flex-shrink-0 border border-[#f3f4f6] shadow-sm overflow-hidden flex items-center justify-center">
                                                    <img 
                                                        src={item.product_logo} 
                                                        alt={item.product_name} 
                                                        className="max-w-full max-h-full object-contain mix-blend-multiply" 
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                                                        }}
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-[#111111] text-sm mb-0.5">{item.product_name}</p>
                                                    <p className="text-[10px] text-[#9ca3af] font-bold uppercase tracking-wide">{item.product_brand} • {item.product_dimension}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5 text-center font-black text-[#374151] border-y border-[#f3f4f6] italic">{item.no_of_products}</td>
                                        <td className="px-4 py-5 text-right font-bold text-[#6b7280] border-y border-[#f3f4f6]">₹{item.product_price.toLocaleString()}</td>
                                        <td className="px-4 py-5 text-right font-black text-[#111111] border-r border-y border-[#f3f4f6] rounded-r-2xl">₹{item.total_price.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Price Calculation Bottom Row */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-12 mt-auto border-t-2 border-[#f9fafb] pt-12">
                        <div className="max-w-xs">
                            <p className="text-[10px] font-black uppercase text-[#9ca3af] tracking-widest mb-3">Notes & Instructions</p>
                            <p className="text-[10px] text-[#6b7280] leading-normal italic bg-[#f9fafb] p-4 rounded-xl border border-[#f3f4f6]">
                                Thank you for your purchase. Please note that items can be returned within 15 days of delivery provided they are in original condition. Keep this invoice for warranty purposes.
                            </p>
                        </div>
                        <div className="w-full md:w-[300px] space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-[#9ca3af] uppercase tracking-widest text-[10px]">Subtotal</span>
                                <span className="font-black text-[#111111]">₹{order.total_amount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-[#9ca3af] uppercase tracking-widest text-[10px]">Shipping</span>
                                <span className="font-black text-[#0a7c43] italic">FREE</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-[#9ca3af] uppercase tracking-widest text-[10px]">GST (Calculated)</span>
                                <span className="font-black text-[#111111]">Included</span>
                            </div>
                            <div className="pt-4 border-t-2 border-[#f9fafb]">
                                <div className="flex justify-between items-center p-4 bg-[#0a7c43] rounded-2xl shadow-xl">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Amount Paid</span>
                                    <span className="text-2xl font-black text-white italic tracking-tighter">₹{order.total_amount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 text-center no-print pb-8 flex flex-wrap justify-center gap-4">
                         <Button 
                            onClick={handleDownload} 
                            disabled={isDownloading}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded-full px-12 h-14 font-bold shadow-xl shadow-emerald-600/20 disabled:bg-gray-400 cursor-pointer"
                        >
                            {isDownloading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <Download className="w-5 h-5" />
                                    <span>Download Invoice</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{ __html: `
                    @media print {
                        /* Force a clear background on body */
                        @page { margin: 0; size: auto; }
                        body { 
                            background: #ffffff !important;
                            margin: 0 !important;
                            padding: 0 !important;
                        }

                        /* Hide main page elements */
                        #__next, 
                        main, 
                        header, 
                        nav, 
                        footer, 
                        .no-print,
                        [role="overlay"] { 
                            display: none !important; 
                        }

                        /* Reset Radix Dialog wrapper to allow full page print */
                        [role="dialog"] {
                            position: static !important;
                            width: 100% !important;
                            height: auto !important;
                            max-width: none !important;
                            border: none !important;
                            box-shadow: none !important;
                            padding: 0 !important;
                            margin: 0 !important;
                        }

                        #invoice-content {
                            display: block !important;
                            position: static !important;
                            width: 100% !important;
                            padding: 40px !important;
                            margin: 0 !important;
                        }

                        /* Ensure high quality colors and layout */
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                    }
                ` }} />
            </DialogContent>
        </Dialog>
    );
};
