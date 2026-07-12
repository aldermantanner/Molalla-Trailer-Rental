import { Link } from 'react-router-dom';
import { Star, CheckCircle, Shield, Truck, Phone, Facebook, Trash2, Home, Package, Leaf, Wrench, Building2, Archive } from 'lucide-react';
import { Testimonials } from '../components/Testimonials';
import { FAQ } from '../components/FAQ';
import { ServiceArea } from '../components/ServiceArea';
import { SocialProof } from '../components/SocialProof';
import { LocalBusinessSchema } from '../components/LocalBusinessSchema';
import { FAQSchema } from '../components/FAQSchema';
import { ServiceSchema } from '../components/ServiceSchema';
import { ReviewSchema } from '../components/ReviewSchema';
import { BreadcrumbSchema } from '../components/BreadcrumbSchema';
import { LocalSEOContent } from '../components/LocalSEOContent';
import { ExitIntentPopup } from '../components/ExitIntentPopup';
import { ChatWidget } from '../components/ChatWidget';

const services = [
  {
    icon: Package,
    title: 'Appliance Removal',
    description: 'Old refrigerators, washers, dryers, stoves, dishwashers — we haul it all away safely and responsibly.',
    color: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: Trash2,
    title: 'General Trash & Junk Removal',
    description: 'Furniture, clutter, mixed household junk — one call and it\'s gone. No hauling, no stress.',
    color: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    icon: Wrench,
    title: 'Debris Removal',
    description: 'Construction debris, drywall, wood scraps, remodel leftovers — we clean up after the project.',
    color: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    icon: Leaf,
    title: 'Yard Cleanup',
    description: 'Brush piles, branches, yard waste, overgrown debris — we restore your outdoor space fast.',
    color: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    icon: Home,
    title: 'Garage Cleanouts',
    description: 'Years of accumulated garage clutter cleared out in a single visit. Drive back in by tonight.',
    color: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
  {
    icon: Building2,
    title: 'Complete House Cleanout',
    description: 'Full-property cleanouts for estates, foreclosures, and move-outs. We handle everything floor to floor.',
    color: 'bg-slate-100',
    iconColor: 'text-slate-600',
  },
  {
    icon: Archive,
    title: 'Hoarder House Cleanouts',
    description: 'Discreet, judgment-free hoarder cleanout services. We work efficiently and respectfully.',
    color: 'bg-red-100',
    iconColor: 'text-red-600',
  },
  {
    icon: Truck,
    title: 'Commercial Junk Removal',
    description: 'Office furniture, equipment, renovation debris — we keep your business site clean and on schedule.',
    color: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
  },
];

export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <LocalBusinessSchema />
      <FAQSchema />
      <ServiceSchema />
      <ReviewSchema />
      <BreadcrumbSchema />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 font-semibold">Veteran Owned & Operated</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
                Junk Removal<br />
                <span className="text-green-400">Done Right.</span>
              </h1>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                Bare Acre Hauling is Molalla's trusted, veteran-owned junk removal company. Appliances, debris, full estate cleanouts — we haul it all so you don't have to.
              </p>
              <div className="flex flex-col gap-3 mb-8">
                <div className="bg-red-600 text-white px-4 py-3 rounded-lg inline-flex items-center gap-2 font-bold shadow-lg w-fit">
                  <Shield className="h-5 w-5" />
                  <span>10% OFF for Veterans, First Responders & Police</span>
                </div>
                <div className="bg-yellow-400 text-slate-900 px-4 py-3 rounded-lg inline-flex items-center gap-2 font-bold shadow-lg w-fit">
                  <Star className="h-5 w-5 fill-slate-900" />
                  <span>New customers save $10 with code FIRST10</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://clienthub.getjobber.com/hubs/935796ca-8da1-401b-a3dd-604659dcbf70/public/requests/2258657/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-all text-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-5 w-5" />
                  Get a Free Quote
                </a>
                <a
                  href="tel:503-874-3705"
                  className="bg-white text-slate-800 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all text-center shadow-lg flex items-center justify-center gap-2"
                >
                  <Phone className="h-5 w-5" />
                  503-874-3705
                </a>
              </div>
            </div>
            <div className="relative flex flex-col items-center justify-center space-y-6">
              <img
                src="/Bare_Arce_Hauling_high_res_PNG.png"
                alt="Bare Acre Hauling junk removal service"
                className="rounded-2xl shadow-2xl w-auto max-w-full h-auto max-h-96 object-contain"
                loading="eager"
              />
              <div className="flex items-center gap-4">
                <a
                  href="https://www.facebook.com/molallatrailerrental"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 hover:bg-white/20 transition-all duration-300 shadow-lg"
                  aria-label="Visit our Facebook page"
                >
                  <Facebook className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                  <span className="text-white font-medium">Facebook</span>
                </a>
                <a
                  href="https://www.tiktok.com/@molallatrailerrental"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 hover:bg-white/20 transition-all duration-300 shadow-lg"
                  aria-label="Visit our TikTok page"
                >
                  <svg className="h-5 w-5 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                  <span className="text-white font-medium">TikTok</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-3">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <div className="font-bold text-slate-800 text-lg">Veteran Owned</div>
              <div className="text-sm text-gray-500">& Operated</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <div className="font-bold text-slate-800 text-lg">Fully Insured</div>
              <div className="text-sm text-gray-500">Licensed & Bonded</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-3">
                <Star className="h-8 w-8 text-yellow-600 fill-yellow-600" />
              </div>
              <div className="font-bold text-slate-800 text-lg">5-Star Service</div>
              <div className="text-sm text-gray-500">Trusted Locally</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <div className="font-bold text-slate-800 text-lg">Same Day</div>
              <div className="text-sm text-gray-500">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Our Junk Removal Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From a single appliance to an entire property cleanout — we handle it all. Fast scheduling, fair pricing, zero hassle.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <div className={`inline-flex items-center justify-center w-14 h-14 ${service.color} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon className={`h-7 w-7 ${service.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6 text-lg">Not sure if we haul it? Just ask — if it's not hazardous, we probably do.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://clienthub.getjobber.com/hubs/935796ca-8da1-401b-a3dd-604659dcbf70/public/requests/2258657/new"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg text-lg"
              >
                Book a Pickup
              </a>
              <Link
                to="/pricing"
                onClick={() => window.scrollTo(0, 0)}
                className="bg-slate-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-slate-600 transition-colors shadow-lg text-lg"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Before & After */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">Real Results</span>
            <h2 className="text-4xl font-bold text-slate-800 mb-4">See the Difference We Make</h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">One visit. One crew. A completely cleared space — same day.</p>
          </div>

          {/* Photo pair */}
          <div className="grid grid-cols-2 gap-4 rounded-2xl overflow-hidden shadow-2xl mb-10" style={{height: '480px'}}>
            {/* Before */}
            <div className="relative overflow-hidden">
              <img
                src="/before-real.jpg"
                alt="Driveway covered in junk and debris before removal"
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute top-5 left-5">
                <span className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-lg uppercase tracking-widest shadow-lg">Before</span>
              </div>
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-white font-semibold text-base leading-snug drop-shadow-lg">Driveway packed with scrap, debris, and junk</p>
              </div>
            </div>

            {/* After */}
            <div className="relative overflow-hidden">
              <img
                src="/after.jpg"
                alt="Clean cleared driveway after junk removal"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
              <div className="absolute top-5 right-5">
                <span className="bg-green-600 text-white text-sm font-bold px-4 py-2 rounded-lg uppercase tracking-widest shadow-lg">After</span>
              </div>
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-white font-semibold text-base leading-snug drop-shadow-lg">Completely cleared — same day</p>
              </div>
            </div>
          </div>

          {/* Review + Gavin */}
          <div className="flex flex-col md:flex-row items-center gap-6 bg-slate-50 rounded-2xl p-7 shadow-sm">
            <img
              src="/gavin.jpg"
              alt="Gavin, owner of Bare Acre Hauling"
              className="w-20 h-20 rounded-full object-cover object-top flex-shrink-0 border-4 border-white shadow-md"
              loading="lazy"
            />
            <div className="flex-1 text-center md:text-left">
              <div className="flex justify-center md:justify-start gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-700 text-base italic mb-1">"Quick, efficient service made junk removal easy. Their top-notch customer service is highly recommended!"</p>
              <p className="text-slate-500 text-sm font-semibold">— Alex M., Molalla OR</p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <a
              href="https://clienthub.getjobber.com/hubs/935796ca-8da1-401b-a3dd-604659dcbf70/public/requests/2258657/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-lg"
            >
              <Trash2 className="h-5 w-5" />
              Book Your Cleanout
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-slate-800 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 text-center mb-16">Three simple steps to a clutter-free space.</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">1</div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Book or Call</h3>
              <p className="text-gray-600">Schedule online or call 503-874-3705. We'll confirm your appointment and give you an upfront quote — no surprises.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">2</div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">We Show Up</h3>
              <p className="text-gray-600">Our crew arrives on time, does a quick walkthrough, and gets straight to work. You point, we haul.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">3</div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">It's Gone</h3>
              <p className="text-gray-600">We load everything, clean up the area, and haul it to proper disposal. You're left with a clean space.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Ready to Reclaim Your Space?</h2>
          <p className="text-base md:text-lg opacity-90 mb-5">
            Text us a photo and get a quote in minutes. Same-day service often available.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://clienthub.getjobber.com/hubs/935796ca-8da1-401b-a3dd-604659dcbf70/public/requests/2258657/new"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <Trash2 className="h-5 w-5" />
              Book Online Now
            </a>
            <a
              href="tel:503-874-3705"
              className="bg-slate-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-700 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <Phone className="h-5 w-5" />
              Call: 503-874-3705
            </a>
            <a
              href="sms:503-874-3705"
              className="bg-slate-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-600 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              Text for Fast Quote
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-slate-800 mb-16">Why Bare Acre Hauling?</h2>
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="text-center p-6 rounded-xl hover:shadow-xl transition-shadow bg-white">
              <div className="inline-block p-4 bg-red-100 rounded-full mb-6">
                <Star className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Veteran Owned</h3>
              <p className="text-gray-600">Military precision and integrity behind every job. We show up when we say we will.</p>
            </div>
            <div className="text-center p-6 rounded-xl hover:shadow-xl transition-shadow bg-white">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">No Hidden Fees</h3>
              <p className="text-gray-600">Upfront, honest pricing. You approve the quote before we touch a thing.</p>
            </div>
            <div className="text-center p-6 rounded-xl hover:shadow-xl transition-shadow bg-white">
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-6">
                <Truck className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">We Do All the Work</h3>
              <p className="text-gray-600">You don't lift a finger. Our crew handles all the loading, hauling, and cleanup.</p>
            </div>
            <div className="text-center p-6 rounded-xl hover:shadow-xl transition-shadow bg-white">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
                <Shield className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Local & Trusted</h3>
              <p className="text-gray-600">Serving Molalla and Clackamas County with a reputation built on real reviews.</p>
            </div>
          </div>

          {/* Action photo */}
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/gavin-loading.jpg"
              alt="Bare Acre Hauling crew loading furniture and appliances onto trailer"
              className="w-full object-cover object-center"
              style={{ maxHeight: '520px' }}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <SocialProof />

      <div id="reviews">
        <Testimonials />
      </div>

      <ServiceArea />

      <LocalSEOContent />

      <div id="faq">
        <FAQ />
      </div>

      <ChatWidget />
      <ExitIntentPopup onBookClick={() => {}} />
    </div>
  );
}
