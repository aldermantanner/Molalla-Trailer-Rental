import { useState } from 'react';
import { Calendar, Truck, MapPin, Phone, Mail, User, MessageSquare, CheckCircle, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import RentalAgreement from './RentalAgreement';
import { FileUpload } from './FileUpload';

type ServiceType = 'rental' | 'junk_removal' | 'material_delivery';
type TrailerType = 'Southland 6x12 10k' | 'Southland 7x14 14k';

const TRAILER_PRICING = {
  'Southland 6x12 10k': {
    daily: 120,
    weekly: 825,
    monthly: 3250,
  },
  'Southland 7x14 14k': {
    daily: 130,
    weekly: 900,
    monthly: 3550,
  },
};

export function BookingForm() {
  console.log('🚀 BookingForm component mounted/rendered');

  const [serviceType, setServiceType] = useState<ServiceType>('rental');
  const [trailerType, setTrailerType] = useState<TrailerType>('Southland 7x14 14k');
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    start_date: '',
    end_date: '',
    delivery_address: '',
    delivery_required: false,
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAgreement, setShowAgreement] = useState(false);
  const [pendingBookingId, setPendingBookingId] = useState<string | null>(null);
  const [driversLicenseFile, setDriversLicenseFile] = useState<File | null>(null);
  const [insuranceFile, setInsuranceFile] = useState<File | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const calculateDeliveryFee = () => {
    if (serviceType === 'rental' && formData.delivery_required) {
      return 30;
    }
    return 0;
  };

  const calculateDeposit = () => {
    if (serviceType === 'rental') {
      return 50;
    }
    return 0;
  };

  const calculateBasePrice = () => {
    if (serviceType === 'junk_removal' || serviceType === 'material_delivery') {
      return 0;
    }

    if (!formData.start_date || !formData.end_date) {
      return TRAILER_PRICING[trailerType].daily;
    }

    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    if (days >= 30) {
      return TRAILER_PRICING[trailerType].monthly;
    } else if (days >= 7) {
      const weeks = Math.ceil(days / 7);
      return weeks * TRAILER_PRICING[trailerType].weekly;
    } else {
      return days * TRAILER_PRICING[trailerType].daily;
    }
  };

  const calculateTotalPrice = () => {
    const basePrice = calculateBasePrice();
    const deliveryFee = calculateDeliveryFee();
    const deposit = calculateDeposit();
    return basePrice + deliveryFee + deposit;
  };

  const uploadFileToStorage = async (file: File, bookingId: string, fileType: 'license' | 'insurance'): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${bookingId}_${fileType}_${Date.now()}.${fileExt}`;
    const filePath = `documents/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('booking-documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('booking-documents')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('📝 handleSubmit called');
    e.preventDefault();
    console.log('✅ preventDefault called');
    console.log('📋 Form data:', formData);

    if (serviceType === 'rental' && (!driversLicenseFile || !insuranceFile)) {
      setErrorMessage('Please upload both your driver\'s license and insurance document.');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const basePrice = calculateBasePrice();
      const deliveryFee = calculateDeliveryFee();
      const deposit = calculateDeposit();
      const totalPrice = calculateTotalPrice();

      console.log('Calculated prices:', { basePrice, deliveryFee, deposit, totalPrice });

      const { data, error } = await supabase.from('bookings').insert({
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        service_type: serviceType,
        trailer_type: serviceType === 'rental' ? trailerType : null,
        start_date: formData.start_date,
        end_date: serviceType === 'rental' ? formData.end_date : null,
        delivery_address: formData.delivery_address,
        delivery_required: formData.delivery_required,
        notes: formData.notes,
        status: 'pending',
        total_price: totalPrice,
        delivery_fee: deliveryFee,
        deposit_amount: deposit,
      }).select().single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Booking created with ID:', data.id);
      setPendingBookingId(data.id);

      if (serviceType === 'rental' && driversLicenseFile && insuranceFile) {
        try {
          setUploadingFiles(true);
          console.log('Uploading documents...');

          const licenseUrl = await uploadFileToStorage(driversLicenseFile, data.id, 'license');
          const insuranceUrl = await uploadFileToStorage(insuranceFile, data.id, 'insurance');

          const { error: updateError } = await supabase
            .from('bookings')
            .update({
              drivers_license_url: licenseUrl,
              insurance_document_url: insuranceUrl
            })
            .eq('id', data.id);

          if (updateError) {
            console.error('Error updating booking with document URLs:', updateError);
          } else {
            console.log('Documents uploaded successfully');
          }
        } catch (uploadError) {
          console.error('Error uploading documents:', uploadError);
          setErrorMessage('Warning: Booking created but documents failed to upload. Please contact us.');
        } finally {
          setUploadingFiles(false);
        }
      }

      console.log('Service type:', serviceType, 'Delivery required:', formData.delivery_required);

      if (serviceType === 'junk_removal' || serviceType === 'material_delivery') {
        console.log('Quote request submitted - no payment required');
        setSubmitStatus('success');
        setPendingBookingId(null);
        setFormData({
          customer_name: '',
          customer_email: '',
          customer_phone: '',
          start_date: '',
          end_date: '',
          delivery_address: '',
          delivery_required: false,
          notes: '',
        });
      } else if (serviceType === 'rental' && !formData.delivery_required) {
        console.log('Showing rental agreement');
        setShowAgreement(true);
      } else {
        console.log('Calling handleStripeCheckout');
        await handleStripeCheckout(data.id);
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      setSubmitStatus('error');
      setErrorMessage('Failed to submit booking. Please try again or call us directly.');
    } finally {
      console.log('Finally block - setting isSubmitting to false');
      setIsSubmitting(false);
    }
  };

  const handleAgreementComplete = async (agreementData: any) => {
    if (!pendingBookingId) return;

    setIsSubmitting(true);
    try {
      const totalPrice = calculateTotalPrice();
      if (totalPrice > 0) {
        await handleStripeCheckout(pendingBookingId, agreementData);
      } else {
        setSubmitStatus('success');
        setShowAgreement(false);
        setPendingBookingId(null);
        setFormData({
          customer_name: '',
          customer_email: '',
          customer_phone: '',
          start_date: '',
          end_date: '',
          delivery_address: '',
          delivery_required: false,
          notes: '',
        });
      }
    } catch (error) {
      console.error('Error completing agreement:', error);
      setErrorMessage('Failed to save agreement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStripeCheckout = async (bookingId: string, agreementData?: any) => {
    try {
      console.log('Starting Stripe checkout for booking:', bookingId);

      if (agreementData) {
        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            ...agreementData,
            agreement_completed: true,
            rental_order_signature_date: new Date().toISOString(),
            terms_signature_date: new Date().toISOString(),
            trailer_details_signature_date: new Date().toISOString(),
          })
          .eq('id', bookingId);

        if (updateError) {
          throw new Error('Failed to save agreement');
        }
      }

      const origin = window.location.origin;
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          bookingId,
          successUrl: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${origin}/?canceled=true`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      if (!url) {
        throw new Error('No checkout URL returned');
      }

      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setErrorMessage(`Payment processing error: ${errorMsg}. Please contact us directly at 503-500-6121.`);
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };

  const handleAgreementCancel = async () => {
    if (pendingBookingId) {
      await supabase.from('bookings').delete().eq('id', pendingBookingId);
    }
    setShowAgreement(false);
    setPendingBookingId(null);
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  if (showAgreement && pendingBookingId) {
    return (
      <RentalAgreement
        bookingData={{
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          start_date: formData.start_date,
          end_date: formData.end_date,
          delivery_address: formData.delivery_address,
          service_type: serviceType,
          total_price: calculateTotalPrice(),
          trailer_type: trailerType,
        }}
        onComplete={handleAgreementComplete}
        onCancel={handleAgreementCancel}
      />
    );
  }

  if (submitStatus === 'success') {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 text-center max-w-2xl mx-auto">
        <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-green-900 mb-2">Booking Complete!</h3>
        <p className="text-green-800 mb-6">
          {serviceType === 'rental'
            ? "Thank you for completing your rental agreement. We'll contact you shortly at the phone number you provided to confirm your trailer rental."
            : "Thank you for your quote request! We'll review your request and contact you within 24 hours with a detailed quote and payment instructions."}
        </p>
        <button
          onClick={() => setSubmitStatus('idle')}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          Make Another Booking
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Service Type</label>
          <div className="grid grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setServiceType('rental')}
              className={`p-4 rounded-lg border-2 transition-all ${
                serviceType === 'rental'
                  ? 'border-green-600 bg-green-50 text-green-900'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Truck className="h-6 w-6 mx-auto mb-2" />
              <div className="font-semibold">Trailer Rental</div>
              <div className="text-sm text-gray-600">Starting at $120/day</div>
            </button>
            <button
              type="button"
              onClick={() => setServiceType('junk_removal')}
              className={`p-4 rounded-lg border-2 transition-all ${
                serviceType === 'junk_removal'
                  ? 'border-green-600 bg-green-50 text-green-900'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Truck className="h-6 w-6 mx-auto mb-2" />
              <div className="font-semibold">Junk Removal</div>
              <div className="text-sm text-gray-600">Custom Quote</div>
            </button>
            <button
              type="button"
              onClick={() => setServiceType('material_delivery')}
              className={`p-4 rounded-lg border-2 transition-all ${
                serviceType === 'material_delivery'
                  ? 'border-green-600 bg-green-50 text-green-900'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Truck className="h-6 w-6 mx-auto mb-2" />
              <div className="font-semibold">Material Delivery</div>
              <div className="text-sm text-gray-600">Dirt, Gravel, Mulch</div>
            </button>
          </div>
        </div>

        {serviceType === 'rental' && (
          <div>
            <label htmlFor="trailer_type" className="block text-sm font-semibold text-gray-700 mb-2">
              <Truck className="inline h-4 w-4 mr-1" />
              Select Trailer *
            </label>
            <select
              id="trailer_type"
              value={trailerType}
              onChange={(e) => setTrailerType(e.target.value as TrailerType)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="Southland 6x12 10k">Southland 6x12 10k - $120/day • $825/week • $3,250/month</option>
              <option value="Southland 7x14 14k">Southland 7x14 14k - $130/day • $900/week • $3,550/month</option>
            </select>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="customer_name" className="block text-sm font-semibold text-gray-700 mb-2">
              <User className="inline h-4 w-4 mr-1" />
              Full Name *
            </label>
            <input
              type="text"
              id="customer_name"
              name="customer_name"
              autoComplete="off"
              required
              value={formData.customer_name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="customer_phone" className="block text-sm font-semibold text-gray-700 mb-2">
              <Phone className="inline h-4 w-4 mr-1" />
              Phone Number *
            </label>
            <input
              type="tel"
              id="customer_phone"
              name="customer_phone"
              autoComplete="off"
              required
              value={formData.customer_phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="503-500-6121"
            />
          </div>
        </div>

        <div>
          <label htmlFor="customer_email" className="block text-sm font-semibold text-gray-700 mb-2">
            <Mail className="inline h-4 w-4 mr-1" />
            Email Address *
          </label>
          <input
            type="email"
            id="customer_email"
            name="customer_email"
            autoComplete="off"
            required
            value={formData.customer_email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="john@example.com"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="start_date" className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              {serviceType === 'rental' ? 'Start Date' : serviceType === 'material_delivery' ? 'Delivery Date' : 'Service Date'} *
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              required
              value={formData.start_date}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {serviceType === 'rental' && (
            <div>
              <label htmlFor="end_date" className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                End Date *
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                required={serviceType === 'rental'}
                value={formData.end_date}
                onChange={handleInputChange}
                min={formData.start_date || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {serviceType === 'rental' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Truck className="inline h-4 w-4 mr-1" />
              Pickup or Delivery *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, delivery_required: false }))}
                className={`p-4 rounded-lg border-2 transition-all ${
                  !formData.delivery_required
                    ? 'border-green-600 bg-green-50 text-green-900'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">I'll Pick Up</div>
                <div className="text-sm text-gray-600">33250 S Wilhoit Rd, Molalla</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, delivery_required: true }))}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.delivery_required
                    ? 'border-green-600 bg-green-50 text-green-900'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">Deliver to Me</div>
                <div className="text-sm text-gray-600">Delivery fee applies</div>
              </button>
            </div>
          </div>
        )}

        {(formData.delivery_required || serviceType === 'junk_removal' || serviceType === 'material_delivery') && (
          <div>
            <label htmlFor="delivery_address" className="block text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              {serviceType === 'rental' ? 'Delivery' : serviceType === 'material_delivery' ? 'Delivery' : 'Service'} Address *
            </label>
            <input
              type="text"
              id="delivery_address"
              name="delivery_address"
              required={formData.delivery_required || serviceType === 'junk_removal' || serviceType === 'material_delivery'}
              value={formData.delivery_address}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="123 Main St, Molalla, OR 97038"
            />
          </div>
        )}

        <div>
          <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
            <MessageSquare className="inline h-4 w-4 mr-1" />
            {serviceType === 'material_delivery' ? 'Material Type & Quantity *' : 'Additional Notes'}
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            value={formData.notes}
            onChange={handleInputChange}
            required={serviceType === 'material_delivery'}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder={serviceType === 'material_delivery'
              ? "Please specify: Rock ($350-$550/7 yards depending on type), Fill Dirt ($100/7 yards), or Mulch ($280-$445/7 yards depending on mix)"
              : "Tell us about your project or any special requirements..."}
          />
        </div>

        {serviceType === 'rental' && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 space-y-6">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Required Documents</h3>
                <p className="text-sm text-gray-700 mb-4">
                  For your safety and ours, we require a valid driver's license and proof of insurance for all trailer rentals.
                  Your information is securely stored and only used for rental verification purposes.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <FileUpload
                label="Driver's License"
                accept=".jpg,.jpeg,.png,.pdf"
                maxSizeMB={5}
                onFileSelect={setDriversLicenseFile}
                required={true}
                helpText="Upload a clear photo or scan of your valid driver's license"
              />

              <FileUpload
                label="Insurance Document"
                accept=".jpg,.jpeg,.png,.pdf"
                maxSizeMB={5}
                onFileSelect={setInsuranceFile}
                required={true}
                helpText="Upload your current auto insurance card or policy document"
              />
            </div>

            <div className="bg-white border border-blue-200 rounded p-3">
              <p className="text-xs text-gray-600">
                <strong>Privacy Notice:</strong> Your documents are encrypted and stored securely. We only use this information
                to verify rental eligibility and will never share it with third parties. Documents are automatically deleted
                30 days after your rental period ends.
              </p>
            </div>
          </div>
        )}

        {((serviceType === 'rental' && formData.start_date && formData.end_date) || serviceType === 'junk_removal' || serviceType === 'material_delivery') && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="space-y-2">
              {serviceType === 'rental' && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Rental Fee:</span>
                    <span className="text-lg font-semibold text-gray-900">${calculateBasePrice()}</span>
                  </div>
                  {calculateDeliveryFee() > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Delivery Fee:</span>
                      <span className="text-lg font-semibold text-gray-900">${calculateDeliveryFee()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Refundable Deposit:</span>
                    <span className="text-lg font-semibold text-gray-900">${calculateDeposit()}</span>
                  </div>
                  <div className="border-t border-green-300 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-semibold">Total Due Now:</span>
                      <span className="text-2xl font-bold text-green-600">${calculateTotalPrice()}</span>
                    </div>
                  </div>
                </>
              )}
              {(serviceType === 'junk_removal' || serviceType === 'material_delivery') && (
                <div className="text-center py-4">
                  <p className="text-lg font-semibold text-gray-900">Custom Quote Required</p>
                  <p className="text-sm text-gray-600 mt-2">We'll contact you with pricing details</p>
                </div>
              )}
            </div>
            {serviceType === 'rental' && (
              <p className="text-sm text-gray-600 mt-3">
                * $50 deposit is refundable after trailer inspection
              </p>
            )}
            {serviceType !== 'rental' && (
              <p className="text-sm text-gray-600 mt-3">
                * Final pricing will be provided after we review your request
              </p>
            )}
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || uploadingFiles}
          onMouseDown={() => console.log('🖱️ Mouse down on button')}
          onClick={() => console.log('🔘 Button onClick fired')}
          className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {uploadingFiles ? 'Uploading Documents...' : isSubmitting ? 'Submitting...' : serviceType === 'rental' ? 'Request Booking' : 'Request Quote'}
        </button>

        <p className="text-sm text-gray-600 text-center">
          {serviceType === 'rental' && !formData.delivery_required
            ? 'After submitting, you\'ll complete the rental agreement with e-signature.'
            : serviceType === 'rental' && formData.delivery_required
            ? 'We\'ll contact you to confirm delivery details and pricing. No rental agreement needed for delivery.'
            : serviceType === 'material_delivery'
            ? 'We\'ll contact you to confirm material availability, delivery details, and final pricing.'
            : 'By submitting, you agree to be contacted about your booking request. We\'ll call or text you at the number provided to confirm details.'}
        </p>
      </form>
    </div>
  );
}
