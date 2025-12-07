import { useState } from 'react';
import { Calculator, Calendar, Truck } from 'lucide-react';

type TrailerType = 'Southland 6x12 10k' | 'Southland 7x14 14k';

const TRAILER_PRICING = {
  'Southland 6x12 10k': {
    daily: 120,
    weekly: 825,
    monthly: 3250,
  },
  'Southland 7x14 14k': {
    daily: 130,
    weekly: 900,
    monthly: 3550,
  },
};

export function PricingCalculator() {
  const [trailerType, setTrailerType] = useState<TrailerType>('Southland 7x14 14k');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showEstimate, setShowEstimate] = useState(false);

  const calculatePrice = () => {
    if (!startDate || !endDate) {
      return 0;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    if (days < 1) return 0;

    if (days >= 30) {
      return TRAILER_PRICING[trailerType].monthly;
    } else if (days >= 7) {
      const weeks = Math.ceil(days / 7);
      return weeks * TRAILER_PRICING[trailerType].weekly;
    } else {
      return days * TRAILER_PRICING[trailerType].daily;
    }
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      setShowEstimate(true);
    }
  };

  const days = calculateDays();
  const price = calculatePrice();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-green-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-green-600 rounded-full mb-4">
            <Calculator className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Pricing Calculator
          </h2>
          <p className="text-xl text-gray-600">
            Get an instant estimate for your trailer rental. Actual pricing confirmed upon booking.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          <form onSubmit={handleCalculate} className="space-y-6">
            <div>
              <label htmlFor="trailer" className="block text-sm font-semibold text-gray-700 mb-2">
                <Truck className="inline h-4 w-4 mr-1" />
                Select Trailer
              </label>
              <select
                id="trailer"
                value={trailerType}
                onChange={(e) => setTrailerType(e.target.value as TrailerType)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
              >
                <option value="Southland 6x12 10k">
                  Southland 6x12 10k - Starting at $120/day
                </option>
                <option value="Southland 7x14 14k">
                  Southland 7x14 14k - Starting at $130/day
                </option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="start" className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Start Date
                </label>
                <input
                  type="date"
                  id="start"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setShowEstimate(false);
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                  required
                />
              </div>

              <div>
                <label htmlFor="end" className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  End Date
                </label>
                <input
                  type="date"
                  id="end"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setShowEstimate(false);
                  }}
                  min={startDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-4 rounded-lg text-lg font-bold hover:bg-green-700 transition-colors"
            >
              Calculate Estimate
            </button>
          </form>

          {showEstimate && days > 0 && price > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6">
                <div className="text-center mb-6">
                  <div className="text-gray-600 text-lg mb-2">
                    Estimated Rental Cost
                  </div>
                  <div className="text-5xl font-bold text-green-600 mb-2">
                    ${price.toLocaleString()}
                  </div>
                  <div className="text-gray-600">
                    for {days} {days === 1 ? 'day' : 'days'}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-slate-800 mb-3">
                    Pricing Breakdown:
                  </h4>
                  <div className="space-y-2 text-gray-700">
                    <div className="flex justify-between">
                      <span>Trailer:</span>
                      <span className="font-semibold">{trailerType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rental Period:</span>
                      <span className="font-semibold">{days} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate Applied:</span>
                      <span className="font-semibold">
                        {days >= 30
                          ? 'Monthly Rate'
                          : days >= 7
                          ? 'Weekly Rate'
                          : 'Daily Rate'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> This is an estimate only. Delivery fees are not included and vary by location. A refundable security deposit is required.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="#booking"
                    onClick={(e) => {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold text-center"
                  >
                    Book Now
                  </a>
                  <a
                    href="tel:503-500-6121"
                    className="flex-1 bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-600 transition-colors font-semibold text-center"
                  >
                    Call: 503-500-6121
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Pricing Tiers:</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Daily Rate (1-6 days)</span>
                <div className="text-right">
                  <div className="font-semibold text-slate-800">
                    ${TRAILER_PRICING[trailerType].daily}/day
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Weekly Rate (7+ days)</span>
                <div className="text-right">
                  <div className="font-semibold text-slate-800">
                    ${TRAILER_PRICING[trailerType].weekly}/week
                  </div>
                  <div className="text-sm text-gray-600">
                    (${Math.round(TRAILER_PRICING[trailerType].weekly / 7)}/day)
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Monthly Rate (30+ days)</span>
                <div className="text-right">
                  <div className="font-semibold text-slate-800">
                    ${TRAILER_PRICING[trailerType].monthly}/month
                  </div>
                  <div className="text-sm text-gray-600">
                    (${Math.round(TRAILER_PRICING[trailerType].monthly / 30)}/day)
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
