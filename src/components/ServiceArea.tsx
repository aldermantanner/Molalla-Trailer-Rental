import { MapPin, CheckCircle } from 'lucide-react';

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
            <p className="text-xl text-gray-600 mb-8">
              We proudly serve Molalla and surrounding communities throughout Clackamas County and beyond. Our dump trailer rentals, junk removal, and material delivery services are available across the region.
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

          <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl p-8 shadow-xl">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                Delivery Information
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">
                      Pickup Location
                    </h4>
                    <p className="text-gray-600">
                      33250 S Wilhoit Rd<br />
                      Molalla, OR 97038
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">
                      Free Self-Pickup
                    </h4>
                    <p className="text-gray-600">
                      Pick up your trailer at our location at no extra charge. Perfect if you're nearby or prefer to save on delivery fees.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">
                      Delivery Available
                    </h4>
                    <p className="text-gray-600">
                      We'll bring the trailer to you! Delivery fees are based on distance from our Molalla location. Contact us for a quote.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">
                      Flexible Scheduling
                    </h4>
                    <p className="text-gray-600">
                      Schedule delivery and pickup times that work for your project timeline. Same-day service often available.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-gray-600 mb-4">
                  Questions about delivery to your area?
                </p>
                <div className="flex gap-3">
                  <a
                    href="tel:503-500-6121"
                    className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold text-center"
                  >
                    Call Now
                  </a>
                  <a
                    href="mailto:Molallatrailerrental@outlook.com"
                    className="flex-1 bg-slate-700 text-white px-4 py-3 rounded-lg hover:bg-slate-600 transition-colors font-semibold text-center"
                  >
                    Email Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
