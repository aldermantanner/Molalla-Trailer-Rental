import { MapPin, CheckCircle } from 'lucide-react';
import { InteractiveMap } from './InteractiveMap';

export function ServiceArea() {
  const serviceAreas = [
    { name: 'Molalla', featured: true },
    { name: 'Canby', featured: true },
    { name: 'Oregon City', featured: true },
    { name: 'Woodburn', featured: false },
    { name: 'Silverton', featured: false },
    { name: 'Estacada', featured: false },
    { name: 'Wilsonville', featured: false },
    { name: 'West Linn', featured: false },
    { name: 'Lake Oswego', featured: false },
    { name: 'Gladstone', featured: false },
    { name: 'Milwaukie', featured: false },
    { name: 'Sandy', featured: false }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-8 w-8 text-green-600" />
              <h2 className="text-4xl font-bold text-slate-800">
                Service Area
              </h2>
            </div>
            <p className="text-xl text-gray-600 mb-6">
              We proudly serve Molalla and surrounding communities throughout Clackamas County and beyond. Our dump trailer rentals, junk removal, and material delivery services are available across the region.
            </p>
            <p className="text-base text-gray-600 mb-8">
              Based in Molalla, Oregon, we specialize in serving homeowners, contractors, and businesses throughout Clackamas County. Whether you need a dump trailer in Canby, junk removal in Oregon City, or material delivery in Woodburn, we've got you covered with professional service and competitive rates.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Primary Service Areas
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {serviceAreas
                  .filter((area) => area.featured)
                  .map((area, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-800">
                        {area.name}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Extended Service Areas
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {serviceAreas
                  .filter((area) => !area.featured)
                  .map((area, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{area.name}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Don't see your city listed?
              </h3>
              <p className="text-green-800 mb-4">
                We may still be able to serve your area! Delivery fees vary by distance. Contact us to confirm availability for your location.
              </p>
              <a
                href="tel:503-500-6121"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Call: 503-500-6121
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <MapPin className="h-6 w-6" />
                  Our Service Area
                </h3>
              </div>
              <InteractiveMap />
            </div>

            <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl p-6 shadow-lg">
              <div className="bg-white rounded-lg p-6">
                <h4 className="text-xl font-bold text-slate-800 mb-4 text-center">
                  Delivery Information
                </h4>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-800 text-sm mb-1">
                        Pickup Location
                      </h5>
                      <p className="text-gray-600 text-sm">
                        33250 S Wilhoit Rd, Molalla, OR 97038
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-800 text-sm mb-1">
                        Free Self-Pickup
                      </h5>
                      <p className="text-gray-600 text-sm">
                        Pick up at our location at no extra charge
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-800 text-sm mb-1">
                        Delivery Available
                      </h5>
                      <p className="text-gray-600 text-sm">
                        Delivery fees based on distance from Molalla
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <a
                      href="tel:503-500-6121"
                      className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-semibold text-center text-sm"
                    >
                      Call Now
                    </a>
                    <a
                      href="mailto:Molallatrailerrental@outlook.com"
                      className="flex-1 bg-slate-700 text-white px-4 py-2.5 rounded-lg hover:bg-slate-600 transition-colors font-semibold text-center text-sm"
                    >
                      Email Us
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
