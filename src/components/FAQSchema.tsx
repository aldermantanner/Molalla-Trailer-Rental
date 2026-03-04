import { useEffect } from 'react';

export function FAQSchema() {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What are your trailer rental rates?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We offer competitive daily, weekly, and monthly rates. Southland 6x12 10k starts at $120/day, $750/week, or $3,000/month. Southland 7x14 14k starts at $130/day, $825/week, or $3,350/month. Delivery fees vary by location."
          }
        },
        {
          "@type": "Question",
          "name": "What areas do you serve?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We primarily serve Molalla and surrounding areas in Clackamas County, including Canby, Oregon City, Woodburn, and nearby communities."
          }
        },
        {
          "@type": "Question",
          "name": "Do you deliver trailers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! We offer delivery service throughout Molalla and surrounding areas in Clackamas County. Delivery fees depend on distance. You can also pick up the trailer at our location: 33250 S Wilhoit Rd, Molalla."
          }
        },
        {
          "@type": "Question",
          "name": "What can I haul in your dump trailers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our trailers are perfect for construction debris, yard waste, furniture, appliances, and general junk removal."
          }
        },
        {
          "@type": "Question",
          "name": "What is the weight capacity of your trailers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our Southland 6x12 trailer has an 8,745 lb capacity with a GVWR of 11,464 lbs, and our Southland 7x14 trailer has a 12,308 lb capacity with a GVWR of 15,432 lbs."
          }
        },
        {
          "@type": "Question",
          "name": "Is there a deposit required?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we require a $50 refundable security deposit for trailer rentals. The deposit is fully refunded when the trailer is returned in good condition."
          }
        },
        {
          "@type": "Question",
          "name": "How far in advance should I book?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We recommend booking as early as possible, especially during peak season (spring and summer). However, we often have same-day or next-day availability. Call us at 503-874-3705 to check current availability."
          }
        },
        {
          "@type": "Question",
          "name": "Do you offer junk removal services?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! We provide full-service junk removal where we handle all the loading and hauling for you. This is perfect for estate cleanouts, foreclosure cleanup, or any situation where you need us to do the heavy lifting."
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
