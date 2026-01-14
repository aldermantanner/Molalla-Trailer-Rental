import { Check, X, TrendingUp, Shield, Clock, Phone } from 'lucide-react';

export function JunkRemovalPricing() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          Simple. Transparent. No surprises.
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We price junk removal based on <strong>volume</strong> (how much trailer space your junk takes up)
          and <strong>material type</strong> (local disposal fees) so you only pay for what you use.
        </p>
        <p className="text-lg text-slate-700 font-semibold mt-4">
          Minimum junk removal service: $150
        </p>
      </div>

      {/* How Pricing Works */}
      <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-8 mb-12">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          How Our Pricing Works
        </h3>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-slate-800 mb-2">Trailer Space Used</h4>
            <p className="text-gray-600 text-sm">Pay only for the volume you actually use</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-slate-800 mb-2">Service Level</h4>
            <p className="text-gray-600 text-sm">Choose the option that fits your needs</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-slate-800 mb-2">Optional Add-Ons</h4>
            <p className="text-gray-600 text-sm">Extra speed or convenience when you need it</p>
          </div>
        </div>
      </div>

      {/* Good / Better / Best Options */}
      <div className="mb-16">
        <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 text-center">
          Choose the Right Option for Your Job
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Good */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
            <div className="bg-gray-100 px-6 py-4">
              <h4 className="text-2xl font-bold text-slate-800">Good</h4>
              <p className="text-gray-600 font-semibold">You Fill, We Dump</p>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                <strong>Best For:</strong> DIY cleanups
              </p>
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">What's Included:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    Trailer drop-off & pickup
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    Hauling to disposal
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    Household junk disposal
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600">
                  <strong>Why Choose It:</strong> Most affordable option if you don't mind loading yourself
                </p>
              </div>
            </div>
          </div>

          {/* Better - Recommended */}
          <div className="bg-white rounded-xl shadow-xl border-4 border-green-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
              ⭐ RECOMMENDED
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 px-6 py-4">
              <h4 className="text-2xl font-bold text-white">Better</h4>
              <p className="text-green-50 font-semibold">Full-Service Junk Removal</p>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                <strong>Best For:</strong> Most homeowners
              </p>
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">What's Included:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    We load everything
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    Hauling to disposal
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    Household junk disposal
                  </li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-xs text-gray-700">
                  <strong>Why Choose It:</strong> We do all the work — fast and simple
                </p>
              </div>
            </div>
          </div>

          {/* Best */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-br from-slate-700 to-slate-600 px-6 py-4">
              <h4 className="text-2xl font-bold text-white">Best</h4>
              <p className="text-slate-100 font-semibold">Cleanout Special</p>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                <strong>Best For:</strong> Large cleanouts, move-outs
              </p>
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">What's Included:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    Full trailer (9 yards)
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    Loading included
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    Disposal included
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    Priority pickup
                  </li>
                </ul>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-gray-600">
                  <strong>Why Choose It:</strong> One price, zero stress, best overall value
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center bg-blue-50 rounded-lg p-6 border border-blue-200">
          <p className="text-lg font-semibold text-slate-800 mb-2">
            📸 Text Photos for a Fast Quote
          </p>
          <p className="text-gray-600">
            Send us a few photos of what you want removed and we'll give you a quick, accurate estimate.
          </p>
          <a
            href="sms:971-459-0077"
            className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Text Us: 971-459-0077
          </a>
        </div>
      </div>

      {/* Volume-Based Pricing */}
      <div className="mb-16">
        <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 text-center">
          Volume-Based Pricing (Trailer Space)
        </h3>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Our largest trailer holds <strong>up to 9 cubic yards</strong>. Most jobs fall into one of these ranges:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-slate-700 to-slate-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Trailer Space Used</th>
                <th className="px-6 py-4 text-left font-semibold">Typical Examples</th>
                <th className="px-6 py-4 text-left font-semibold">Base Price*</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-slate-800">1–2 yards (¼ load)</td>
                <td className="px-6 py-4 text-gray-600">Small piles, few items</td>
                <td className="px-6 py-4 text-green-600 font-bold">$150–$225</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-slate-800">3–4 yards (⅓–½ load)</td>
                <td className="px-6 py-4 text-gray-600">Room cleanout, furniture</td>
                <td className="px-6 py-4 text-green-600 font-bold">$275–$375</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-slate-800">5–6 yards (½–¾ load)</td>
                <td className="px-6 py-4 text-gray-600">Remodel debris, bulky junk</td>
                <td className="px-6 py-4 text-green-600 font-bold">$425–$550</td>
              </tr>
              <tr className="hover:bg-gray-50 bg-green-50">
                <td className="px-6 py-4 font-semibold text-slate-800">7–9 yards (Full load)</td>
                <td className="px-6 py-4 text-gray-600">Large cleanouts, move-outs</td>
                <td className="px-6 py-4 text-green-600 font-bold">$625–$750</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm text-gray-600 mt-4 text-center">
          *Base price includes labor, hauling, and standard household disposal up to included limits.
        </p>
      </div>

      {/* What's Included */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-green-50 rounded-xl p-8 border border-green-200">
          <h3 className="text-xl font-bold text-slate-800 mb-4">What's Included</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Check className="h-6 w-6 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">Labor & loading</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-6 w-6 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">Hauling & disposal of standard household junk</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-6 w-6 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">Furniture, general trash, and mixed household items</span>
            </li>
          </ul>
          <p className="text-sm text-gray-600 mt-4 italic">
            Most household cleanouts fall under 1 ton and are fully covered by our volume pricing.
          </p>
        </div>

        <div className="bg-amber-50 rounded-xl p-8 border border-amber-200">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Materials Requiring a Custom Quote</h3>
          <p className="text-sm text-gray-600 mb-4">
            Some materials are significantly heavier or have special disposal requirements:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-gray-700">
              <span className="text-amber-600">•</span>
              <span>Concrete, dirt, brick, asphalt</span>
            </li>
            <li className="flex items-start gap-2 text-gray-700">
              <span className="text-amber-600">•</span>
              <span>Roofing material</span>
            </li>
            <li className="flex items-start gap-2 text-gray-700">
              <span className="text-amber-600">•</span>
              <span>Hazardous or restricted waste</span>
            </li>
          </ul>
          <p className="text-sm text-gray-600 mt-4 italic">
            We'll always review materials before loading so there are no surprises.
          </p>
        </div>
      </div>

      {/* Optional Add-Ons */}
      <div className="mb-16">
        <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 text-center">
          Optional High-Value Add-Ons
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-800">No-Lift Guarantee</h4>
            </div>
            <p className="text-2xl font-bold text-blue-600 mb-2">+$75</p>
            <p className="text-gray-600">
              You don't lift a thing — we load everything.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-800">Priority Pickup</h4>
            </div>
            <p className="text-2xl font-bold text-purple-600 mb-2">+$99</p>
            <p className="text-gray-600">
              First available slot or same-day service when available.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-800">Dump Fee Protection</h4>
            </div>
            <p className="text-2xl font-bold text-green-600 mb-2">+$125</p>
            <p className="text-gray-600">
              Covers disposal costs up to 2 tons of household garbage. Perfect if you're unsure about weight.
            </p>
          </div>
        </div>
      </div>

      {/* Popular Packages */}
      <div className="mb-16">
        <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 text-center">
          Popular Packages
        </h3>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Cleanout Special */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-xl overflow-hidden text-white">
            <div className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">⭐</span>
                <h4 className="text-2xl font-bold">Cleanout Special</h4>
              </div>
              <p className="text-green-50 mb-6">Best Value</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  <span>Full trailer (up to 9 yards)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  <span>Loading included</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  <span>Disposal included (household junk)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  <span>Priority pickup</span>
                </li>
              </ul>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-sm">Starting at</p>
                <p className="text-4xl font-bold">$799</p>
              </div>
            </div>
          </div>

          {/* Landlord Package */}
          <div className="bg-gradient-to-br from-slate-700 to-slate-600 rounded-xl shadow-xl overflow-hidden text-white">
            <div className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">⭐</span>
                <h4 className="text-2xl font-bold">Landlord / Move-Out</h4>
              </div>
              <p className="text-slate-200 mb-6">Fast Turnaround</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  <span>Furniture & trash removal</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  <span>Fast turnaround</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  <span>Ideal for rentals & evictions</span>
                </li>
              </ul>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-lg font-semibold">Call for unit-based pricing</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* You Fill, We Dump Package */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 mb-16">
        <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center">
          You Fill, We Dump Package
        </h3>
        <p className="text-center text-gray-600 mb-6">
          Perfect if you want to save money and don't mind loading yourself.
        </p>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-6">
          <div className="bg-white rounded-lg p-6">
            <div className="text-3xl mb-2">1️⃣</div>
            <h4 className="font-semibold text-slate-800 mb-2">We Drop Off</h4>
            <p className="text-sm text-gray-600">We bring the trailer to your location</p>
          </div>
          <div className="bg-white rounded-lg p-6">
            <div className="text-3xl mb-2">2️⃣</div>
            <h4 className="font-semibold text-slate-800 mb-2">You Fill It</h4>
            <p className="text-sm text-gray-600">Load at your own pace</p>
          </div>
          <div className="bg-white rounded-lg p-6">
            <div className="text-3xl mb-2">3️⃣</div>
            <h4 className="font-semibold text-slate-800 mb-2">We Handle Dumping</h4>
            <p className="text-sm text-gray-600">We pick up and dispose of everything</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto">
          <h4 className="font-semibold text-slate-800 mb-3">Includes:</h4>
          <ul className="space-y-2 mb-4">
            <li className="flex items-center gap-2 text-gray-700">
              <Check className="h-5 w-5 text-green-600" />
              <span>Trailer drop-off & pickup</span>
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <Check className="h-5 w-5 text-green-600" />
              <span>Hauling & disposal of standard household junk</span>
            </li>
          </ul>
          <p className="text-2xl font-bold text-green-600 mb-2">Starting at $250 + volume</p>
          <p className="text-sm text-gray-600 italic">
            Heavy or restricted materials require a custom quote.
          </p>
        </div>
      </div>

      {/* What We Don't Take */}
      <div className="bg-red-50 rounded-xl p-8 mb-16 border border-red-200">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          What We Don't Take
        </h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-gray-700">
            <X className="h-5 w-5 text-red-600 flex-shrink-0" />
            <span>Hazardous waste</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <X className="h-5 w-5 text-red-600 flex-shrink-0" />
            <span>Chemicals & liquids</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <X className="h-5 w-5 text-red-600 flex-shrink-0" />
            <span>Paint</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <X className="h-5 w-5 text-red-600 flex-shrink-0" />
            <span>Asbestos</span>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-gradient-to-br from-slate-700 to-slate-600 rounded-xl p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-6">Why Molalla Trailer Rental?</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
          <div>
            <div className="text-3xl mb-2">🏡</div>
            <p className="font-semibold">Locally owned & operated</p>
          </div>
          <div>
            <div className="text-3xl mb-2">💰</div>
            <p className="font-semibold">Honest, local pricing</p>
          </div>
          <div>
            <div className="text-3xl mb-2">✅</div>
            <p className="font-semibold">No hidden fees</p>
          </div>
          <div>
            <div className="text-3xl mb-2">⚡</div>
            <p className="font-semibold">Fast, flexible scheduling</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:971-459-0077"
            className="inline-flex items-center justify-center gap-2 bg-white text-slate-800 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
          >
            <Phone className="h-5 w-5" />
            Call: 971-459-0077
          </a>
          <a
            href="sms:971-459-0077"
            className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
          >
            📱 Text for Fast Quote
          </a>
        </div>

        <p className="text-slate-200 mt-6">
          Serving Molalla & surrounding areas
        </p>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-sm text-gray-500 mt-8 italic">
        *Final pricing confirmed on-site based on actual volume and material type.
      </p>
    </div>
  );
}
