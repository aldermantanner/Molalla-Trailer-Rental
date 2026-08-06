import { useState, useEffect, useRef } from 'react';
import { Phone, Trash2, Star, Shield, CheckCircle, Truck, Clock, MessageSquare, ArrowRight, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SEOHead } from '../components/SEOHead';

type ServiceType = 'junk_removal' | 'appliance' | 'cleanout' | 'debris' | 'yard' | 'other';

interface LeadForm {
  name: string;
  phone: string;
  email: string;
  zip_code: string;
  service_type: ServiceType | '';
  message: string;
}

const serviceOptions: { value: ServiceType; label: string; icon: typeof Trash2 }[] = [
  { value: 'junk_removal', label: 'General Junk Removal', icon: Trash2 },
  { value: 'appliance', label: 'Appliance Removal', icon: Truck },
  { value: 'cleanout', label: 'Garage / Estate Cleanout', icon: CheckCircle },
  { value: 'debris', label: 'Construction Debris', icon: Shield },
  { value: 'yard', label: 'Yard Waste Cleanup', icon: Star },
  { value: 'other', label: 'Something Else', icon: MessageSquare },
];

const JOBBER_URL = 'https://clienthub.getjobber.com/hubs/935796ca-8da1-401b-a3dd-604659dcbf70/public/requests/2258657/new';
const PHONE = '503-874-3705';

function getQueryParam(param: string): string | null {
  try {
    const url = new URL(window.location.href);
    return url.searchParams.get(param);
  } catch {
    return null;
  }
}

function detectSource(): string {
  const utmSource = getQueryParam('utm_source');
  if (utmSource) return utmSource.toLowerCase();
  if (getQueryParam('gclid')) return 'google';
  if (getQueryParam('fbclid')) return 'meta';
  return 'direct';
}

function detectCampaign(): string | null {
  return getQueryParam('utm_campaign');
}

function sanitizePhone(input: string): string {
  return input.replace(/[^\d\s()+-]/g, '').slice(0, 20);
}

function sanitizeText(input: string, maxLen: number): string {
  return input.slice(0, maxLen);
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10;
}

function isValidEmail(email: string): boolean {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function AdLandingPage() {
  const [form, setForm] = useState<LeadForm>({
    name: '',
    phone: '',
    email: '',
    zip_code: '',
    service_type: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LeadForm, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef(detectSource());
  const campaignRef = useRef(detectCampaign());

  useEffect(() => {
    if (submitted && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [submitted]);

  function validate(): boolean {
    const next: Partial<Record<keyof LeadForm, string>> = {};
    if (!form.name.trim()) next.name = 'Please enter your name';
    if (!form.phone.trim()) next.phone = 'Please enter your phone number';
    else if (!isValidPhone(form.phone)) next.phone = 'Please enter a valid phone number';
    if (form.email && !isValidEmail(form.email)) next.email = 'Please enter a valid email';
    if (!form.service_type) next.service_type = 'Please select a service';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from('ad_leads').insert({
        name: sanitizeText(form.name.trim(), 100),
        phone: sanitizePhone(form.phone.trim()),
        email: form.email.trim() || null,
        zip_code: sanitizeText(form.zip_code.trim(), 10) || null,
        service_type: form.service_type || null,
        message: sanitizeText(form.message.trim(), 1000) || null,
        source: sourceRef.current,
        campaign: campaignRef.current,
      });

      if (error) throw error;
      setSubmitted(true);
    } catch {
      setErrors({ message: 'Something went wrong. Please try calling us instead.' });
    } finally {
      setSubmitting(false);
    }
  }

  function updateField<K extends keyof LeadForm>(key: K, value: LeadForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Junk Removal Molalla OR | Bare Acre Hauling | Get a Free Quote"
        description="Veteran-owned junk removal in Molalla & Clackamas County. Appliance removal, cleanouts, debris hauling. Same-day available. Call 503-874-3705 or get a free quote online."
        keywords="junk removal Molalla, junk removal Clackamas County, appliance removal, estate cleanout, debris removal, veteran owned junk removal, same day junk removal"
        canonical="https://bareacrehauling.com/ad-landing"
      />

      {/* Hero — mobile-first, content above the fold */}
      <section className="relative bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 px-4 pt-10 pb-8 sm:pt-16 sm:pb-12 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className="relative max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-600/90 text-white px-4 py-2 rounded-full text-sm font-semibold mb-5">
            <Shield className="h-4 w-4 flex-shrink-0" />
            <span>Veteran Owned & Operated</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
            Junk Removal<br />
            <span className="text-green-400">Done Right.</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 mb-6 leading-relaxed">
            Appliance removal, garage cleanouts, estate cleanouts, debris hauling — we load it, we haul it, you relax.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
            <button
              onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              className="bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-green-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap className="h-5 w-5" />
              Get a Free Quote
            </button>
            <a
              href={`tel:${PHONE}`}
              className="bg-white text-slate-800 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <Phone className="h-5 w-5" />
              Call {PHONE}
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              5-Star Rated
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-green-400" />
              Same-Day Available
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-green-400" />
              Free Upfront Quotes
            </span>
          </div>
        </div>
      </section>

      {/* Before / After — visual proof */}
      <section className="px-4 py-8 sm:py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center mb-6">
            See the Difference
          </h2>
          <div className="grid grid-cols-2 gap-3 rounded-2xl overflow-hidden shadow-xl" style={{ height: 'clamp(240px, 50vw, 400px)' }}>
            <div className="relative overflow-hidden">
              <img src="/before-real.jpg" alt="Driveway full of junk before removal" className="w-full h-full object-cover object-top" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider">Before</span>
            </div>
            <div className="relative overflow-hidden">
              <img src="/after.jpg" alt="Clean driveway after junk removal" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider">After</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services — compact grid */}
      <section className="px-4 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center mb-6">What We Haul</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {serviceOptions.map((opt) => (
              <div key={opt.value} className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-green-500 hover:shadow-md transition-all">
                <opt.icon className="h-7 w-7 text-green-600 mx-auto mb-2" />
                <span className="text-sm font-semibold text-slate-700">{opt.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-slate-50 border-y border-gray-200 px-4 py-6">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4 text-center">
          <div>
            <Shield className="h-8 w-8 text-red-600 mx-auto mb-1" />
            <div className="text-sm font-bold text-slate-800">Veteran Owned</div>
          </div>
          <div>
            <Star className="h-8 w-8 text-yellow-500 fill-yellow-500 mx-auto mb-1" />
            <div className="text-sm font-bold text-slate-800">5-Star Rated</div>
          </div>
          <div>
            <Truck className="h-8 w-8 text-green-600 mx-auto mb-1" />
            <div className="text-sm font-bold text-slate-800">We Do It All</div>
          </div>
        </div>
      </section>

      {/* Lead form — the primary conversion point */}
      <section className="px-4 py-10 sm:py-14 bg-gradient-to-br from-green-50 to-gray-50">
        <div ref={formRef} className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-9 w-9 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Thanks, {form.name.split(' ')[0]}!</h2>
                <p className="text-gray-600 mb-6">
                  We received your request and will call you shortly — usually within the hour during business hours.
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    href={`tel:${PHONE}`}
                    className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="h-5 w-5" />
                    Or Call Us Now: {PHONE}
                  </a>
                  <a
                    href={JOBBER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    Book Online Directly
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">Get Your Free Quote</h2>
                  <p className="text-gray-500 text-sm">Tell us what you need hauled. We'll call you back fast.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Name */}
                  <div>
                    <label htmlFor="ad-name" className="block text-sm font-semibold text-slate-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="ad-name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-400' : 'border-gray-300'} focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors text-base`}
                      placeholder="Your name"
                      maxLength={100}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="ad-phone" className="block text-sm font-semibold text-slate-700 mb-1">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="ad-phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => updateField('phone', sanitizePhone(e.target.value))}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-400' : 'border-gray-300'} focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors text-base`}
                      placeholder="(503) 555-1234"
                      maxLength={20}
                      inputMode="tel"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  {/* Email (optional) */}
                  <div>
                    <label htmlFor="ad-email" className="block text-sm font-semibold text-slate-700 mb-1">
                      Email <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      id="ad-email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-400' : 'border-gray-300'} focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors text-base`}
                      placeholder="you@email.com"
                      maxLength={200}
                      inputMode="email"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {/* Service type — tappable cards */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      What do you need hauled? <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {serviceOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => updateField('service_type', opt.value as ServiceType)}
                          className={`flex items-center gap-2 px-3 py-3 rounded-lg border-2 text-left transition-all active:scale-95 ${
                            form.service_type === opt.value
                              ? 'border-green-600 bg-green-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <opt.icon className={`h-5 w-5 flex-shrink-0 ${form.service_type === opt.value ? 'text-green-600' : 'text-gray-400'}`} />
                          <span className={`text-sm font-medium ${form.service_type === opt.value ? 'text-green-700' : 'text-slate-600'}`}>
                            {opt.label}
                          </span>
                        </button>
                      ))}
                    </div>
                    {errors.service_type && <p className="text-red-500 text-xs mt-1">{errors.service_type}</p>}
                  </div>

                  {/* Zip code */}
                  <div>
                    <label htmlFor="ad-zip" className="block text-sm font-semibold text-slate-700 mb-1">
                      ZIP Code <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      id="ad-zip"
                      type="text"
                      autoComplete="postal-code"
                      value={form.zip_code}
                      onChange={(e) => updateField('zip_code', e.target.value.replace(/[^\d]/g, '').slice(0, 5))}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors text-base"
                      placeholder="97038"
                      maxLength={5}
                      inputMode="numeric"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="ad-message" className="block text-sm font-semibold text-slate-700 mb-1">
                      Details <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      id="ad-message"
                      value={form.message}
                      onChange={(e) => updateField('message', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors text-base resize-none"
                      placeholder="Tell us what you need removed..."
                      maxLength={1000}
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-green-600 text-white px-6 py-4 rounded-xl text-lg font-bold hover:bg-green-700 transition-all shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <span className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5" />
                        Get My Free Quote
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-400">
                    We'll call you back fast. No obligation, no hidden fees.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* How it works — compact */}
      <section className="px-4 py-8 sm:py-12 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { num: '1', title: 'Tell Us What You Need', desc: 'Submit the form or call us. We give you an upfront quote.' },
              { num: '2', title: 'We Show Up', desc: 'Our crew arrives on time and does all the loading.' },
              { num: '3', title: "It's Gone", desc: 'We haul it away and clean up. You enjoy your space.' },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3 shadow-md">
                  {step.num}
                </div>
                <h3 className="font-bold text-slate-800 mb-1">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial — single, high-impact */}
      <section className="px-4 py-8 sm:py-10 bg-slate-50">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <p className="text-lg sm:text-xl text-slate-700 italic mb-3 leading-relaxed">
            "Quick, efficient service made junk removal easy. Their top-notch customer service is highly recommended!"
          </p>
          <p className="text-slate-500 font-semibold text-sm">— Alex M., Molalla OR</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-10 text-center text-white">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to Reclaim Your Space?</h2>
        <p className="text-base sm:text-lg opacity-90 mb-5">Same-day service often available. Call or text now.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`tel:${PHONE}`}
            className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            <Phone className="h-5 w-5" />
            Call {PHONE}
          </a>
          <a
            href={`sms:${PHONE}`}
            className="bg-slate-800 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            <MessageSquare className="h-5 w-5" />
            Text for Fast Quote
          </a>
        </div>
      </section>

      {/* Footer — minimal */}
      <footer className="bg-slate-900 text-gray-400 px-4 py-6 text-center">
        <p className="text-sm font-semibold text-white mb-1">Bare Acre Hauling</p>
        <p className="text-xs mb-3">Veteran Owned & Operated | Molalla, OR</p>
        <p className="text-xs">Serving Molalla, Canby, Oregon City, Woodburn, Silverton &amp; surrounding areas</p>
        <p className="text-xs mt-3">&copy; 2025 Bare Acre Hauling. All rights reserved.</p>
      </footer>

      {/* Sticky mobile CTA bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white border-t border-gray-200 shadow-lg">
        <div className="flex gap-2 p-2">
          <a
            href={`tel:${PHONE}`}
            className="flex-1 bg-slate-100 text-slate-800 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
          <button
            onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
            className="flex-[1.5] bg-green-600 text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
          >
            <Zap className="h-4 w-4" />
            Free Quote
          </button>
        </div>
      </div>

      {/* Spacer so sticky bar doesn't cover footer on mobile */}
      <div className="h-16 sm:hidden" aria-hidden="true" />
    </div>
  );
}
