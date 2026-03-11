import { Link } from 'react-router-dom';
import { Star, CheckCircle, Shield, Truck, Calendar, Phone, Facebook } from 'lucide-react';
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

export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <LocalBusinessSchema />
      <FAQSchema />
      <ServiceSchema />
      <ReviewSchema />
      <BreadcrumbSchema />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 font-semibold text-lg">Veteran Owned & Operated</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
                Dump Trailer Rentals & Junk Removal
              </h1>
              <p className="text-xl text-gray-200 mb-6">
                Professional dump trailer rentals and complete junk removal services serving Molalla and surrounding areas. Whether you're clearing out a property or hauling debris, we've got you covered.
              </p>
              <div className="space-y-3 mb-6">
                <div className="bg-yellow-400 text-slate-900 px-4 py-3 rounded-lg inline-flex items-center gap-2 font-bold shadow-lg">
                  <span className="text-2xl">🎉</span>
                  <span>New customers save $10 with code FIRST10</span>
                </div>
                <div className="bg-red-600 text-white px-4 py-3 rounded-lg inline-flex items-center gap-2 font-bold shadow-lg">
                  <span className="text-2xl">🇺🇸</span>
                  <span>10% OFF for Veterans, First Responders & Police</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://clienthub.getjobber.com/hubs/935796ca-8da1-401b-a3dd-604659dcbf70/public/requests/2258657/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors text-center shadow-lg flex items-center justify-center gap-2"
                >
                  <Calendar className="h-5 w-5" />
                  Book Online Now
                </a>
                <a href="tel:503-874-3705" className="bg-white text-slate-800 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors text-center shadow-lg flex items-center justify-center gap-2">
                  <Phone className="h-5 w-5" />
                  Call: 503-874-3705
                </a>
              </div>
            </div>
            <div className="relative flex flex-col items-center justify-center space-y-6">
              <img
                src="/image copy copy copy copy.png"
                alt="Dump trailer in action"
                className="rounded-lg shadow-2xl w-auto max-w-full h-auto max-h-96 object-contain"
                loading="eager"
              />

              <div className="flex items-center gap-4">
                <a
                  href="https://www.facebook.com/molallatrailerrental"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl"
                  aria-label="Visit our Facebook page"
                >
                  <Facebook className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                  <span className="text-white font-medium">Facebook</span>
                </a>
                <a
                  href="https://www.tiktok.com/@molallatrailerrental"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl"
                  aria-label="Visit our TikTok page"
                >
                  <svg className="h-5 w-5 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-50 to-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-3">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <div className="font-bold text-slate-800 text-lg">Veteran Owned</div>
              <div className="text-sm text-gray-600">& Operated</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <div className="font-bold text-slate-800 text-lg">Fully Insured</div>
              <div className="text-sm text-gray-600">Licensed & Bonded</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-3">
                <Star className="h-8 w-8 text-yellow-600 fill-yellow-600" />
              </div>
              <div className="font-bold text-slate-800 text-lg">5-Star Service</div>
              <div className="text-sm text-gray-600">Trusted Locally</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <div className="font-bold text-slate-800 text-lg">Same Day</div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-slate-800 mb-16">Why Choose Us</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-xl transition-shadow bg-gray-50">
              <div className="inline-block p-4 bg-red-100 rounded-full mb-6">
                <Star className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Veteran Owned</h3>
              <p className="text-gray-600">
                Proudly veteran owned and operated with a commitment to excellence and integrity.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-xl transition-shadow bg-gray-50">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Reliable Equipment</h3>
              <p className="text-gray-600">
                Well-maintained dump trailers ready for your project. Clean, inspected, and dependable.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-xl transition-shadow bg-gray-50">
              <div className="inline-block p-4 bg-slate-100 rounded-full mb-6">
                <Truck className="h-10 w-10 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Delivery Available</h3>
              <p className="text-gray-600">
                Convenient delivery service available for your dump trailer rentals.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-xl transition-shadow bg-gray-50">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
                <Shield className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Local & Trusted</h3>
              <p className="text-gray-600">
                Serving Molalla and surrounding areas with honest pricing and reliable service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-slate-800 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            From dump trailer rentals to complete junk removal, we provide the solutions you need for your projects in Molalla and surrounding areas.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img
                src="https://www.MyTrailer.Rentals/Portal/Images/000483/Trailers/1503/074c04195a9189533abdee75a5afdda9.jpg"
                alt="Dump trailer rental in action"
                className="w-full h-72 object-cover"
                loading="lazy"
              />
              <div className="p-8">
                <h3 className="text-3xl font-semibold text-slate-800 mb-4">Dump Trailer Rentals</h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Heavy-duty dump trailers perfect for hauling debris, yard waste, construction materials, dirt, and more. Easy to load, easy to dump.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Professional-grade dump trailers</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Daily and weekly rental rates</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Delivery available</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Clean and well-maintained</span>
                  </li>
                </ul>
                <div className="text-green-600 font-bold text-2xl">Starting at $120/day</div>
                <p className="text-gray-600 mt-2">Delivery available</p>
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img
                src="/image.png"
                alt="Junk removal service with equipment"
                className="w-full h-72 object-cover"
                loading="lazy"
              />
              <div className="p-8">
                <h3 className="text-3xl font-semibold text-slate-800 mb-4">Junk Removal Services</h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Full-service junk removal for homes, businesses, and properties. We handle everything from pickup to disposal.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">We load and haul everything</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Residential & commercial</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Construction debris removal</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Eco-friendly disposal</span>
                  </li>
                </ul>
                <div className="text-green-600 font-bold text-2xl">Call for Quote</div>
                <p className="text-gray-600 mt-2">503-874-3705</p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link
                    to="/junk-removal-pricing"
                    onClick={() => window.scrollTo(0, 0)}
                    className="inline-flex items-center gap-2 text-slate-800 font-semibold hover:text-green-600 transition-colors group"
                  >
                    <span className="text-base">View Detailed Pricing Guide</span>
                    <svg
                      className="w-5 h-5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Booking CTA */}
      <section className="py-5 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Ready to Book Your Trailer?</h2>
          <p className="text-base md:text-lg opacity-90 mb-4">
            Book online in minutes or call us directly. We'll confirm your reservation and delivery details.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://clienthub.getjobber.com/hubs/935796ca-8da1-401b-a3dd-604659dcbf70/public/requests/2258657/new"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-green-600 px-6 py-3 rounded-lg text-base font-bold hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Calendar className="h-5 w-5" />
              Book Online Now
            </a>
            <a
              href="tel:503-874-3705"
              className="bg-slate-800 text-white px-6 py-3 rounded-lg text-base font-bold hover:bg-slate-700 transition-colors shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Phone className="h-5 w-5" />
              Call: 503-874-3705
            </a>
          </div>
          <div className="mt-4">
            <Link
              to="/junk-removal-pricing"
              onClick={() => window.scrollTo(0, 0)}
              className="inline-block text-white hover:text-green-200 transition-colors underline font-semibold"
            >
              View Junk Removal Pricing
            </Link>
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
