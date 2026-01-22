import { useRef, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import {
  ArrowLeft,
  Download,
  Printer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { InventoryBillDetail } from '../types';
import { inventoryService } from '../services/inventoryService';
import { Loader } from '@/components/loader/Loader';

interface BillSummaryProps {
  billId: string;
  onBack: () => void;
}

export function BillSummary({ billId, onBack }: BillSummaryProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [bill, setBill] = useState<InventoryBillDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBillDetails();
  }, [billId]);

  const fetchBillDetails = async () => {
    try {
      setIsLoading(true);
      const response = await inventoryService.getInventoryBillById(billId);
      if (response.success) {
        setBill(response.data);
      }
    } catch (error) {
      console.error('Error fetching bill details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    if (!bill) return;
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bill ${bill.bill_number}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', system-ui, sans-serif; padding: 40px; color: #111827; background: #fff; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #f3f4f6; padding-bottom: 20px; }
            .logo-section h1 { font-size: 24px; font-weight: 800; color: #4F80FF; letter-spacing: -0.025em; }
            .logo-section p { font-size: 12px; color: #6b7280; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
            .bill-meta { text-align: right; }
            .bill-meta h2 { font-size: 18px; font-weight: 700; color: #111827; }
            .bill-meta p { font-size: 13px; color: #6b7280; margin-top: 4px; }
            .info-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
            .info-block h3 { font-size: 12px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
            .info-block p { font-size: 14px; color: #374151; font-weight: 500; line-height: 1.5; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { text-align: left; padding: 12px; font-size: 12px; font-weight: 700; color: #374151; border-bottom: 1px solid #e5e7eb; background: #f9fafb; }
            td { padding: 16px 12px; font-size: 14px; color: #4b5563; border-bottom: 1px solid #f3f4f6; }
            .product-name { font-weight: 600; color: #111827; }
            .totals-section { display: flex; justify-content: flex-end; }
            .totals-table { width: 300px; }
            .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
            .total-row.grand { border-top: 2px solid #f3f4f6; margin-top: 10px; padding-top: 15px; }
            .total-label { font-size: 14px; color: #6b7280; font-weight: 500; }
            .total-value { font-size: 14px; color: #111827; font-weight: 600; }
            .grand .total-label { font-size: 16px; color: #111827; font-weight: 700; }
            .grand .total-value { font-size: 24px; color: #4F80FF; font-weight: 800; }
            .footer { margin-top: 80px; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px; }
            .footer p { font-size: 12px; color: #9ca3af; line-height: 1.6; }
            @media print { body { padding: 0; } .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-section">
              <h1>NETGENE</h1>
              <p>Inventory Dashboard</p>
            </div>
            <div class="bill-meta">
              <h2>Purchase Bill ${bill.bill_number}</h2>
              <p>${bill.bill_date}</p>
            </div>
          </div>
          
          <div class="info-grid">
            <div class="info-block">
              <h3>Billed From</h3>
              <p>NetGene Inventory Systems<br/>Billing Department<br/>Terminal 4, Global Heights<br/>contact@netgene.io</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>SUPPLIER</th>
                <th style="text-align: center">UNIT</th>
                <th style="text-align: center">QTY</th>
                <th style="text-align: right">PRICE</th>
                <th style="text-align: right">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              ${bill.items.map(item => `
                <tr>
                  <td>
                    <div class="product-name">${item.product}</div>
                  </td>
                  <td>${item.supplier}</td>
                  <td style="text-align: center; font-weight: 600; color: #4F80FF;">${item.unit}</td>
                  <td style="text-align: center">${item.qty}</td>
                  <td style="text-align: right">${item.price}</td>
                  <td style="text-align: right; font-weight: 600; color: #111827;">${item.total}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals-section">
            <div class="totals-table">
              <div class="total-row">
                <span class="total-label">Subtotal</span>
                <span class="total-value">₹${bill.grand_total}</span>
              </div>
              <div class="total-row grand">
                <span class="total-label">Grand Total</span>
                <span class="total-value">₹${bill.grand_total}</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>This is a computer generated document. No signature is required.</p>
            <p>&copy; ${new Date().getFullYear()} NetGene Dashboard. All rights reserved.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownloadPDF = () => {
    if (!bill) return;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 25;

    // --- Header Section (matching print template) ---
    // Logo/Company Name
    doc.setFontSize(20);
    doc.setTextColor(79, 128, 255); // Primary blue color
    doc.setFont('helvetica', 'bold');
    doc.text('NETGENE', 20, yPos);

    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.setFont('helvetica', 'normal');
    doc.text('INVENTORY DASHBOARD', 20, yPos + 6);

    // Bill Info (Right aligned)
    doc.setFontSize(14);
    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'bold');
    doc.text('Purchase Bill', pageWidth - 20, yPos, { align: 'right' });

    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39);
    doc.text(`${bill.bill_number}`, pageWidth - 20, yPos + 7, { align: 'right' });

    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.setFont('helvetica', 'normal');
    doc.text(bill.bill_date, pageWidth - 20, yPos + 13, { align: 'right' });

    // Border line
    yPos += 22;
    doc.setDrawColor(243, 244, 246);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, pageWidth - 20, yPos);

    yPos += 15;

    // --- Billed From Section ---
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.setFont('helvetica', 'bold');
    doc.text('BILLED FROM', 20, yPos);

    yPos += 5;
    doc.setFontSize(9);
    doc.setTextColor(55, 65, 81);
    doc.setFont('helvetica', 'normal');
    doc.text('NetGene Inventory Systems', 20, yPos);
    doc.text('Billing Department', 20, yPos + 4);
    doc.text('Terminal 4, Global Heights', 20, yPos + 8);
    doc.text('contact@netgene.io', 20, yPos + 12);

    yPos += 25;

    // --- Table ---
    // Table header background
    doc.setFillColor(249, 250, 251);
    doc.rect(20, yPos - 5, pageWidth - 40, 10, 'F');

    // Table headers
    doc.setFontSize(8);
    doc.setTextColor(55, 65, 81);
    doc.setFont('helvetica', 'bold');

    doc.text('PRODUCT', 22, yPos);
    doc.text('SUPPLIER', 82, yPos);
    doc.text('UNIT', 122, yPos, { align: 'center' });
    doc.text('QTY', 142, yPos, { align: 'center' });
    doc.text('PRICE', 165, yPos, { align: 'right' });
    doc.text('TOTAL', pageWidth - 22, yPos, { align: 'right' });

    yPos += 10;

    // Table rows
    doc.setFontSize(9);
    bill.items.forEach((item, index) => {
      if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = 25;
      }

      // Product
      doc.setTextColor(17, 24, 39);
      doc.setFont('helvetica', 'bold');
      doc.text(item.product.substring(0, 25), 22, yPos);

      // Supplier
      doc.setTextColor(75, 85, 99);
      doc.setFont('helvetica', 'normal');
      doc.text(item.supplier.substring(0, 18), 82, yPos);

      // Unit
      doc.setTextColor(79, 128, 255);
      doc.setFont('helvetica', 'bold');
      doc.text(item.unit, 122, yPos, { align: 'center' });

      // Qty
      doc.setTextColor(17, 24, 39);
      doc.setFont('helvetica', 'normal');
      doc.text(`${item.qty}`, 142, yPos, { align: 'center' });

      // Price
      doc.setTextColor(75, 85, 99);
      doc.text(item.price, 165, yPos, { align: 'right' });

      // Total
      doc.setTextColor(17, 24, 39);
      doc.setFont('helvetica', 'bold');
      doc.text(item.total, pageWidth - 22, yPos, { align: 'right' });

      // Row border
      doc.setDrawColor(243, 244, 246);
      doc.setLineWidth(0.3);
      doc.line(20, yPos + 3, pageWidth - 20, yPos + 3);

      yPos += 10;
    });

    yPos += 10;

    // --- Totals Section ---
    const totalsX = pageWidth - 80;

    // Subtotal
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.setFont('helvetica', 'normal');
    doc.text('Subtotal', totalsX, yPos);
    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'bold');
    doc.text(bill.grand_total, pageWidth - 22, yPos, { align: 'right' });

    yPos += 8;

    // Grand Total box
    doc.setFillColor(243, 244, 246);
    doc.roundedRect(totalsX - 5, yPos - 5, 65, 12, 1, 1, 'F');

    doc.setFontSize(10);
    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'bold');
    doc.text('Grand Total', totalsX, yPos + 2);

    doc.setFontSize(14);
    doc.setTextColor(79, 128, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(bill.grand_total, pageWidth - 22, yPos + 2, { align: 'right' });

    // --- Footer ---
    yPos = pageHeight - 20;
    doc.setFontSize(7);
    doc.setTextColor(156, 163, 175);
    doc.setFont('helvetica', 'normal');
    doc.text('This is a computer generated document. No signature is required.', pageWidth / 2, yPos, { align: 'center' });
    doc.text(`© ${new Date().getFullYear()} NetGene Dashboard. All rights reserved.`, pageWidth / 2, yPos + 4, { align: 'center' });

    doc.save(`Invoice-${bill.bill_number}.pdf`);
  };

  if (isLoading) {
    return <Loader fullScreen={true} message="Generating bill..." />;
  }


  if (!bill) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-destructive font-medium">Failed to load bill details.</p>
        <Button onClick={onBack} variant="outline">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-500">
      {/* Action Bar - Minimalist */}
      <div className="flex items-center justify-between bg-background/80 backdrop-blur-sm p-4 rounded-xl border border-border shadow-sm sticky top-0 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="hover:bg-accent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="h-9">
            <Printer className="w-4 h-4 mr-2" />
            Print Bill
          </Button>
          {/* <Button variant="default" size="sm" onClick={handleDownloadPDF} className="h-9 shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button> */}
        </div>
      </div>

      {/* Bill View - Cleanest Layout */}
      <Card className="border-none shadow-nav overflow-hidden bg-white">
        <div ref={printRef} className="p-8 sm:p-12">
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight">NETGENE</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Inventory Dashboard</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-primary uppercase">Bill Info</p>
              <h2 className="text-lg font-black text-gray-900 mt-1">{bill.bill_number}</h2>
              <p className="text-[10px] font-medium text-gray-400 mt-1">{bill.bill_date}</p>
            </div>
          </div>

          {/* Table */}
          <div className="mb-12 overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product</th>
                  <th className="py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Supplier</th>
                  <th className="py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unit</th>
                  <th className="py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qty</th>
                  <th className="py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</th>
                  <th className="py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bill.items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-6">
                      <p className="font-bold text-gray-900 text-sm">{item.product}</p>
                    </td>
                    <td className="py-6">
                      <p className="text-xs text-gray-500 font-medium">{item.supplier}</p>
                    </td>
                    <td className="py-6 text-center">
                      <span className="inline-block text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/5 rounded uppercase tracking-wider">
                        {item.unit}
                      </span>
                    </td>
                    <td className="py-6 text-center font-bold text-gray-900 text-sm">{item.qty}</td>
                    <td className="py-6 text-right text-gray-600 text-sm font-medium">₹{item.price}</td>
                    <td className="py-6 text-right font-black text-gray-900 text-sm">₹{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-48 pt-6 border-t border-gray-100">
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</span>
                <span className="text-xl font-black text-primary tracking-tighter">
                  ₹{bill.grand_total}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

