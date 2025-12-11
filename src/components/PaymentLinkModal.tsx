import { useState } from 'react';
import { Copy, Check, X } from 'lucide-react';
import { Booking } from '../lib/supabase';

interface PaymentLinkModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentLinkModal({ booking, isOpen, onClose }: PaymentLinkModalProps) {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !booking) return null;

  const generatePaymentLink = async () => {
    if (!paymentAmount) return;

    setIsGenerating(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-link`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          bookingId: booking.id,
          amount: parseFloat(paymentAmount),
          description: paymentDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment link');
      }

      const { url } = await response.json();
      setGeneratedLink(url);
    } catch (error) {
      console.error('Error generating payment link:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setGeneratedLink('');
    setPaymentAmount('');
    setPaymentDescription('');
    setCopied(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-slate-800">Generate Payment Link</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-600 mb-2">
              <strong>Customer:</strong> {booking.customer_name}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Email:</strong> {booking.customer_email}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Service:</strong> {booking.service_type.replace('_', ' ')}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount ($) *
              </label>
              <input
                type="number"
                step="0.01"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="600.00"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description (optional)
              </label>
              <input
                type="text"
                value={paymentDescription}
                onChange={(e) => setPaymentDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Junk Removal Service"
              />
            </div>

            {generatedLink && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-green-800 mb-2">
                  Payment Link Generated!
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={generatedLink}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-green-300 rounded text-sm"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Send this link to the customer via email or text
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
          {!generatedLink && (
            <button
              onClick={generatePaymentLink}
              disabled={!paymentAmount || isGenerating}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 font-semibold"
            >
              {isGenerating ? 'Generating...' : 'Generate Link'}
            </button>
          )}
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
