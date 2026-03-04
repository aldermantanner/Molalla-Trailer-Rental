import { Download, FileText, CheckCircle } from 'lucide-react';
import type { QBOInvoiceResponse } from '../types/quickbooks';

interface InvoiceDisplayProps {
  invoiceData: QBOInvoiceResponse;
}

export default function InvoiceDisplay({ invoiceData }: InvoiceDisplayProps) {
  const handleDownloadPDF = () => {
    const byteCharacters = atob(invoiceData.links.pdf.base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${invoiceData.invoice.docNumber || invoiceData.invoice.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-center mb-6">
        <CheckCircle className="w-16 h-16 text-green-600" />
      </div>

      <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
        Booking Confirmed!
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Your invoice has been created and sent to your email.
      </p>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Invoice Number</p>
            <p className="text-lg font-semibold text-gray-900">
              {invoiceData.invoice.docNumber || invoiceData.invoice.id}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Customer</p>
            <p className="text-lg font-semibold text-gray-900">
              {invoiceData.customer.displayName}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Invoice Date</p>
            <p className="text-lg font-semibold text-gray-900">
              {invoiceData.invoice.txnDate || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Due Date</p>
            <p className="text-lg font-semibold text-gray-900">
              {invoiceData.invoice.dueDate || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-blue-600">
              ${invoiceData.invoice.totalAmt?.toFixed(2) || '0.00'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Balance Due</p>
            <p className="text-2xl font-bold text-orange-600">
              ${invoiceData.invoice.balance?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleDownloadPDF}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold"
        >
          <Download className="w-5 h-5" />
          Download Invoice PDF
        </button>

        {invoiceData.links.payNowUrl && (
          <a
            href={invoiceData.links.payNowUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-semibold block"
          >
            <FileText className="w-5 h-5" />
            Pay Now Online
          </a>
        )}

        <div className="pt-4 text-center">
          <p className="text-sm text-gray-600">
            A copy of this invoice has been sent to your email.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Questions? Contact us at{' '}
            <a href="mailto:molallatrailerrental@gmail.com" className="text-blue-600 hover:underline">
              molallatrailerrental@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
