import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What are your trailer rental rates?',
    answer: 'We offer competitive daily, weekly, and monthly rates. Southland 6x12 10k starts at $120/day, $825/week, or $3,250/month. Southland 7x14 14k starts at $130/day, $900/week, or $3,550/month. Delivery fees vary by location.'
  },
  {
    question: 'What is the weight capacity of your trailers?',
    answer: 'Our Southland 6x12 trailer has an 8,745 lb capacity, and our Southland 7x14 trailer has a 12,308 lb capacity. Both are perfect for construction debris, yard waste, dirt, gravel, and general hauling needs.'
  },
  {
    question: 'Do you deliver trailers?',
    answer: 'Yes! We offer delivery service throughout Molalla and surrounding areas in Clackamas County. Delivery fees depend on distance. You can also pick up the trailer at our location: 33250 S Wilhoit Rd, Molalla.'
  },
  {
    question: 'What can I haul in your dump trailers?',
    answer: 'Our trailers are perfect for construction debris, yard waste, dirt, gravel, mulch, furniture, appliances, and general junk removal. Please contact us if you have questions about specific materials.'
  },
  {
    question: 'How do I operate the dump feature?',
    answer: 'Our dump trailers are easy to operate with a hydraulic lift system. We provide a brief demonstration during delivery or pickup. The process is simple and safe when following basic instructions.'
  },
  {
    question: 'What do I need to tow the trailer?',
    answer: 'You\'ll need a vehicle with appropriate towing capacity and a 2 5/16" ball hitch. We recommend a truck or SUV rated for the trailer\'s weight. Contact us if you\'re unsure about your vehicle\'s compatibility.'
  },
  {
    question: 'How far in advance should I book?',
    answer: 'We recommend booking as early as possible, especially during peak season (spring and summer). However, we often have same-day or next-day availability. Call us at 503-500-6121 to check current availability.'
  },
  {
    question: 'What areas do you serve?',
    answer: 'We primarily serve Molalla and surrounding areas in Clackamas County, including Canby, Oregon City, Woodburn, and nearby communities. Contact us to confirm delivery to your specific location.'
  },
  {
    question: 'Do you offer junk removal services?',
    answer: 'Yes! We provide full-service junk removal where we handle all the loading and hauling for you. This is perfect for estate cleanouts, foreclosure cleanup, or any situation where you need us to do the heavy lifting.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept card, cash, or Venmo. Payment is due at the time of rental or service.'
  },
  {
    question: 'Is there a deposit required?',
    answer: 'Yes, we require a refundable security deposit for trailer rentals. The deposit amount varies by trailer type and rental duration. The deposit is fully refunded when the trailer is returned in good condition.'
  },
  {
    question: 'Can I extend my rental period?',
    answer: 'Absolutely! Just give us a call at 503-500-6121 before your rental period ends, and we\'ll be happy to extend it based on availability. Extended rentals may qualify for weekly or monthly rates.'
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-slate-800 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-xl text-gray-600 text-center mb-16">
          Find answers to common questions about our trailer rentals and services
        </p>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-lg text-slate-800 pr-4">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-green-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 pt-2">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-12 text-center bg-white rounded-lg p-8 shadow-md">
          <h3 className="text-2xl font-bold text-slate-800 mb-3">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            We're here to help! Give us a call or send us an email.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:503-500-6121"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Call: 503-500-6121
            </a>
            <a
              href="mailto:Molallatrailerrental@outlook.com"
              className="bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-600 transition-colors font-semibold"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
