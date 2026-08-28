import { useEffect } from 'react';

export function FAQSchema() {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What junk removal services do you offer?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We offer appliance removal, general trash and junk removal, debris removal, yard cleanup, garage cleanouts, complete house cleanouts, hoarder house cleanouts, furniture removal, and commercial junk removal. If it's not hazardous, we can likely haul it."
          }
        },
        {
          "@type": "Question",
          "name": "How much does junk removal cost?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our pricing is volume-based. Small loads (1-2 yards) start at $150, mid-size loads (3-4 yards) are $275-$375, larger loads (5-6 yards) are $425-$550, and full truck loads (7-15 yards) are $625-$750. Final pricing is confirmed on-site."
          }
        },
        {
          "@type": "Question",
          "name": "Do you offer same-day junk removal?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, same-day service is often available depending on our schedule. Call or text us at 503-874-3705 and we'll do our best to get to you quickly."
          }
        },
        {
          "@type": "Question",
          "name": "What areas do you serve?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We serve Molalla and surrounding communities throughout Clackamas County, including Canby, Oregon City, Woodburn, Silverton, Estacada, Wilsonville, West Linn, Lake Oswego, Gladstone, Milwaukie, and Sandy."
          }
        },
        {
          "@type": "Question",
          "name": "Do you remove appliances?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! We remove all types of household appliances including refrigerators, washers, dryers, stoves, dishwashers, microwaves, and more."
          }
        },
        {
          "@type": "Question",
          "name": "Can you help with hoarder house and estate cleanouts?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. We offer discreet, respectful hoarder house cleanouts and full estate cleanouts for foreclosures, move-outs, and property transitions. We can clear an entire home in a single visit or across multiple trips. Call us to schedule a walkthrough and estimate."
          }
        },
        {
          "@type": "Question",
          "name": "What items do you not take?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We cannot take hazardous materials, chemicals, liquids, paint, or asbestos. Items like concrete, dirt, brick, or roofing shingles require a custom quote due to weight surcharges at the dump."
          }
        },
        {
          "@type": "Question",
          "name": "Are you veteran owned?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Bare Acre Hauling is proudly veteran owned and operated. We offer 10% off for veterans, first responders, and police. Just mention it when you book."
          }
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    script.id = 'faq-schema';
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('faq-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return null;
}
