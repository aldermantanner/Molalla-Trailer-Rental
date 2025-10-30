import { Shield, CreditCard, DollarSign, RefreshCw } from 'lucide-react';

export function PaymentTrust() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-slate-50 border-2 border-blue-200 rounded-xl p-6 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-bold text-slate-800">Secure & Flexible Payment</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">We Accept</h4>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm bg-slate-100 px-2 py-1 rounded font-semibold">Visa</span>
                <span className="text-sm bg-slate-100 px-2 py-1 rounded font-semibold">Mastercard</span>
                <span className="text-sm bg-slate-100 px-2 py-1 rounded font-semibold">Amex</span>
                <span className="text-sm bg-slate-100 px-2 py-1 rounded font-semibold">Discover</span>
              </div>
              <div className="flex gap-2 items-center mt-2">
                <span className="text-sm bg-blue-100 px-2 py-1 rounded font-semibold text-blue-700">Venmo</span>
                <span className="text-sm bg-green-100 px-2 py-1 rounded font-semibold text-green-700">Cash</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
              <RefreshCw className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">$50 Deposit</h4>
              <p className="text-sm text-gray-600">
                Fully refundable when trailer is returned clean and undamaged
              </p>
              <p className="text-xs text-green-600 font-semibold mt-2">
                ✓ Returned within 2-3 business days
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="bg-yellow-100 rounded-full p-2 flex-shrink-0">
            <DollarSign className="h-5 w-5 text-yellow-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-slate-800 mb-2">Transparent Pricing</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rental Fee:</span>
                <span className="font-semibold text-slate-800">Based on duration</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee:</span>
                <span className="font-semibold text-slate-800">$30 (if selected)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Security Deposit:</span>
                <span className="font-semibold text-slate-800">$50 (refundable)</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between">
                <span className="font-bold text-slate-800">You Pay Today:</span>
                <span className="font-bold text-green-600">Rental + Delivery + Deposit</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
        <Shield className="h-4 w-4 text-green-600" />
        <span>256-bit SSL encryption • PCI compliant • Your data is secure</span>
      </div>
    </div>
  );
}
