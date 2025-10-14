import { useState } from 'react';
import { Calendar, Phone, Truck, CheckCircle, ArrowRight, Star, Shield, Clock } from 'lucide-react';

interface AdCampaignProps {
  onBookNow: () => void;
}

export function AdCampaign({ onBookNow }: AdCampaignProps) {
  const [selectedService, setSelectedService] = useState<'rental' | 'junk' | 'delivery' | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold mb-6">
            <Star className="h-5 w-5 fill-red-600" />
            Veteran Owned & Operated
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
            Need a Dump Trailer?<br />
            <span className="text-green-600">We Deliver Today</span>
          </h1>
          <p className="text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Professional dump trailer rentals starting at $120/day. Serving Molalla & surrounding areas with same-day delivery available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button
              onClick={onBookNow}
              className="bg-green-600 text-white px-10 py-5 rounded-xl text-xl font-bold hover:bg-green-700 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center gap-3"
            >
              <Calendar className="h-6 w-6" />
              Book Now - Get 10% Off
            </button>
            <a
              href="tel:503-500-6121"
              className="bg-slate-800 text-white px-10 py-5 rounded-xl text-xl font-bold hover:bg-slate-700 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center gap-3"
            >
              <Phone className="h-6 w-6" />
              Call: 503-500-6121
            </a>
          </div>
          <p className="text-gray-600 text-lg">
            <span className="font-bold text-green-600">Limited Time Offer:</span> Book online and save 10% on your first rental
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow border-2 border-transparent hover:border-green-500">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Clock className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 text-center">Same-Day Delivery</h3>
            <p className="text-gray-600 text-center text-lg">
              Call before noon and get your trailer delivered the same day
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow border-2 border-transparent hover:border-green-500">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 text-center">Clean & Ready</h3>
            <p className="text-gray-600 text-center text-lg">
              All trailers are cleaned, inspected, and ready for your project
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow border-2 border-transparent hover:border-green-500">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Star className="h-8 w-8 text-green-600 fill-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 text-center">Local & Trusted</h3>
            <p className="text-gray-600 text-center text-lg">
              Veteran owned business serving the Molalla community
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16">
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8 px-8 text-center">
            <h2 className="text-4xl font-extrabold mb-2">Choose Your Service</h2>
            <p className="text-xl opacity-90">Select what you need and get an instant quote</p>
          </div>
          <div className="grid md:grid-cols-3 gap-0 divide-x divide-gray-200">
            <button
              onClick={() => setSelectedService('rental')}
              className={`p-10 text-left hover:bg-gray-50 transition-all ${
                selectedService === 'rental' ? 'bg-green-50 border-4 border-green-600' : ''
              }`}
            >
              <Truck className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Dump Trailer Rental</h3>
              <p className="text-gray-600 mb-4 text-lg">
                Perfect for yard waste, construction debris, and home cleanouts
              </p>
              <div className="text-3xl font-extrabold text-green-600 mb-2">$120/day</div>
              <p className="text-gray-500">Delivery available</p>
              {selectedService === 'rental' && (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">7-yard capacity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Easy hydraulic dump</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Weekly rates available</span>
                  </div>
                  <button
                    onClick={onBookNow}
                    className="w-full mt-4 bg-green-600 text-white px-6 py-4 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Book This Service
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </button>

            <button
              onClick={() => setSelectedService('junk')}
              className={`p-10 text-left hover:bg-gray-50 transition-all ${
                selectedService === 'junk' ? 'bg-green-50 border-4 border-green-600' : ''
              }`}
            >
              <Truck className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Junk Removal</h3>
              <p className="text-gray-600 mb-4 text-lg">
                We load it, we haul it, we dispose of it. You relax.
              </p>
              <div className="text-3xl font-extrabold text-green-600 mb-2">Call for Quote</div>
              <p className="text-gray-500">503-500-6121</p>
              {selectedService === 'junk' && (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Full-service removal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Same-day service available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Eco-friendly disposal</span>
                  </div>
                  <button
                    onClick={onBookNow}
                    className="w-full mt-4 bg-green-600 text-white px-6 py-4 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Request Quote
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </button>

            <button
              onClick={() => setSelectedService('delivery')}
              className={`p-10 text-left hover:bg-gray-50 transition-all ${
                selectedService === 'delivery' ? 'bg-green-50 border-4 border-green-600' : ''
              }`}
            >
              <Truck className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Material Delivery</h3>
              <p className="text-gray-600 mb-4 text-lg">
                Dirt, gravel, and mulch delivered to your location
              </p>
              <div className="text-3xl font-extrabold text-green-600 mb-2">From $100</div>
              <p className="text-gray-500">Per 7 yards delivered</p>
              {selectedService === 'delivery' && (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Fill dirt: $100/7 yards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Gravel: $350-$550/7 yards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Mulch: $280-$445/7 yards</span>
                  </div>
                  <button
                    onClick={onBookNow}
                    className="w-full mt-4 bg-green-600 text-white px-6 py-4 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Order Delivery
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl shadow-2xl p-12 text-white text-center">
          <h2 className="text-4xl font-extrabold mb-4">Why Customers Choose Us</h2>
          <div className="grid md:grid-cols-4 gap-8 mt-10">
            <div>
              <div className="text-5xl font-extrabold text-green-400 mb-2">100%</div>
              <p className="text-xl text-gray-300">Satisfaction Rate</p>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-green-400 mb-2">500+</div>
              <p className="text-xl text-gray-300">Happy Customers</p>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-green-400 mb-2">Same Day</div>
              <p className="text-xl text-gray-300">Delivery Available</p>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-green-400 mb-2">24/7</div>
              <p className="text-xl text-gray-300">Online Booking</p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Ready to Get Started?</h2>
          <p className="text-2xl text-gray-700 mb-8">
            Book online now and save 10% on your first rental
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onBookNow}
              className="bg-green-600 text-white px-12 py-6 rounded-xl text-2xl font-bold hover:bg-green-700 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center gap-3"
            >
              <Calendar className="h-7 w-7" />
              Book Now & Save 10%
            </button>
            <a
              href="tel:503-500-6121"
              className="bg-white text-slate-800 border-4 border-slate-800 px-12 py-6 rounded-xl text-2xl font-bold hover:bg-slate-50 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center gap-3"
            >
              <Phone className="h-7 w-7" />
              Call: 503-500-6121
            </a>
          </div>
          <p className="mt-6 text-gray-600 text-lg">
            Serving Molalla, Canby, Oregon City, Woodburn, Silverton & surrounding areas
          </p>
        </div>
      </div>
    </div>
  );
}
