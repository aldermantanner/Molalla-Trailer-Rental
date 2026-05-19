import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What junk removal services do you offer?',
    answer: 'We offer a full range of junk removal services including: appliance removal, general trash and junk removal, debris removal, yard cleanup, garage cleanouts, complete house cleanouts, hoarder house cleanouts, furniture removal, and commercial junk removal. If it\'s not hazardous, we can likely haul it.'
  },
  {
    question: 'How much does junk removal cost?',
    answer: 'Our pricing is volume-based — you pay based on how much of our truck you fill. Prices start at $150 for small loads (1–2 yards), $250–$350 for mid-size loads (3–4 yards), $425–$550 for larger loads (5–7 yards), and $650–$800 for a full truck (8–15 yards). Final pricing is confirmed on-site.'
  },
  {
    question: 'Do you do same-day junk removal?',
    answer: 'Yes, same-day service is often available depending on schedule. Call or text us at 503-874-3705 and we\'ll do our best to get to you quickly. Priority pickup add-on (+$95) guarantees you the first available slot.'
  },
  {
    question: 'Do I need to be home during the junk removal?',
    answer: 'Not necessarily. As long as we have access to the items and a way to confirm the job scope and payment, we can handle it without you present. Just reach out and we\'ll work out the details.'
  },
  {
    question: 'What areas do you serve?',
    answer: 'We serve Molalla and surrounding communities throughout Clackamas County, including Canby, Oregon City, Woodburn, Silverton, Estacada, Wilsonville, West Linn, Lake Oswego, Gladstone, Milwaukie, and Sandy. Contact us to confirm service to your specific area.'
  },
  {
    question: 'Do you remove appliances?',
    answer: 'Yes! We remove all types of household appliances including refrigerators, washers, dryers, stoves, dishwashers, microwaves, and more. Appliance removal is one of our most requested services.'
  },
  {
    question: 'Can you help with a hoarder house cleanout?',
    answer: 'Yes. We offer full hoarder house cleanout services. We work discreetly, respectfully, and efficiently. These jobs are quoted on-site given the variety of material and volume involved. Call us to schedule a walkthrough and estimate.'
  },
  {
    question: 'Do you do estate and full house cleanouts?',
    answer: 'Absolutely. We specialize in complete house cleanouts for estates, foreclosures, move-outs, and property transitions. We can clear an entire home in a single visit or across multiple trips depending on volume.'
  },
  {
    question: 'What do you NOT take?',
    answer: 'We cannot take hazardous materials, chemicals, liquids, paint, or asbestos. For special disposal items like concrete, dirt, brick, or roofing shingles, those require a custom quote due to weight surcharges at the dump.'
  },
  {
    question: 'How do I get a quote?',
    answer: 'The fastest way is to text us photos of what you need removed at 503-874-3705. We\'ll reply with a quick estimate. You can also call us directly or book online and we\'ll reach out to confirm pricing before we show up.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept card, cash, or Venmo. Payment is collected at the time of service.'
  },
  {
    question: 'Are you veteran owned?',
    answer: 'Yes. Bare Acre Hauling is proudly veteran owned and operated. We offer 10% off for veterans, first responders, and police. Just mention it when you book.'
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
          Everything you need to know about our junk removal services
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
          <h3 className="text-2xl font-bold text-slate-800 mb-3">Still have questions?</h3>
          <p className="text-gray-600 mb-6">
            We're here to help. Call, text, or send us an email.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:503-874-3705"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Call: 503-874-3705
            </a>
            <a
              href="mailto:BareAcreHauling@outlook.com"
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
