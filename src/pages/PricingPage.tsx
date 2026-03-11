import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Phone, Truck, Trash2 } from 'lucide-react';
import { PricingCalculator } from '../components/PricingCalculator';
import { JunkRemovalPricing } from '../components/JunkRemovalPricing';
import { SEOHead } from '../components/SEOHead';

type PricingTab = 'trailer' | 'junk';

export function PricingPage() {
  const [activeTab, setActiveTab] = useState<PricingTab>('trailer');

  return (
    <>
      <SEOHead
        title="Pricing - Trailer Rentals & Junk Removal | Molalla Trailer Rental"
        description="Transparent pricing for trailer rentals and junk removal services. Daily, weekly, and monthly rates. Volume-based junk removal pricing. Serving Molalla, OR."
        canonicalUrl="https://www.molallatrailerrental.com/pricing"
        keywords="trailer rental pricing, junk removal pricing, dump trailer rates, Molalla trailer rental cost"
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white hover:text-gray-200 transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Pricing
                </h1>
                <p className="text-gray-200 text-lg mb-3">
                  Choose the service that fits your needs
                </p>
                <div className="bg-red-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 font-semibold text-sm shadow-lg">
                  <span>🇺🇸</span>
                  <span>10% OFF for Veterans, First Responders & Police</span>
                </div>
              </div>
              <a
                href="tel:503-874-3705"
                className="hidden md:flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                <Phone className="h-5 w-5" />
                Call: 503-874-3705
              </a>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('trailer')}
                className={`flex items-center gap-2 px-6 py-4 font-semibold text-lg transition-all relative ${
                  activeTab === 'trailer'
                    ? 'text-green-600 border-b-4 border-green-600'
                    : 'text-gray-600 hover:text-gray-800 border-b-4 border-transparent'
                }`}
              >
                <Truck className="h-5 w-5" />
                Trailer Rentals
              </button>
              <button
                onClick={() => setActiveTab('junk')}
                className={`flex items-center gap-2 px-6 py-4 font-semibold text-lg transition-all relative ${
                  activeTab === 'junk'
                    ? 'text-green-600 border-b-4 border-green-600'
                    : 'text-gray-600 hover:text-gray-800 border-b-4 border-transparent'
                }`}
              >
                <Trash2 className="h-5 w-5" />
                Junk Removal
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="transition-all duration-300 ease-in-out">
          {activeTab === 'trailer' && (
            <div className="animate-fadeIn">
              <PricingCalculator />

              <div className="py-12 px-4 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">
                    Ready to Book Your Trailer?
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Lock in your dates and get your trailer delivered or picked up at your convenience.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="https://clienthub.getjobber.com/hubs/935796ca-8da1-401b-a3dd-604659dcbf70/public/requests/2258657/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
                    >
                      Book Your Trailer Now
                    </a>
                    <a
                      href="tel:503-874-3705"
                      className="inline-flex items-center justify-center gap-2 bg-slate-700 text-white px-8 py-4 rounded-lg hover:bg-slate-600 transition-colors font-semibold text-lg"
                    >
                      <Phone className="h-5 w-5" />
                      Call: 503-874-3705
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'junk' && (
            <div className="animate-fadeIn">
              <JunkRemovalPricing />

              <div className="py-12 px-4 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">
                    Ready to Get Started?
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Get a fast quote or book your junk removal service today.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="tel:503-874-3705"
                      className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
                    >
                      <Phone className="h-5 w-5" />
                      Call for Quote: 503-874-3705
                    </a>
                    <a
                      href="sms:503-874-3705"
                      className="inline-flex items-center justify-center gap-2 bg-slate-700 text-white px-8 py-4 rounded-lg hover:bg-slate-600 transition-colors font-semibold text-lg"
                    >
                      📱 Text for Fast Quote
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
