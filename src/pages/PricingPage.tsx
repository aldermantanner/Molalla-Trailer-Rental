import { PricingCalculator } from '../components/PricingCalculator';
import { Link } from 'react-router-dom';
import { ArrowLeft, Phone } from 'lucide-react';

export function PricingPage() {
  return (
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
                Pricing Calculator
              </h1>
              <p className="text-gray-200 text-lg">
                Calculate your rental cost instantly
              </p>
            </div>
            <a
              href="tel:971-459-0077"
              className="hidden md:flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              <Phone className="h-5 w-5" />
              Call: 971-459-0077
            </a>
          </div>
        </div>
      </div>

      <PricingCalculator />

      <div className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Ready to Book?
          </h2>
          <p className="text-gray-600 mb-6">
            Lock in your dates and get your trailer delivered or picked up at your convenience.
          </p>
          <Link
            to="/booking"
            className="inline-block bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
          >
            Book Your Trailer Now
          </Link>
        </div>
      </div>
    </div>
  );
}
