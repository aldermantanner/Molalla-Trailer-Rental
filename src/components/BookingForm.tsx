import { useState } from 'react';
import { Calendar, MapPin, Phone, Mail, User, MessageSquare, CheckCircle, Camera, Info, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import JunkRemovalAgreement from './JunkRemovalAgreement';
import { Link } from 'react-router-dom';

type JunkServiceLevel = 'you_fill' | 'full_service' | 'cleanout_special';
type JunkVolume = '1-2' | '3-4' | '5-6' | '7-9';

export function BookingForm() {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    start_date: '',
    delivery_address: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showJunkAgreement, setShowJunkAgreement] = useState(false);
  const [pendingBookingId, setPendingBookingId] = useState<string | null>(null);
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
    let addOnCost = 0;
    if (junkAddOns.noLift) addOnCost += 75;
    if (junkAddOns.priorityPickup) addOnCost += 99;
    if (junkAddOns.dumpFeeProtection) addOnCost += 125;

    if (junkServiceLevel === 'cleanout_special') {
      return { min: 799 + addOnCost, max: 799 + addOnCost, isFixed: true };
    }

    const volumePricing: Record<JunkVolume, { min: number; max: number }> = {
      '1-2': { min: 150, max: 225 },
      '3-4': { min: 275, max: 375 },
      '5-6': { min: 425, max: 550 },
      '7-9': { min: 625, max: 750 },
    };

    let estimate = volumePricing[junkVolume];
    if (junkServiceLevel === 'you_fill') {
      estimate = {
        min: 250 + volumePricing[junkVolume].min,
        max: 250 + volumePricing[junkVolume].max,
      };
    }

    return { min: estimate.min + addOnCost, max: estimate.max + addOnCost, isFixed: false };
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
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

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
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const estimate = calculateJunkRemovalEstimate();
      const serviceLevelNames = {
        you_fill: 'You Fill, We Dump',
        full_service: 'Full-Service Junk Removal',
        cleanout_special: 'Cleanout Special',
      };
      let bookingNotes = `Service Level: ${serviceLevelNames[junkServiceLevel]}\n`;
      bookingNotes += `Estimated Volume: ${junkVolume} cubic yards\n`;
      if (junkMaterialType) bookingNotes += `Material Type: ${junkMaterialType}\n`;
      if (junkAddOns.noLift) bookingNotes += `Add-on: No-Lift Guarantee (+$75)\n`;
      if (junkAddOns.priorityPickup) bookingNotes += `Add-on: Priority Pickup (+$99)\n`;
      if (junkAddOns.dumpFeeProtection) bookingNotes += `Add-on: Dump Fee Protection (+$125)\n`;
      if (estimate) {
        bookingNotes += estimate.isFixed
          ? `Estimated Price: $${estimate.min}\n`
          : `Estimated Price Range: $${estimate.min}-$${estimate.max}\n`;
      }
      if (formData.notes) bookingNotes += `\nAdditional Notes:\n${formData.notes}`;

      const hasJunkPhotos = junkPhotos.length > 0;
      const bookingStatus = hasJunkPhotos ? 'awaiting_approval' : 'pending';

      const bookingData = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        service_type: 'junk_removal',
        trailer_type: null,
        start_date: formData.start_date,
        end_date: null,
        delivery_address: formData.delivery_address,
        delivery_required: true,
        notes: bookingNotes,
        status: bookingStatus,
        total_price: 0,
        delivery_fee: 0,
        deposit_amount: 0,
      };

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-booking`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      const { bookingId } = await response.json();
      setPendingBookingId(bookingId);

      if (hasJunkPhotos) {
        try {
          setUploadingFiles(true);
          const photoUrls = await uploadJunkPhotos(bookingId);
          const { error: updateError } = await supabase
            .from('bookings')
            .update({ junk_photo_urls: photoUrls })
            .eq('id', bookingId);
          if (updateError) console.error('Error updating booking with photo URLs:', updateError);
        } catch (uploadError) {
          console.error('Error uploading junk photos:', uploadError);
          setErrorMessage('Warning: Booking created but photos failed to upload.');
        } finally {
          setUploadingFiles(false);
        }
      }

      const resetForm = () => {
        setFormData({ customer_name: '', customer_email: '', customer_phone: '', start_date: '', delivery_address: '', notes: '' });
        setJunkPhotos([]);
        setJunkMaterialType('');
      };

      if (hasJunkPhotos) {
        setAwaitingApproval(true);
        setSubmitStatus('success');
        setPendingBookingId(null);
        resetForm();
      } else if (junkServiceLevel === 'you_fill') {
        setShowJunkAgreement(true);
      } else {
        setSubmitStatus('success');
        setPendingBookingId(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      setSubmitStatus('error');
      setErrorMessage('Failed to submit booking. Please try again or call us directly.');
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

      if (updateError) throw new Error('Failed to save junk removal agreement');

      setSubmitStatus('success');
      setShowJunkAgreement(false);
      setPendingBookingId(null);
      setFormData({ customer_name: '', customer_email: '', customer_phone: '', start_date: '', delivery_address: '', notes: '' });
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
            ? "Thank you for submitting your junk removal request with photos! We'll review your photos, send you a detailed quote via email, and provide payment instructions within 24 hours."
            : "Thank you for your interest! Click below to complete your booking on our secure scheduling system."}
        </p>
        {!awaitingApproval && (
          <a
            href="https://clienthub.getjobber.com/hubs/935796ca-8da1-401b-a3dd-604659dcbf70/public/requests/2258657/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg mb-4"
          >
            Complete Booking on Jobber
          </a>
        )}
        <button
          onClick={() => { setSubmitStatus('idle'); setAwaitingApproval(false); }}
          className="block w-full bg-white text-green-600 border-2 border-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors font-semibold mt-4"
        >
          {awaitingApproval ? 'Submit Another Request' : 'Start Over'}
        </button>
      </div>
    );
  }

  const estimate = calculateJunkRemovalEstimate();

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-3xl mx-auto">
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-lg mb-6 text-center shadow-lg">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-2xl">🇺🇸</span>
          <span className="font-bold text-lg">Special Discount Available</span>
        </div>
        <p className="text-sm">Veterans, First Responders & Police receive 10% OFF - Mention when booking</p>
      </div>
      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-2 mb-4">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Need Help with Pricing?</h3>
              <p className="text-sm text-gray-700 mb-3">
                Text photos of your junk to{' '}
                <a href="sms:503-874-3705" className="text-blue-600 font-semibold hover:underline">503-874-3705</a>{' '}
                for a fast, accurate quote. Or fill out the form below for an estimate.
              </p>
              <Link
                to="/pricing"
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
                junkServiceLevel === 'you_fill' ? 'border-gray-600 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
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
                junkServiceLevel === 'full_service' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300'
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
                junkServiceLevel === 'cleanout_special' ? 'border-slate-600 bg-slate-50' : 'border-gray-200 hover:border-gray-300'
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
              Estimated Volume (Truck Space) *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {([
                ['1-2', '1-2 yards', 'Small pile'],
                ['3-4', '3-4 yards', 'Room cleanout'],
                ['5-6', '5-6 yards', 'Bulky items'],
                ['7-9', '7-15 yards', 'Full load'],
              ] as const).map(([val, label, sub]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setJunkVolume(val)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    junkVolume === val ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-sm">{label}</div>
                  <div className="text-xs text-gray-600">{sub}</div>
                </button>
              ))}
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">Photos (Optional)</label>
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
            <p className="text-xs text-gray-500">Upload up to 5 photos (JPEG, PNG). Max 10MB per photo.</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Optional Add-Ons</label>
          <div className="space-y-3">
            {([
              ['noLift', 'No-Lift Guarantee', '+$75', 'text-blue-600', "You don't lift a thing — we load everything"],
              ['priorityPickup', 'Priority Pickup', '+$99', 'text-purple-600', 'First available slot or same-day when available'],
              ['dumpFeeProtection', 'Dump Fee Protection', '+$125', 'text-green-600', 'Covers disposal costs up to 2 tons'],
            ] as const).map(([key, label, price, color, desc]) => (
              <label key={key} className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-all">
                <input
                  type="checkbox"
                  checked={junkAddOns[key]}
                  onChange={(e) => setJunkAddOns(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{label} <span className={color}>{price}</span></div>
                  <div className="text-sm text-gray-600">{desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Camera className="h-6 w-6 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Get the Most Accurate Quote</h3>
              <p className="text-sm text-gray-700">
                Text photos to{' '}
                <a href="sms:503-874-3705" className="text-blue-600 font-semibold hover:underline">503-874-3705</a>{' '}
                for the fastest, most accurate pricing.
              </p>
            </div>
          </div>
        </div>

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

        <div>
          <label htmlFor="start_date" className="block text-sm font-semibold text-gray-700 mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            Preferred Service Date *
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

        <div>
          <label htmlFor="delivery_address" className="block text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="inline h-4 w-4 mr-1" />
            Service Address *
          </label>
          <input
            type="text"
            id="delivery_address"
            name="delivery_address"
            required
            value={formData.delivery_address}
            onChange={handleInputChange}
            className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            placeholder="123 Main St, Molalla, OR 97038"
          />
        </div>

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

        {estimate && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="py-4 text-center">
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
              <div className="bg-white border border-green-300 rounded-lg p-3 mt-3">
                <p className="text-xs text-gray-700">
                  <strong>How it works:</strong> This is an estimate based on your selections. Final pricing will be confirmed after we review your request. We'll contact you within 24 hours.
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">* Final pricing will be provided after we review your request</p>
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
          className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {uploadingFiles ? 'Uploading Photos...' : isSubmitting ? 'Submitting...' : 'Request Quote'}
        </button>

        <p className="text-sm text-gray-600 text-center">
          By submitting, you agree to be contacted about your booking request. We'll call or text you at the number provided to confirm details.
        </p>
      </form>
    </div>
  );
}
