import { JunkRemovalPricing } from '../components/JunkRemovalPricing';
import { Link } from 'react-router-dom';
import { ArrowLeft, Phone } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';

export function JunkRemovalPricingPage() {
  return (
    <>
      <SEOHead
        title="Junk Removal Pricing - Transparent & Affordable | Molalla Trailer Rental"
        description="Simple, transparent junk removal pricing. Volume-based rates starting at $150. Choose from DIY, full-service, or cleanout packages. No hidden fees. Serving Molalla, OR."
        canonicalUrl="https://www.molallatrailerrental.com/junk-removal-pricing"
        keywords="junk removal pricing, junk hauling cost, furniture removal prices, cleanout services, Molalla junk removal"
      />

      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white hover:text-gray-200 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Junk Removal Pricing
                </h1>
                <p className="text-gray-200 text-lg">
                  Transparent pricing based on volume and service level
                </p>
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
                className="inline-block bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
              >
                Call for Quote: 503-874-3705
              </a>
              <Link
                to="/booking"
                className="inline-block bg-slate-700 text-white px-8 py-4 rounded-lg hover:bg-slate-600 transition-colors font-semibold text-lg"
              >
                Book a Trailer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
