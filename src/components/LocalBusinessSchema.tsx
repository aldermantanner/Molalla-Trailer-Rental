import { useEffect } from 'react';

export function LocalBusinessSchema() {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Molalla Trailer Rentals",
      "image": "https://rentmolallatrailers.com/logo Offical.JPG",
      "@id": "https://rentmolallatrailers.com",
      "url": "https://rentmolallatrailers.com",
      "telephone": "+15035006121",
      "email": "Molallatrailerrental@outlook.com",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "33250 S Wilhoit Rd",
        "addressLocality": "Molalla",
        "addressRegion": "OR",
        "postalCode": "97038",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 45.146,
        "longitude": -122.579
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      },
      "sameAs": [
        "https://rentmolallatrailers.com"
      ],
      "areaServed": [
        {
          "@type": "City",
          "name": "Molalla"
        },
        {
          "@type": "City",
          "name": "Canby"
        },
        {
          "@type": "City",
          "name": "Oregon City"
        },
        {
          "@type": "City",
          "name": "Woodburn"
        },
        {
          "@type": "AdministrativeArea",
          "name": "Clackamas County"
        }
      ],
      "additionalType": "https://en.wikipedia.org/wiki/Veteran-owned_business",
      "description": "Veteran-owned dump trailer rental and junk removal service serving Molalla and surrounding areas. Professional dump trailers, material delivery, and complete junk removal services.",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Trailer Rental Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Dump Trailer Rental",
              "description": "Professional-grade dump trailers for daily, weekly, or monthly rental"
            },
            "priceSpecification": {
              "@type": "PriceSpecification",
              "price": "120",
              "priceCurrency": "USD",
              "unitText": "per day"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Junk Removal Service",
              "description": "Full-service junk removal for residential and commercial properties"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Material Delivery",
              "description": "Dirt, gravel, and mulch delivery for landscaping and construction"
            }
          }
        ]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "reviewCount": "150"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
}
