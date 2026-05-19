import { Link } from 'react-router-dom';
import { ArrowLeft, Phone } from 'lucide-react';
import { JunkRemovalPricing } from '../components/JunkRemovalPricing';
import { SEOHead } from '../components/SEOHead';

export function PricingPage() {
  return (
    <>
      <SEOHead
        title="Junk Removal Pricing | Bare Acre Hauling | Molalla, OR"
        description="Transparent, volume-based junk removal pricing. Appliance removal, debris, garage cleanouts, estate cleanouts and more. Serving Molalla and Clackamas County, OR."
        canonicalUrl="https://www.bareacrehauling.com/pricing"
        keywords="junk removal pricing Molalla, junk removal cost Oregon, appliance removal price, debris removal Clackamas County, estate cleanout pricing"
      />

      <div className="min-h-screen bg-gray-50">
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
                <h1 className="text-4xl font-bold text-white mb-2">Junk Removal Pricing</h1>
                <p className="text-gray-200 text-lg mb-3">
                  Transparent, volume-based pricing — no surprises
                </p>
                <div className="bg-red-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 font-semibold text-sm shadow-lg">
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

        <JunkRemovalPricing />

        <div className="py-12 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-6">
              Get a fast quote or book your junk removal service today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://clienthub.getjobber.com/hubs/935796ca-8da1-401b-a3dd-604659dcbf70/public/requests/2258657/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
              >
                Book Online Now
              </a>
              <a
                href="tel:503-874-3705"
                className="inline-flex items-center justify-center gap-2 bg-slate-700 text-white px-8 py-4 rounded-lg hover:bg-slate-600 transition-colors font-semibold text-lg"
              >
                <Phone className="h-5 w-5" />
                Call for Quote: 503-874-3705
              </a>
              <a
                href="sms:503-874-3705"
                className="inline-flex items-center justify-center gap-2 bg-slate-600 text-white px-8 py-4 rounded-lg hover:bg-slate-500 transition-colors font-semibold text-lg"
              >
                Text for Fast Quote
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
