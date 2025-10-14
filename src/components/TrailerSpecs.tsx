import { Ruler, Weight, Package, Gauge, Wrench, Shield } from 'lucide-react';

interface Specification {
  icon: JSX.Element;
  label: string;
  value: string;
}

interface TrailerSpecsData {
  name: string;
  image: string;
  price: {
    daily: string;
    weekly: string;
    monthly: string;
  };
  specs: Specification[];
  features: string[];
  includedItems: string[];
}

const trailerData: TrailerSpecsData[] = [
  {
    name: '2025 Southland 6x12 SL612-10K Dump Trailer',
    image: '/image copy copy copy copy copy copy.png',
    price: {
      daily: '$120',
      weekly: '$825',
      monthly: '$3,250'
    },
    specs: [
      {
        icon: <Ruler className="h-5 w-5" />,
        label: 'Bed Dimensions',
        value: '6\' W x 12\' L'
      },
      {
        icon: <Weight className="h-5 w-5" />,
        label: 'Weight Capacity',
        value: '8,745 lbs'
      },
      {
        icon: <Package className="h-5 w-5" />,
        label: 'Sidewall Height',
        value: '24 inches'
      },
      {
        icon: <Gauge className="h-5 w-5" />,
        label: 'Hitch Size',
        value: '2 5/16" ball'
      },
      {
        icon: <Wrench className="h-5 w-5" />,
        label: 'Dump System',
        value: 'Hydraulic'
      },
      {
        icon: <Shield className="h-5 w-5" />,
        label: 'GVWR',
        value: '11,464 lbs'
      }
    ],
    features: [
      'Perfect for residential projects and yard cleanup',
      'Easy loading with low sides',
      'Hydraulic dump for effortless unloading',
      'Heavy-duty construction',
      'LED lighting package',
      'Full length tarp included'
    ],
    includedItems: [
      '(2) Ramps',
      '(1) Spare tire',
      '(1) Solar battery charger',
      '(2) 5,000 Lbs ratchet straps',
      '(2) 1,000 Lbs ratchet straps',
      '(2) Chain binders',
      '(2) 14ft 3/8 chain',
      '(1) Bottle jack',
      '(1) Tire iron'
    ]
  },
  {
    name: '2025 Southland 7x14 SL714-14K Dump Trailer',
    image: '/image copy copy copy copy copy copy copy.png',
    price: {
      daily: '$130',
      weekly: '$900',
      monthly: '$3,550'
    },
    specs: [
      {
        icon: <Ruler className="h-5 w-5" />,
        label: 'Bed Dimensions',
        value: '7\' W x 14\' L'
      },
      {
        icon: <Weight className="h-5 w-5" />,
        label: 'Weight Capacity',
        value: '12,308 lbs'
      },
      {
        icon: <Package className="h-5 w-5" />,
        label: 'Sidewall Height',
        value: '24 inches'
      },
      {
        icon: <Gauge className="h-5 w-5" />,
        label: 'Hitch Size',
        value: '2 5/16" ball'
      },
      {
        icon: <Wrench className="h-5 w-5" />,
        label: 'Dump System',
        value: 'Hydraulic'
      },
      {
        icon: <Shield className="h-5 w-5" />,
        label: 'GVWR',
        value: '15,432 lbs'
      }
    ],
    features: [
      'Ideal for larger commercial and construction projects',
      'Maximum capacity for heavy materials',
      'Hydraulic dump system with easy controls',
      'Reinforced frame and axles',
      'Upgraded LED lighting',
      'Full length tarp included'
    ],
    includedItems: [
      '(2) Ramps',
      '(1) Spare tire',
      '(1) Solar battery charger',
      '(2) 5,000 Lbs ratchet straps',
      '(2) 1,000 Lbs ratchet straps',
      '(2) Chain binders',
      '(2) 14ft 3/8 chain',
      '(1) Bottle jack',
      '(1) Tire iron'
    ]
  }
];

export function TrailerSpecs() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-slate-800 mb-4">
          Trailer Specifications
        </h2>
        <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
          Professional-grade dump trailers built for reliability and performance. Choose the size that fits your project needs.
        </p>
        <div className="space-y-12">
          {trailerData.map((trailer, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-xl overflow-hidden"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative h-96 md:h-auto">
                  <img
                    src={trailer.image}
                    alt={trailer.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
                    From {trailer.price.daily}/day
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-3xl font-bold text-slate-800 mb-6">
                    {trailer.name}
                  </h3>

                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">
                      Rental Rates
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {trailer.price.daily}
                        </div>
                        <div className="text-sm text-gray-600">Daily</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {trailer.price.weekly}
                        </div>
                        <div className="text-sm text-gray-600">Weekly</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {trailer.price.monthly}
                        </div>
                        <div className="text-sm text-gray-600">Monthly</div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">
                      Technical Specifications
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {trailer.specs.map((spec, specIndex) => (
                        <div
                          key={specIndex}
                          className="flex items-start gap-3"
                        >
                          <div className="text-green-600 mt-1">
                            {spec.icon}
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">
                              {spec.label}
                            </div>
                            <div className="font-semibold text-slate-800">
                              {spec.value}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {trailer.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start gap-2 text-gray-700"
                        >
                          <span className="text-green-600 mt-1">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">
                      Included with Your Rental
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {trailer.includedItems.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-start gap-2 text-gray-700 bg-green-50 px-3 py-2 rounded-lg"
                        >
                          <span className="text-green-600 mt-0.5">✓</span>
                          <span className="text-sm font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-slate-800 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Need Help Choosing?</h3>
          <p className="text-lg mb-6 opacity-90">
            Not sure which trailer is right for your project? Give us a call and we'll help you select the perfect option.
          </p>
          <a
            href="tel:503-500-6121"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
          >
            Call: 503-500-6121
          </a>
        </div>
      </div>
    </section>
  );
}
