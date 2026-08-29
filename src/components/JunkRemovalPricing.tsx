import { useState } from 'react';
import {
  Truck, Clock, Users, Trash2, TrendingUp, Check, X, Phone,
  Package, Home, Leaf, Wrench, Archive, Building2, Calculator, DollarSign, MapPin,
} from 'lucide-react';

type LoadSize = 'small' | 'medium' | 'large' | 'full';
type DriveZone = 'local' | 'nearby' | 'far' | 'distant';
type ServiceLevel = 'diy' | 'full';

const LOAD_SIZES: Record<LoadSize, { label: string; yards: string; laborHours: number; dumpFee: number; desc: string }> = {
  small:  { label: 'Small',       yards: '1–3 yards',   laborHours: 1, dumpFee: 45,  desc: 'A few appliances, small pile of junk' },
  medium: { label: 'Medium',      yards: '4–6 yards',   laborHours: 2, dumpFee: 85,  desc: 'Room cleanout, garage items, furniture' },
  large:  { label: 'Large',       yards: '7–10 yards',  laborHours: 3, dumpFee: 213, desc: 'Garage cleanout, remodel debris (~1.5 tons)' },
  full:   { label: 'Full Load',   yards: '11–15 yards', laborHours: 4, dumpFee: 284, desc: 'Estate cleanout, full house, hoarder home (~2 tons)' },
};

const DRIVE_ZONES: Record<DriveZone, { label: string; minutes: number; miles: number; desc: string }> = {
  local:   { label: 'Local — Molalla area',        minutes: 30,  miles: 20,  desc: '0–15 min one way' },
  nearby:  { label: 'Nearby — Clackamas County',   minutes: 60,  miles: 40,  desc: '15–30 min one way' },
  far:     { label: 'Far — Portland metro',        minutes: 90,  miles: 60,  desc: '30–45 min one way' },
  distant: { label: 'Distant — outlying areas',    minutes: 120, miles: 80,  desc: '45+ min one way' },
};

const LABOR_RATE_PER_HOUR = 55;
const DIESEL_PRICE = 5.50;
const TRUCK_MPG = 16;
const FUEL_COST_PER_MILE = DIESEL_PRICE / TRUCK_MPG;
const VEHICLE_WEAR_PER_MILE = 0.15;
const DRIVER_RATE_PER_MIN = 0.45;
const PROFIT_MARGIN = 0.30;
const MINIMUM = 150;

const serviceTypes = [
  { icon: Package,    name: 'Appliance Removal',         desc: 'Fridges, washers, dryers, stoves, dishwashers', color: 'bg-blue-50 border-blue-200',     iconBg: 'bg-blue-100',     iconColor: 'text-blue-600' },
  { icon: Home,       name: 'Garage Cleanouts',          desc: 'Full garage clear-outs including shelves, boxes, tools, and junk', color: 'bg-yellow-50 border-yellow-200', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600' },
  { icon: Leaf,       name: 'Yard Cleanup',              desc: 'Brush, branches, yard waste, and green debris removal', color: 'bg-emerald-50 border-emerald-200', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
  { icon: Wrench,     name: 'Debris Removal',            desc: 'Construction waste, drywall, lumber, and remodel debris', color: 'bg-orange-50 border-orange-200', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
  { icon: Archive,    name: 'Complete House Cleanout',   desc: 'Full-property cleanouts for estates, foreclosures, and move-outs', color: 'bg-slate-50 border-slate-200', iconBg: 'bg-slate-100', iconColor: 'text-slate-600' },
  { icon: Building2,  name: 'Hoarder House Cleanouts',   desc: 'Discreet, compassionate cleanouts for severely cluttered properties', color: 'bg-red-50 border-red-200', iconBg: 'bg-red-100', iconColor: 'text-red-600' },
];

const factorDetails = [
  { icon: MapPin,      title: 'Drive Time',      desc: 'Round-trip travel to your location. Closer jobs cost less — that savings passes to you.',     color: 'text-blue-600',   bg: 'bg-blue-100' },
  { icon: Users,       title: 'Labor',           desc: 'Crew size and time on-site. Bigger loads take more hands and more hours.',                    color: 'text-green-600',  bg: 'bg-green-100' },
  { icon: Trash2,      title: 'Dump Fees',       desc: 'Disposal costs at the transfer station, based on weight and material type.',                  color: 'text-orange-600', bg: 'bg-orange-100' },
  { icon: TrendingUp,  title: 'Profit Margin',   desc: 'A modest 30% margin keeps the business running. No hidden fees on top.',                      color: 'text-slate-600',  bg: 'bg-slate-100' },
];

export function JunkRemovalPricing() {
  const [loadSize, setLoadSize] = useState<LoadSize>('medium');
  const [driveZone, setDriveZone] = useState<DriveZone>('local');
  const [serviceLevel, setServiceLevel] = useState<ServiceLevel>('full');

  const workers = serviceLevel === 'full' ? 2 : 1;
  const load = LOAD_SIZES[loadSize];
  const zone = DRIVE_ZONES[driveZone];

  const fuelCost = zone.miles * FUEL_COST_PER_MILE;
  const wearCost = zone.miles * VEHICLE_WEAR_PER_MILE;
  const driverTimeCost = zone.minutes * DRIVER_RATE_PER_MIN;
  const driveCost = fuelCost + wearCost + driverTimeCost;
  const laborCost = workers * load.laborHours * LABOR_RATE_PER_HOUR;
  const dumpFee = load.dumpFee;
  const subtotal = driveCost + laborCost + dumpFee;
  const profit = subtotal * PROFIT_MARGIN;
  const rawTotal = subtotal + profit;
  const total = Math.max(rawTotal, MINIMUM);
  const hitMinimum = rawTotal < MINIMUM;

  const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:py-12">
      {/* Hero */}
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-3">
          Fair Pricing. Built From Real Costs.
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          No flat-rate guessing. Every job is priced on four simple factors: drive time, labor, dump fees, and a modest margin.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm sm:text-base font-semibold shadow-lg">
          <DollarSign className="h-5 w-5" />
          $150 minimum on all jobs
        </div>
      </div>

      {/* Four Factors */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
        {factorDetails.map((f, i) => (
          <div key={i} className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 ${f.bg} rounded-full mb-3`}>
              <f.icon className={`h-6 w-6 ${f.color}`} />
            </div>
            <h4 className="font-bold text-slate-800 text-sm sm:text-base mb-1">{f.title}</h4>
            <p className="text-xs sm:text-sm text-gray-500 leading-snug">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Interactive Estimator */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-10">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-5 sm:px-8 py-5 flex items-center gap-3">
          <Calculator className="h-7 w-7 text-green-400 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-white">Cost Estimator</h3>
            <p className="text-sm text-gray-300">Adjust the options to see your estimated price</p>
          </div>
        </div>

        <div className="p-5 sm:p-8 space-y-7">
          {/* Load Size */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">How much junk?</label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
              {(Object.keys(LOAD_SIZES) as LoadSize[]).map((key) => {
                const item = LOAD_SIZES[key];
                const active = loadSize === key;
                return (
                  <button
                    key={key}
                    onClick={() => setLoadSize(key)}
                    className={`rounded-xl p-3 sm:p-4 text-left border-2 transition-all ${active ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-bold text-sm sm:text-base ${active ? 'text-green-700' : 'text-slate-700'}`}>{item.label}</span>
                      {active && <Check className="h-4 w-4 text-green-600" />}
                    </div>
                    <div className="text-xs text-gray-500 mb-1">{item.yards}</div>
                    <div className="text-xs text-gray-400 leading-snug hidden sm:block">{item.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Drive Zone */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Where are you located?</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {(Object.keys(DRIVE_ZONES) as DriveZone[]).map((key) => {
                const item = DRIVE_ZONES[key];
                const active = driveZone === key;
                return (
                  <button
                    key={key}
                    onClick={() => setDriveZone(key)}
                    className={`rounded-xl p-3 sm:p-4 text-left border-2 transition-all flex items-center justify-between ${active ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                  >
                    <div>
                      <div className={`font-bold text-sm sm:text-base ${active ? 'text-green-700' : 'text-slate-700'}`}>{item.label}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                    {active && <Check className="h-5 w-5 text-green-600 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Service Level */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Service level?</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <button
                onClick={() => setServiceLevel('diy')}
                className={`rounded-xl p-4 text-left border-2 transition-all ${serviceLevel === 'diy' ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-bold text-sm sm:text-base ${serviceLevel === 'diy' ? 'text-green-700' : 'text-slate-700'}`}>You Load, We Haul</span>
                  {serviceLevel === 'diy' && <Check className="h-5 w-5 text-green-600" />}
                </div>
                <div className="text-xs text-gray-500">1 worker — you do the loading, we handle hauling and disposal</div>
              </button>
              <button
                onClick={() => setServiceLevel('full')}
                className={`rounded-xl p-4 text-left border-2 transition-all ${serviceLevel === 'full' ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-bold text-sm sm:text-base ${serviceLevel === 'full' ? 'text-green-700' : 'text-slate-700'}`}>Full Service</span>
                  {serviceLevel === 'full' && <Check className="h-5 w-5 text-green-600" />}
                </div>
                <div className="text-xs text-gray-500">2 workers — we load everything, haul it, and clean up</div>
              </button>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-5 sm:p-6 border border-gray-200">
            <h4 className="font-bold text-slate-800 mb-4 text-sm sm:text-base flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Cost Breakdown
            </h4>
            <div className="space-y-2.5 text-sm sm:text-base">
              <div className="flex items-center justify-between py-1">
                <span className="text-gray-600 flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-500" />Drive ({zone.miles} mi round-trip · fuel + driver)</span>
                <span className="font-semibold text-slate-700">{fmt(driveCost)}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-gray-600 flex items-center gap-2"><Users className="h-4 w-4 text-green-500" />Labor ({workers} {workers === 1 ? 'worker' : 'workers'} × {load.laborHours} {load.laborHours === 1 ? 'hr' : 'hrs'})</span>
                <span className="font-semibold text-slate-700">{fmt(laborCost)}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-gray-600 flex items-center gap-2"><Trash2 className="h-4 w-4 text-orange-500" />Dump fees (est. {load.label.toLowerCase()})</span>
                <span className="font-semibold text-slate-700">{fmt(dumpFee)}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-gray-600 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-slate-500" />Margin (30%)</span>
                <span className="font-semibold text-slate-700">{fmt(profit)}</span>
              </div>
              <div className="border-t border-gray-300 pt-3 mt-3" />
              <div className="flex items-center justify-between py-1">
                <span className="font-bold text-slate-800">Estimated Total</span>
                <span className="text-2xl sm:text-3xl font-bold text-green-600">{fmt(total)}</span>
              </div>
              {hitMinimum && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                  <p className="text-xs sm:text-sm text-amber-800">
                    This estimate falls below our $150 minimum — that's what you'd pay.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Disclaimer + CTA */}
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs sm:text-sm text-blue-900">
                <strong>This is an estimate.</strong> Final pricing is confirmed on-site based on actual load size, material type, and disposal weight. Text us photos for a firm quote before we arrive.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://clienthub.getjobber.com/hubs/935796ca-8da1-401b-a3dd-604659dcbf70/public/requests/2258657/new"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-600 text-white px-6 py-3.5 rounded-lg hover:bg-green-700 transition-colors font-bold text-center text-sm sm:text-base"
              >
                Get a Firm Quote
              </a>
              <a
                href="sms:503-874-3705"
                className="flex-1 bg-slate-700 text-white px-6 py-3.5 rounded-lg hover:bg-slate-600 transition-colors font-bold text-center text-sm sm:text-base"
              >
                Text Photos: 503-874-3705
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Services We Handle */}
      <div className="mb-10">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 text-center">Services We Offer</h3>
        <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
          One company, every type of cleanout. Same cost-factor pricing applies to all jobs.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {serviceTypes.map((s, i) => (
            <div key={i} className={`rounded-xl p-4 sm:p-5 border-2 ${s.color} flex items-start gap-3`}>
              <div className={`${s.iconBg} rounded-xl p-2.5 flex-shrink-0`}>
                <s.icon className={`h-5 w-5 ${s.iconColor}`} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-0.5 text-sm sm:text-base">{s.name}</h4>
                <p className="text-xs sm:text-sm text-gray-600">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-gray-500 text-xs sm:text-sm">Also: general trash removal, furniture removal, commercial cleanouts, and more. Call if you're not sure.</p>
      </div>

      {/* What's Included / Custom Quote */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-10">
        <div className="bg-green-50 rounded-xl p-5 sm:p-6 border border-green-200">
          <h3 className="text-lg font-bold text-slate-800 mb-3">What's Included</h3>
          <ul className="space-y-2">
            {[
              'Labor & loading',
              'Hauling & disposal of standard household junk',
              'Furniture, appliances, general trash, mixed items',
              'Yard waste and green debris',
              'Construction and remodel debris',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-amber-50 rounded-xl p-5 sm:p-6 border border-amber-200">
          <h3 className="text-lg font-bold text-slate-800 mb-3">Materials Requiring a Custom Quote</h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-3">Some materials have special disposal requirements or significant weight surcharges:</p>
          <ul className="space-y-2">
            {['Concrete, dirt, brick, asphalt', 'Roofing material (shingles)', 'Hazardous or restricted waste'].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-amber-600 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-600 mt-3 italic">We'll review materials before loading — no surprises at the dump.</p>
        </div>
      </div>

      {/* What We Don't Take */}
      <div className="bg-red-50 rounded-xl p-5 sm:p-8 mb-10 border border-red-200">
        <h3 className="text-xl font-bold text-slate-800 mb-4 sm:mb-6 text-center">What We Don't Take</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
          {['Hazardous waste', 'Chemicals & liquids', 'Paint', 'Asbestos'].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
              <X className="h-5 w-5 text-red-600 flex-shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-6 sm:p-8 text-white text-center">
        <div className="inline-flex items-center gap-2 bg-red-600/90 text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold mb-4">
          10% OFF for Veterans, First Responders & Police
        </div>
        <h3 className="text-xl sm:text-2xl font-bold mb-4">Ready to Get Started?</h3>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="tel:503-874-3705" className="inline-flex items-center justify-center gap-2 bg-white text-slate-800 px-6 py-3.5 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-sm sm:text-base">
            <Phone className="h-5 w-5" />
            Call: 503-874-3705
          </a>
          <a href="sms:503-874-3705" className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3.5 rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm sm:text-base">
            Text for Fast Quote
          </a>
        </div>
        <p className="text-slate-300 mt-4 text-xs sm:text-sm">Serving Molalla & surrounding areas in Clackamas County</p>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6 italic">
        *Final pricing confirmed on-site based on actual load size, material type, and disposal weight.
      </p>
    </div>
  );
}
