import { useEffect } from 'react';

export function LocalBusinessSchema() {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Bare Acre Hauling",
      "image": "https://bareacrehauling.com/IMG_1426.PNG",
      "@id": "https://bareacrehauling.com",
      "url": "https://bareacrehauling.com",
      "telephone": "+15038743705",
      "email": "BareAcreHauling@outlook.com",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
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
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      },
      "sameAs": [
        "https://www.facebook.com/molallatrailerrental"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+15038743705",
        "contactType": "customer service",
        "areaServed": "US",
        "availableLanguage": "English"
      },
      "areaServed": [
        { "@type": "City", "name": "Molalla" },
        { "@type": "City", "name": "Canby" },
        { "@type": "City", "name": "Oregon City" },
        { "@type": "City", "name": "Woodburn" },
        { "@type": "AdministrativeArea", "name": "Clackamas County" }
      ],
      "additionalType": "https://en.wikipedia.org/wiki/Veteran-owned_business",
      "description": "Veteran-owned junk removal company serving Molalla and Clackamas County, Oregon. Appliance removal, debris removal, garage cleanouts, estate cleanouts, hoarder house cleanouts, yard cleanup, and more.",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Junk Removal Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Appliance Removal",
              "description": "Removal of household appliances including refrigerators, washers, dryers, and stoves"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Full-Service Junk Removal",
              "description": "Complete junk removal where we handle all loading and hauling"
            },
            "priceSpecification": {
              "@type": "PriceSpecification",
              "price": "150",
              "priceCurrency": "USD",
              "unitText": "minimum"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Estate & House Cleanouts",
              "description": "Full property cleanouts for estates, foreclosures, and move-outs"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Hoarder House Cleanouts",
              "description": "Compassionate and discreet cleanout services for severely cluttered properties"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Debris Removal",
              "description": "Construction debris, remodel waste, and yard debris removal"
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
