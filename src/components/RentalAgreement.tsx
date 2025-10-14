import { useState } from 'react';
import { FileText, CheckCircle } from 'lucide-react';
import SignaturePad from './SignaturePad';

interface RentalAgreementProps {
  bookingData: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    start_date: string;
    end_date: string | null;
    delivery_address: string;
    service_type: string;
    total_price: number;
    trailer_type: string;
  };
  onComplete: (agreementData: AgreementData) => void;
  onCancel: () => void;
}

interface AgreementData {
  customer_address: string;
  customer_city: string;
  customer_state: string;
  customer_zip: string;
  drivers_license_number: string;
  drivers_license_state: string;
  date_of_birth: string;
  insurance_carrier: string;
  insurance_policy_number: string;
  insurance_phone: string;
  insurance_expiration: string;
  pickup_time: string;
  return_time: string;
  pickup_type: string;
  return_type: string;
  order_deposit: number;
  terms_initials: string[];
  rental_order_signature: string;
  terms_signature: string;
  trailer_details_signature: string;
}

export default function RentalAgreement({ bookingData, onComplete, onCancel }: RentalAgreementProps) {
  const [step, setStep] = useState(1);
  const [showSignaturePad, setShowSignaturePad] = useState<'rental' | 'terms' | 'trailer' | null>(null);

  const [formData, setFormData] = useState({
    customer_address: '',
    customer_city: '',
    customer_state: '',
    customer_zip: '',
    drivers_license_number: '',
    drivers_license_state: '',
    date_of_birth: '',
    insurance_carrier: '',
    insurance_policy_number: '',
    insurance_phone: '',
    insurance_expiration: '',
    pickup_time: '',
    return_time: '',
    pickup_type: 'pickup',
    return_type: 'return',
    order_deposit: 50,
  });

  const [initials, setInitials] = useState<string[]>(['', '', '', '', '', '', '']);
  const [signatures, setSignatures] = useState({
    rental_order: '',
    terms: '',
    trailer: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInitialChange = (index: number, value: string) => {
    const newInitials = [...initials];
    newInitials[index] = value;
    setInitials(newInitials);
  };

  const handleSignatureSave = (signature: string) => {
    if (showSignaturePad === 'rental') {
      setSignatures(prev => ({ ...prev, rental_order: signature }));
    } else if (showSignaturePad === 'terms') {
      setSignatures(prev => ({ ...prev, terms: signature }));
    } else if (showSignaturePad === 'trailer') {
      setSignatures(prev => ({ ...prev, trailer: signature }));
    }
    setShowSignaturePad(null);
  };

  const canProceedStep1 = () => {
    return (
      formData.customer_address &&
      formData.customer_city &&
      formData.customer_state &&
      formData.customer_zip &&
      formData.drivers_license_number &&
      formData.drivers_license_state &&
      formData.date_of_birth &&
      formData.insurance_carrier &&
      formData.insurance_policy_number &&
      formData.insurance_phone &&
      formData.insurance_expiration &&
      formData.pickup_time &&
      formData.return_time &&
      signatures.rental_order
    );
  };

  const canProceedStep2 = () => {
    return initials.every(initial => initial.length > 0) && signatures.terms;
  };

  const handleComplete = () => {
    const agreementData: AgreementData = {
      ...formData,
      terms_initials: initials,
      rental_order_signature: signatures.rental_order,
      terms_signature: signatures.terms,
      trailer_details_signature: signatures.trailer,
    };
    onComplete(agreementData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-slate-700 text-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-8 w-8" />
              <h2 className="text-2xl font-bold">Rental Agreement</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex-1 h-2 rounded ${step >= 1 ? 'bg-green-400' : 'bg-gray-400'}`} />
              <div className={`flex-1 h-2 rounded ${step >= 2 ? 'bg-green-400' : 'bg-gray-400'}`} />
              <div className={`flex-1 h-2 rounded ${step >= 3 ? 'bg-green-400' : 'bg-gray-400'}`} />
            </div>
          </div>

          <div className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">Rental Order Information</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-700"><strong>Trailer:</strong> {bookingData.trailer_type}</p>
                    <p className="text-sm text-gray-700"><strong>Pickup Date:</strong> {bookingData.start_date}</p>
                    <p className="text-sm text-gray-700"><strong>Return Date:</strong> {bookingData.end_date || 'TBD'}</p>
                    <p className="text-sm text-gray-700"><strong>Deposit:</strong> ${formData.order_deposit}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pickup Time *</label>
                    <input
                      type="time"
                      name="pickup_time"
                      value={formData.pickup_time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Return Time *</label>
                    <input
                      type="time"
                      name="return_time"
                      value={formData.return_time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pickup Type *</label>
                    <select
                      name="pickup_type"
                      value={formData.pickup_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    >
                      <option value="pickup">Pickup</option>
                      <option value="delivery">Delivery</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Return Type *</label>
                    <select
                      name="return_type"
                      value={formData.return_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    >
                      <option value="return">Return</option>
                      <option value="pickup">Pickup</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Customer Information</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address *</label>
                      <input
                        type="text"
                        name="customer_address"
                        value={formData.customer_address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                        <input
                          type="text"
                          name="customer_city"
                          value={formData.customer_city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                        <input
                          type="text"
                          name="customer_state"
                          value={formData.customer_state}
                          onChange={handleInputChange}
                          maxLength={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Zip Code *</label>
                        <input
                          type="text"
                          name="customer_zip"
                          value={formData.customer_zip}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Driver Information</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Driver's License # *</label>
                      <input
                        type="text"
                        name="drivers_license_number"
                        value={formData.drivers_license_number}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">License State *</label>
                      <input
                        type="text"
                        name="drivers_license_state"
                        value={formData.drivers_license_state}
                        onChange={handleInputChange}
                        maxLength={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth *</label>
                      <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Insurance Information</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Insurance Carrier *</label>
                      <input
                        type="text"
                        name="insurance_carrier"
                        value={formData.insurance_carrier}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Policy Number *</label>
                      <input
                        type="text"
                        name="insurance_policy_number"
                        value={formData.insurance_policy_number}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Insurance Phone *</label>
                      <input
                        type="tel"
                        name="insurance_phone"
                        value={formData.insurance_phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Policy Expiration *</label>
                      <input
                        type="date"
                        name="insurance_expiration"
                        value={formData.insurance_expiration}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Customer Signature</h4>
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {signatures.rental_order ? (
                      <div className="space-y-3">
                        <img src={signatures.rental_order} alt="Signature" className="max-h-24 mx-auto" />
                        <button
                          onClick={() => setShowSignaturePad('rental')}
                          className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                          Change Signature
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowSignaturePad('rental')}
                        className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                      >
                        Click to Sign
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    By signing, you acknowledge that you have read and agree to the terms and conditions.
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">Terms and Conditions</h3>
                  <p className="text-sm text-gray-600 mb-4">Please read each section carefully and initial where indicated.</p>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">1. Definitions</h4>
                    <p className="text-sm text-gray-700 mb-3">
                      "Agreement" means all terms and conditions found in this rental agreement. "You" or "your" means the renter. "We" or "our" means Molalla Trailer Rental. "Trailer" means the non-motorized trailer identified in this Agreement.
                    </p>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold text-gray-700">Initial:</label>
                      <input
                        type="text"
                        maxLength={3}
                        value={initials[0]}
                        onChange={(e) => handleInitialChange(0, e.target.value)}
                        className="w-20 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">2. Rental, Indemnity and Warranties</h4>
                    <p className="text-sm text-gray-700 mb-3">
                      This is a contract for rental of the Trailer. We make no warranties regarding the Trailer, no warranty of merchantability and no warranty that the Trailer is fit for a particular purpose.
                    </p>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold text-gray-700">Initial:</label>
                      <input
                        type="text"
                        maxLength={3}
                        value={initials[1]}
                        onChange={(e) => handleInitialChange(1, e.target.value)}
                        className="w-20 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">3. Condition and Return of Trailer</h4>
                    <p className="text-sm text-gray-700 mb-3">
                      You must return the Trailer on the date and time specified, in the same condition received except for ordinary wear. Late returns incur a $50 per hour fee.
                    </p>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold text-gray-700">Initial:</label>
                      <input
                        type="text"
                        maxLength={3}
                        value={initials[2]}
                        onChange={(e) => handleInitialChange(2, e.target.value)}
                        className="w-20 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">4. Responsibility for Damage or Loss</h4>
                    <p className="text-sm text-gray-700 mb-3">
                      You are responsible for all damage to, or loss or theft of, the Trailer, whether or not you are at fault. You must report all accidents to us and the police within 24 hours.
                    </p>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold text-gray-700">Initial:</label>
                      <input
                        type="text"
                        maxLength={3}
                        value={initials[3]}
                        onChange={(e) => handleInitialChange(3, e.target.value)}
                        className="w-20 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">5. Prohibited Uses</h4>
                    <p className="text-sm text-gray-700 mb-3">
                      Prohibited uses include: transporting dangerous materials, persons, or illegal items; use by unauthorized drivers; use under the influence; overloading; and intentional damage.
                    </p>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold text-gray-700">Initial:</label>
                      <input
                        type="text"
                        maxLength={3}
                        value={initials[4]}
                        onChange={(e) => handleInitialChange(4, e.target.value)}
                        className="w-20 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">6. Cancellation & Refund Policy</h4>
                    <p className="text-sm text-gray-700 mb-3">
                      <strong>IMPORTANT:</strong> Cancellations must be made through your customer portal. <strong>More than 24 hours before rental start:</strong> 100% refund (minus deposit). <strong>12-24 hours before rental start:</strong> 50% refund (minus deposit). <strong>Less than 12 hours before rental start:</strong> NO REFUND. The $50 deposit is always non-refundable upon cancellation and will be refunded only after trailer inspection upon return.
                    </p>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold text-gray-700">Initial:</label>
                      <input
                        type="text"
                        maxLength={3}
                        value={initials[5]}
                        onChange={(e) => handleInitialChange(5, e.target.value)}
                        className="w-20 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">7. Insurance & Additional Terms</h4>
                    <p className="text-sm text-gray-700 mb-3">
                      You must maintain automobile liability insurance. You agree to pay all charges, late fees (5%), and costs.
                    </p>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold text-gray-700">Initial:</label>
                      <input
                        type="text"
                        maxLength={3}
                        value={initials[6] || ''}
                        onChange={(e) => handleInitialChange(6, e.target.value)}
                        className="w-20 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Terms & Conditions Signature</h4>
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {signatures.terms ? (
                      <div className="space-y-3">
                        <img src={signatures.terms} alt="Signature" className="max-h-24 mx-auto" />
                        <button
                          onClick={() => setShowSignaturePad('terms')}
                          className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                          Change Signature
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowSignaturePad('terms')}
                        className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                      >
                        Click to Sign
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">Trailer Details Acknowledgment</h3>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Trailer: {bookingData.trailer_type}</h4>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2">Trailer Components</h5>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Ramps (2) - $200 each</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Spare tire (1) - $200</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Solar battery charger (1) - $100</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2">Included Items</h5>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>5,000 Lb ratchet straps (2)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>1,000 Lb ratchet straps (2)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Chain binders (2)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>14 ft 3/8 chain (2)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Bottle jack (1)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Tire iron (1)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-gray-800">
                    <strong>Acknowledgment:</strong> I certify I will carefully inspect the Trailer and all components and included equipment, and find them all to be present and in clean, satisfactory condition. I acknowledge that I am responsible for returning all items in good, clean, working condition or else I will be required to pay for any damaged, missing, or dirty items.
                  </p>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Trailer Details Signature</h4>
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {signatures.trailer ? (
                      <div className="space-y-3">
                        <img src={signatures.trailer} alt="Signature" className="max-h-24 mx-auto" />
                        <button
                          onClick={() => setShowSignaturePad('trailer')}
                          className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                          Change Signature
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowSignaturePad('trailer')}
                        className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                      >
                        Click to Sign
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t bg-gray-50 p-6">
            <div className="flex justify-between">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 ? !canProceedStep1() : !canProceedStep2()}
                  className="ml-auto bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={!signatures.trailer}
                  className="ml-auto bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Complete Agreement
                </button>
              )}
            </div>
            {step === 1 && (
              <button
                onClick={onCancel}
                className="mt-3 w-full text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Cancel and Return
              </button>
            )}
          </div>
        </div>
      </div>

      {showSignaturePad && (
        <SignaturePad
          onSave={handleSignatureSave}
          onCancel={() => setShowSignaturePad(null)}
        />
      )}
    </div>
  );
}
