import { useState } from 'react';
import { Calendar, Truck, MapPin, Phone, Mail, User, MessageSquare, CheckCircle, Shield, Camera, Info, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import RentalAgreement from './RentalAgreement';
import JunkRemovalAgreement from './JunkRemovalAgreement';
import { FileUpload } from './FileUpload';
import { PaymentTrust } from './PaymentTrust';
import { Link } from 'react-router-dom';

type ServiceType = 'rental' | 'junk_removal';
type TrailerType = 'Southland 6x12 10k' | 'Southland 7x14 14k';
type JunkServiceLevel = 'you_fill' | 'full_service' | 'cleanout_special';
type JunkVolume = '1-2' | '3-4' | '5-6' | '7-9';

const TRAILER_PRICING = {
  'Southland 6x12 10k': {
    daily: 120,
    weekly: 750,
    monthly: 3000,
  },
  'Southland 7x14 14k': {
    daily: 130,
    weekly: 825,
    monthly: 3350,
  },
};

export function BookingForm() {
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
  const [showJunkAgreement, setShowJunkAgreement] = useState(false);
  const [pendingBookingId, setPendingBookingId] = useState<string | null>(null);
  const [driversLicenseFile, setDriversLicenseFile] = useState<File | null>(null);
  const [insuranceFile, setInsuranceFile] = useState<File | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [awaitingApproval, setAwaitingApproval] = useState(false);

  const [junkServiceLevel, setJunkServiceLevel] = useState<JunkServiceLevel>('full_service');
  const [junkVolume, setJunkVolume] = useState<JunkVolume>('3-4');
  const [junkAddOns, setJunkAddOns] = useState({
    noLift: false,
    priorityPickup: false,
    dumpFeeProtection: false,
  });
  const [junkPhotos, setJunkPhotos] = useState<File[]>([]);
  const [junkMaterialType, setJunkMaterialType] = useState('');

  const calculateJunkRemovalEstimate = () => {
    if (serviceType !== 'junk_removal') return null;

    // Calculate add-on costs first (applies to all service levels)
    let addOnCost = 0;
    if (junkAddOns.noLift) addOnCost += 75;
    if (junkAddOns.priorityPickup) addOnCost += 99;
    if (junkAddOns.dumpFeeProtection) addOnCost += 125;

    // Handle Cleanout Special pricing
    if (junkServiceLevel === 'cleanout_special') {
      return { min: 799 + addOnCost, max: 799 + addOnCost, isFixed: true };
    }

    const volumePricing: Record<JunkVolume, { min: number, max: number }> = {
      '1-2': { min: 150, max: 225 },
      '3-4': { min: 275, max: 375 },
      '5-6': { min: 425, max: 550 },
      '7-9': { min: 625, max: 750 },
    };

    let estimate = volumePricing[junkVolume];

    if (junkServiceLevel === 'you_fill') {
      estimate = { min: 250 + volumePricing[junkVolume].min, max: 250 + volumePricing[junkVolume].max };
    }

    return {
      min: estimate.min + addOnCost,
      max: estimate.max + addOnCost,
      isFixed: false
    };
  };

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
    if (serviceType === 'junk_removal') {
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

  const uploadJunkPhotos = async (bookingId: string): Promise<string[]> => {
    const photoUrls: string[] = [];

    for (let i = 0; i < junkPhotos.length; i++) {
      const file = junkPhotos[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${bookingId}_photo_${i + 1}_${Date.now()}.${fileExt}`;
      const filePath = `${bookingId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('junk-removal-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading junk photo:', uploadError);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('junk-removal-photos')
        .getPublicUrl(filePath);

      photoUrls.push(publicUrl);
    }

    return photoUrls;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (serviceType === 'rental' && (!driversLicenseFile || !insuranceFile)) {
      setErrorMessage('Please upload both your driver\'s license and insurance document.');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const deliveryFee = calculateDeliveryFee();
      const deposit = calculateDeposit();
      const totalPrice = calculateTotalPrice();

      let bookingNotes = formData.notes;
      if (serviceType === 'junk_removal') {
        const estimate = calculateJunkRemovalEstimate();
        const serviceLevelNames = {
          you_fill: 'You Fill, We Dump',
          full_service: 'Full-Service Junk Removal',
          cleanout_special: 'Cleanout Special'
        };
        bookingNotes = `Service Level: ${serviceLevelNames[junkServiceLevel]}\n`;
        bookingNotes += `Estimated Volume: ${junkVolume} cubic yards\n`;
        if (junkMaterialType) bookingNotes += `Material Type: ${junkMaterialType}\n`;
        if (junkAddOns.noLift) bookingNotes += `Add-on: No-Lift Guarantee (+$75)\n`;
        if (junkAddOns.priorityPickup) bookingNotes += `Add-on: Priority Pickup (+$99)\n`;
        if (junkAddOns.dumpFeeProtection) bookingNotes += `Add-on: Dump Fee Protection (+$125)\n`;
        if (estimate) {
          if (estimate.isFixed) {
            bookingNotes += `Estimated Price: $${estimate.min}\n`;
          } else {
            bookingNotes += `Estimated Price Range: $${estimate.min}-$${estimate.max}\n`;
          }
        }
        if (formData.notes) bookingNotes += `\nAdditional Notes:\n${formData.notes}`;
      }

      const hasJunkPhotos = serviceType === 'junk_removal' && junkPhotos.length > 0;
      const bookingStatus = hasJunkPhotos ? 'awaiting_approval' : 'pending';

      const bookingData = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        service_type: serviceType,
        trailer_type: serviceType === 'rental' ? trailerType : null,
        start_date: formData.start_date,
        end_date: serviceType === 'rental' ? formData.end_date : null,
        delivery_address: formData.delivery_address,
        delivery_required: formData.delivery_required,
        notes: bookingNotes,
        status: bookingStatus,
        total_price: totalPrice,
        delivery_fee: deliveryFee,
        deposit_amount: deposit,
      };

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-booking`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      const { bookingId } = await response.json();

      setPendingBookingId(bookingId);

      if (serviceType === 'rental' && driversLicenseFile && insuranceFile) {
        try {
          setUploadingFiles(true);

          const licenseUrl = await uploadFileToStorage(driversLicenseFile, bookingId, 'license');
          const insuranceUrl = await uploadFileToStorage(insuranceFile, bookingId, 'insurance');

          const { error: updateError } = await supabase
            .from('bookings')
            .update({
              drivers_license_url: licenseUrl,
              insurance_document_url: insuranceUrl
            })
            .eq('id', bookingId);

          if (updateError) {
            console.error('Error updating booking with document URLs:', updateError);
          }
        } catch (uploadError) {
          console.error('Error uploading documents:', uploadError);
          setErrorMessage('Warning: Booking created but documents failed to upload. Please contact us.');
        } finally {
          setUploadingFiles(false);
        }
      }

      if (serviceType === 'junk_removal' && junkPhotos.length > 0) {
        try {
          setUploadingFiles(true);
          const photoUrls = await uploadJunkPhotos(bookingId);

          const { error: updateError } = await supabase
            .from('bookings')
            .update({
              junk_photo_urls: photoUrls
            })
            .eq('id', bookingId);

          if (updateError) {
            console.error('Error updating booking with photo URLs:', updateError);
          }
        } catch (uploadError) {
          console.error('Error uploading junk photos:', uploadError);
          setErrorMessage('Warning: Booking created but photos failed to upload.');
        } finally {
          setUploadingFiles(false);
        }
      }

      if (serviceType === 'junk_removal') {
        if (hasJunkPhotos) {
          setAwaitingApproval(true);
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
          setJunkPhotos([]);
          setJunkMaterialType('');
        } else if (junkServiceLevel === 'you_fill') {
          setShowJunkAgreement(true);
        } else {
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
        }
      } else if (serviceType === 'rental' && !formData.delivery_required) {
        setShowAgreement(true);
      } else {
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
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      setSubmitStatus('error');
      setErrorMessage('Failed to submit booking. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAgreementComplete = async (agreementData: any) => {
    if (!pendingBookingId) return;

    setIsSubmitting(true);
    try {
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          ...agreementData,
          agreement_completed: true,
          rental_order_signature_date: new Date().toISOString(),
          terms_signature_date: new Date().toISOString(),
          trailer_details_signature_date: new Date().toISOString(),
        })
        .eq('id', pendingBookingId);

      if (updateError) {
        throw new Error('Failed to save agreement');
      }

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
    } catch (error) {
      console.error('Error completing agreement:', error);
      setErrorMessage('Failed to save agreement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJunkAgreementComplete = async (agreementData: any) => {
    if (!pendingBookingId) return;

    setIsSubmitting(true);
    try {
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          junk_agreement_signature: agreementData.customer_signature,
          junk_agreement_date: agreementData.agreed_date,
          agreement_completed: true,
        })
        .eq('id', pendingBookingId);

      if (updateError) {
        throw new Error('Failed to save junk removal agreement');
      }

      setSubmitStatus('success');
      setShowJunkAgreement(false);
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
    } catch (error) {
      console.error('Error completing junk removal agreement:', error);
      setErrorMessage('Failed to save agreement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJunkAgreementCancel = () => {
    setShowJunkAgreement(false);
    setPendingBookingId(null);
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

  if (showJunkAgreement && pendingBookingId) {
    return (
      <JunkRemovalAgreement
        bookingData={{
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          start_date: formData.start_date,
          delivery_address: formData.delivery_address,
        }}
        onComplete={handleJunkAgreementComplete}
        onCancel={handleJunkAgreementCancel}
      />
    );
  }

  if (submitStatus === 'success') {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 text-center max-w-2xl mx-auto">
        <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-green-900 mb-2">
          {awaitingApproval ? 'Request Submitted for Review!' : 'Almost Done!'}
        </h3>
        <p className="text-green-800 mb-6">
          {awaitingApproval
            ? "Thank you for submitting your junk removal request with photos! We'll review your photos, send you a detailed quote via email and QuickBooks invoice, and provide payment instructions within 24 hours."
            : "Thank you for your interest! Click below to complete your booking on our secure scheduling system."}
        </p>
        {!awaitingApproval && (
          <a
            href="https://clienthub.getjobber.com/booking/dc323018-2250-48de-8343-b2a45ce798a2"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg mb-4"
          >
            Complete Booking on Jobber
          </a>
        )}
        <button
          onClick={() => {
            setSubmitStatus('idle');
            setAwaitingApproval(false);
          }}
          className="block w-full bg-white text-green-600 border-2 border-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors font-semibold mt-4"
        >
          {awaitingApproval ? 'Submit Another Request' : 'Start Over'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Service Type</label>
          <div className="grid grid-cols-2 gap-4">
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
              className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            >
              <option value="Southland 6x12 10k">Southland 6x12 10k - $120/day • $750/week • $3,000/month</option>
              <option value="Southland 7x14 14k">Southland 7x14 14k - $130/day • $825/week • $3,350/month</option>
            </select>
          </div>
        )}

        {serviceType === 'junk_removal' && (
          <>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-2 mb-4">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Need Help with Pricing?</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Text photos of your junk to <a href="sms:503-874-3705" className="text-blue-600 font-semibold hover:underline">503-874-3705</a> for a fast, accurate quote. Or fill out the form below for an estimate.
                  </p>
                  <Link
                    to="/junk-removal-pricing"
                    onClick={() => window.scrollTo(0, 0)}
                    className="text-blue-600 font-semibold hover:underline text-sm"
                  >
                    View detailed pricing guide
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Choose Your Service Level *
              </label>
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setJunkServiceLevel('you_fill')}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    junkServiceLevel === 'you_fill'
                      ? 'border-gray-600 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900 mb-1">Good</div>
                  <div className="text-xs text-gray-600 mb-2">You Fill, We Dump</div>
                  <div className="text-sm text-gray-700">Most affordable</div>
                </button>
                <button
                  type="button"
                  onClick={() => setJunkServiceLevel('full_service')}
                  className={`p-4 rounded-lg border-2 transition-all text-left relative ${
                    junkServiceLevel === 'full_service'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">POPULAR</div>
                  <div className="font-semibold text-gray-900 mb-1">Better</div>
                  <div className="text-xs text-gray-600 mb-2">Full Service</div>
                  <div className="text-sm text-gray-700">We load everything</div>
                </button>
                <button
                  type="button"
                  onClick={() => setJunkServiceLevel('cleanout_special')}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    junkServiceLevel === 'cleanout_special'
                      ? 'border-slate-600 bg-slate-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900 mb-1">Best</div>
                  <div className="text-xs text-gray-600 mb-2">Cleanout Special</div>
                  <div className="text-sm text-gray-700">Full load, $799</div>
                </button>
              </div>
            </div>

            {junkServiceLevel !== 'cleanout_special' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Estimated Volume (Trailer Space) *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => setJunkVolume('1-2')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      junkVolume === '1-2'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-sm">1-2 yards</div>
                    <div className="text-xs text-gray-600">Small pile</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setJunkVolume('3-4')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      junkVolume === '3-4'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-sm">3-4 yards</div>
                    <div className="text-xs text-gray-600">Room cleanout</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setJunkVolume('5-6')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      junkVolume === '5-6'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-sm">5-6 yards</div>
                    <div className="text-xs text-gray-600">Bulky items</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setJunkVolume('7-9')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      junkVolume === '7-9'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-sm">7-15 yards</div>
                    <div className="text-xs text-gray-600">Full load</div>
                  </button>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="material_type" className="block text-sm font-semibold text-gray-700 mb-2">
                What are you removing?
              </label>
              <input
                type="text"
                id="material_type"
                value={junkMaterialType}
                onChange={(e) => setJunkMaterialType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Furniture, appliances, household junk, yard waste"
              />
              <p className="text-xs text-gray-500 mt-1">
                Note: Concrete, dirt, roofing, and hazardous materials require a custom quote
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Photos (Optional)
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Upload photos to help us provide an accurate quote. Your booking will be reviewed and you'll receive an invoice with payment instructions.
              </p>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      const newFiles = Array.from(e.target.files).slice(0, 5);
                      setJunkPhotos(prev => [...prev, ...newFiles].slice(0, 5));
                    }
                  }}
                  className="hidden"
                  id="junk-photos-upload"
                />
                <label
                  htmlFor="junk-photos-upload"
                  className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all"
                >
                  <Camera className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {junkPhotos.length > 0 ? `${junkPhotos.length} photo(s) selected` : 'Click to upload photos'}
                  </span>
                </label>
                {junkPhotos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {junkPhotos.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Junk photo ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => setJunkPhotos(prev => prev.filter((_, i) => i !== index))}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Upload up to 5 photos (JPEG, PNG). Max 10MB per photo.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Optional Add-Ons
              </label>
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-all">
                  <input
                    type="checkbox"
                    checked={junkAddOns.noLift}
                    onChange={(e) => setJunkAddOns(prev => ({ ...prev, noLift: e.target.checked }))}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">No-Lift Guarantee <span className="text-blue-600">+$75</span></div>
                    <div className="text-sm text-gray-600">You don't lift a thing — we load everything</div>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-all">
                  <input
                    type="checkbox"
                    checked={junkAddOns.priorityPickup}
                    onChange={(e) => setJunkAddOns(prev => ({ ...prev, priorityPickup: e.target.checked }))}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Priority Pickup <span className="text-purple-600">+$99</span></div>
                    <div className="text-sm text-gray-600">First available slot or same-day when available</div>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-all">
                  <input
                    type="checkbox"
                    checked={junkAddOns.dumpFeeProtection}
                    onChange={(e) => setJunkAddOns(prev => ({ ...prev, dumpFeeProtection: e.target.checked }))}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Dump Fee Protection <span className="text-green-600">+$125</span></div>
                    <div className="text-sm text-gray-600">Covers disposal costs up to 2 tons</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <Camera className="h-6 w-6 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Get the Most Accurate Quote</h3>
                  <p className="text-sm text-gray-700">
                    Text photos to <a href="sms:503-874-3705" className="text-blue-600 font-semibold hover:underline">503-874-3705</a> for the fastest, most accurate pricing.
                  </p>
                </div>
              </div>
            </div>
          </>
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
              className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
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
              className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              placeholder="503-874-3705"
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
              {serviceType === 'rental' ? 'Start Date' : 'Service Date'} *
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              required
              value={formData.start_date}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
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
                className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
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

        {(formData.delivery_required || serviceType === 'junk_removal') && (
          <div>
            <label htmlFor="delivery_address" className="block text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              {serviceType === 'rental' ? 'Delivery' : 'Service'} Address *
            </label>
            <input
              type="text"
              id="delivery_address"
              name="delivery_address"
              required={formData.delivery_required || serviceType === 'junk_removal'}
              value={formData.delivery_address}
              onChange={handleInputChange}
              className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              placeholder="123 Main St, Molalla, OR 97038"
            />
          </div>
        )}

        <div>
          <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
            <MessageSquare className="inline h-4 w-4 mr-1" />
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            value={formData.notes}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Tell us about your project or any special requirements..."
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

        {((serviceType === 'rental' && formData.start_date && formData.end_date) || serviceType === 'junk_removal') && (
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
              {serviceType === 'junk_removal' && (() => {
                const estimate = calculateJunkRemovalEstimate();
                return (
                  <div className="py-4">
                    {estimate && (
                      <>
                        <div className="text-center mb-3">
                          {estimate.isFixed ? (
                            <>
                              <p className="text-sm text-gray-600 mb-1">Estimated Price:</p>
                              <p className="text-3xl font-bold text-green-600">${estimate.min}</p>
                            </>
                          ) : (
                            <>
                              <p className="text-sm text-gray-600 mb-1">Estimated Price Range:</p>
                              <p className="text-3xl font-bold text-green-600">${estimate.min} - ${estimate.max}</p>
                            </>
                          )}
                        </div>
                        <div className="bg-white border border-green-300 rounded-lg p-3">
                          <p className="text-xs text-gray-700">
                            <strong>How it works:</strong> This is an estimate based on your selections.
                            Final pricing will be confirmed after we review your request and materials.
                            We'll contact you within 24 hours.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}
            </div>
            {serviceType === 'rental' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                <p className="text-sm text-blue-800 font-semibold mb-1">
                  💡 How Payment Works:
                </p>
                <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc">
                  <li>Pay rental fee + delivery (if selected) + $50 deposit today</li>
                  <li>Use trailer for your project</li>
                  <li>Return clean - get $50 deposit back in 2-3 business days</li>
                </ul>
              </div>
            )}
            {serviceType !== 'rental' && (
              <p className="text-sm text-gray-600 mt-3">
                * Final pricing will be provided after we review your request
              </p>
            )}
          </div>
        )}

        {serviceType === 'rental' && formData.start_date && formData.end_date && (
          <PaymentTrust />
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || uploadingFiles}
          className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {uploadingFiles ? 'Uploading Documents...' : isSubmitting ? 'Submitting...' : serviceType === 'rental' ? 'Request Booking' : 'Request Quote'}
        </button>

        <p className="text-sm text-gray-600 text-center">
          {serviceType === 'rental' && !formData.delivery_required
            ? 'After submitting, you\'ll complete the rental agreement with e-signature.'
            : serviceType === 'rental' && formData.delivery_required
            ? 'We\'ll contact you to confirm delivery details and pricing. No rental agreement needed for delivery.'
            : 'By submitting, you agree to be contacted about your booking request. We\'ll call or text you at the number provided to confirm details.'}
        </p>
      </form>
    </div>
  );
}
