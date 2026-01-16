import { useState } from 'react';
import { FileText, AlertTriangle, X } from 'lucide-react';
import SignaturePad from './SignaturePad';

interface JunkRemovalAgreementProps {
  bookingData: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    start_date: string;
    delivery_address: string;
  };
  onComplete: (agreementData: JunkRemovalAgreementData) => void;
  onCancel: () => void;
}

export interface JunkRemovalAgreementData {
  customer_signature: string;
  agreed_date: string;
}

export default function JunkRemovalAgreement({ bookingData, onComplete, onCancel }: JunkRemovalAgreementProps) {
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signature, setSignature] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSignatureSave = (signatureData: string) => {
    setSignature(signatureData);
    setShowSignaturePad(false);
  };

  const handleComplete = () => {
    const agreementData: JunkRemovalAgreementData = {
      customer_signature: signature,
      agreed_date: new Date().toISOString(),
    };
    onComplete(agreementData);
  };

  const canComplete = signature && acceptedTerms;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-slate-700 text-white p-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">Junk Removal Agreement</h2>
                <p className="text-slate-200 text-sm">You Fill, We Dump Package</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700"><strong>Customer:</strong> {bookingData.customer_name}</p>
              <p className="text-sm text-gray-700"><strong>Email:</strong> {bookingData.customer_email}</p>
              <p className="text-sm text-gray-700"><strong>Phone:</strong> {bookingData.customer_phone}</p>
              <p className="text-sm text-gray-700"><strong>Service Date:</strong> {bookingData.start_date}</p>
              <p className="text-sm text-gray-700"><strong>Location:</strong> {bookingData.delivery_address}</p>
            </div>

            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-red-900 mb-2">
                    Prohibited Materials & Liability Agreement
                  </h3>
                  <p className="text-sm text-gray-800 mb-3">
                    By signing this agreement, you acknowledge and agree to the following terms:
                  </p>
                </div>
              </div>

              <div className="space-y-4 ml-9">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">1. Prohibited Materials</h4>
                  <p className="text-sm text-gray-800 mb-2">
                    You agree that you will <strong>NOT</strong> place any of the following hazardous or prohibited materials in the trailer:
                  </p>
                  <ul className="space-y-1 text-sm text-gray-800">
                    <li className="flex items-center gap-2">
                      <X className="h-4 w-4 text-red-600 flex-shrink-0" />
                      <span>Hazardous waste of any kind</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <X className="h-4 w-4 text-red-600 flex-shrink-0" />
                      <span>Chemicals, solvents, oils, or flammable liquids</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <X className="h-4 w-4 text-red-600 flex-shrink-0" />
                      <span>Paint, pesticides, or herbicides</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <X className="h-4 w-4 text-red-600 flex-shrink-0" />
                      <span>Asbestos, lead-based materials, or other toxic substances</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <X className="h-4 w-4 text-red-600 flex-shrink-0" />
                      <span>Propane tanks, compressed gas cylinders, or explosives</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <X className="h-4 w-4 text-red-600 flex-shrink-0" />
                      <span>Medical waste, biohazards, or infectious materials</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <X className="h-4 w-4 text-red-600 flex-shrink-0" />
                      <span>Batteries (automotive, industrial, or lithium)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <X className="h-4 w-4 text-red-600 flex-shrink-0" />
                      <span>Electronics containing mercury or other hazardous materials</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">2. Liability for Damages</h4>
                  <p className="text-sm text-gray-800">
                    You understand and agree that you are <strong>fully responsible and liable</strong> for any and all damages, costs, fines, penalties, or expenses incurred by Molalla Trailer Rental as a result of:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-800 mt-2 space-y-1 ml-4">
                    <li>Placing prohibited or hazardous materials in the trailer</li>
                    <li>Disposal facility rejection fees or special handling charges</li>
                    <li>Regulatory fines or penalties assessed due to prohibited materials</li>
                    <li>Cleanup costs for contaminated trailers or disposal sites</li>
                    <li>Damage to the trailer caused by prohibited materials</li>
                    <li>Any legal fees or costs associated with improper disposal</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">3. Inspection Rights</h4>
                  <p className="text-sm text-gray-800">
                    Molalla Trailer Rental reserves the right to inspect the trailer contents before removal. If prohibited materials are found, we may refuse to haul the load until such materials are removed at your expense, or we may charge additional fees for special handling and disposal.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">4. Additional Charges</h4>
                  <p className="text-sm text-gray-800">
                    If prohibited materials are discovered after pickup, you agree to pay all additional costs including but not limited to: special disposal fees, contamination cleanup, trailer decontamination, regulatory fines, and administrative fees. A minimum charge of <strong>$500</strong> will be assessed for any prohibited material violations, in addition to actual costs incurred.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-800">
                  <strong>I have read and understand the above agreement.</strong> I agree that I will not place any prohibited or hazardous materials in the trailer, and I accept full responsibility and liability for any damages, costs, fines, or penalties resulting from my violation of this agreement.
                </span>
              </label>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Customer Signature</h4>
              <p className="text-sm text-gray-600 mb-3">
                By signing below, you confirm that you have read, understood, and agree to comply with all terms stated in this agreement.
              </p>
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4">
                {signature ? (
                  <div className="space-y-3">
                    <img src={signature} alt="Signature" className="max-h-24 mx-auto" />
                    <button
                      onClick={() => setShowSignaturePad(true)}
                      className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Change Signature
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSignaturePad(true)}
                    className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Click to Sign
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Signed on: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="border-t bg-gray-50 p-6">
            <div className="flex gap-4">
              <button
                onClick={onCancel}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleComplete}
                disabled={!canComplete}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Complete Agreement
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSignaturePad && (
        <SignaturePad
          onSave={handleSignatureSave}
          onCancel={() => setShowSignaturePad(false)}
        />
      )}
    </div>
  );
}
