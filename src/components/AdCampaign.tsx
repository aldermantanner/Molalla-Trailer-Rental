import { Calendar, Phone, Truck, CheckCircle, ArrowRight, Star, Shield, Clock, Trash2 } from 'lucide-react';

interface AdCampaignProps {
  onBookNow: () => void;
}

export function AdCampaign({ onBookNow }: AdCampaignProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold mb-6">
            <Star className="h-5 w-5 fill-red-600" />
            Veteran Owned & Operated
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
            Need Junk Hauled?<br />
            <span className="text-green-600">We Show Up Today</span>
          </h1>
          <p className="text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Professional junk removal starting at $150. Serving Molalla & surrounding areas with same-day service available.
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
              href="tel:503-874-3705"
              className="bg-slate-800 text-white px-10 py-5 rounded-xl text-xl font-bold hover:bg-slate-700 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center gap-3"
            >
              <Phone className="h-6 w-6" />
              Call: 503-874-3705
            </a>
          </div>
          <p className="text-gray-600 text-lg">
            <span className="font-bold text-green-600">Limited Time Offer:</span> Book online and save 10% on your first junk removal
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow border-2 border-transparent hover:border-green-500">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Clock className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 text-center">Same-Day Service</h3>
            <p className="text-gray-600 text-center text-lg">
              Call before noon and our crew can be at your door the same day
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow border-2 border-transparent hover:border-green-500">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 text-center">We Do It All</h3>
            <p className="text-gray-600 text-center text-lg">
              You don't lift a finger — our crew handles all the loading and hauling
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
            <h2 className="text-4xl font-extrabold mb-2">What We Haul</h2>
            <p className="text-xl opacity-90">If it's not hazardous, we probably take it</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0">
            {[
              { icon: Trash2, title: 'General Junk', desc: 'Furniture, clutter, household items' },
              { icon: Truck, title: 'Appliances', desc: 'Fridges, washers, dryers, stoves' },
              { icon: Trash2, title: 'Yard Waste', desc: 'Brush, branches, yard debris' },
              { icon: Truck, title: 'Estate Cleanouts', desc: 'Full house, garage, hoarder cleanouts' },
            ].map((service, i) => (
              <div key={i} className="p-8 text-center border-b md:border-b-0 md:border-r border-gray-200 last:border-r-0">
                <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <service.icon className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
          <div className="p-8 bg-gray-50 text-center">
            <button
              onClick={onBookNow}
              className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-green-700 transition-colors inline-flex items-center justify-center gap-2 text-lg"
            >
              Get a Free Quote
              <ArrowRight className="h-5 w-5" />
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
              <p className="text-xl text-gray-300">Service Available</p>
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
            Book online now and save 10% on your first junk removal
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
              href="tel:503-874-3705"
              className="bg-white text-slate-800 border-4 border-slate-800 px-12 py-6 rounded-xl text-2xl font-bold hover:bg-slate-50 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center gap-3"
            >
              <Phone className="h-7 w-7" />
              Call: 503-874-3705
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
