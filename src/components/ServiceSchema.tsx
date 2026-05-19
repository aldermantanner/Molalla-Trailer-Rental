import { useEffect } from 'react';

export function ServiceSchema() {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": "https://bareacrehauling.com/#service",
      "serviceType": "Junk Removal",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Bare Acre Hauling",
        "telephone": "+15038743705",
        "email": "BareAcreHauling@outlook.com",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Molalla",
          "addressRegion": "OR",
          "postalCode": "97038",
          "addressCountry": "US"
        }
      },
      "areaServed": [
        { "@type": "City", "name": "Molalla", "containedInPlace": { "@type": "State", "name": "Oregon" } },
        { "@type": "City", "name": "Canby", "containedInPlace": { "@type": "State", "name": "Oregon" } },
        { "@type": "City", "name": "Oregon City", "containedInPlace": { "@type": "State", "name": "Oregon" } },
        { "@type": "City", "name": "Woodburn", "containedInPlace": { "@type": "State", "name": "Oregon" } },
        { "@type": "City", "name": "Silverton", "containedInPlace": { "@type": "State", "name": "Oregon" } },
        { "@type": "City", "name": "Estacada", "containedInPlace": { "@type": "State", "name": "Oregon" } }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Junk Removal Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Appliance Removal",
              "description": "Removal of household appliances including refrigerators, washers, dryers, stoves, and dishwashers.",
              "serviceType": "Appliance Removal"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Full-Service Junk Removal",
              "description": "Complete junk removal where we handle all loading and hauling for residential and commercial properties.",
              "serviceType": "Junk Removal",
              "offers": {
                "@type": "AggregateOffer",
                "lowPrice": "150",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              }
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Estate & House Cleanouts",
              "description": "Full property cleanouts for estates, foreclosures, and move-outs.",
              "serviceType": "House Cleanout"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Hoarder House Cleanouts",
              "description": "Compassionate, discreet cleanout services for severely cluttered properties.",
              "serviceType": "Hoarder Cleanout"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Garage Cleanouts",
              "description": "Complete garage clearing including shelves, boxes, tools, and accumulated junk.",
              "serviceType": "Garage Cleanout"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Yard Cleanup & Debris Removal",
              "description": "Brush, branches, yard waste, and construction debris removal.",
              "serviceType": "Yard Cleanup"
            }
          }
        ]
      },
      "additionalProperty": [
        { "@type": "PropertyValue", "name": "Veteran Owned", "value": "true" },
        { "@type": "PropertyValue", "name": "Same Day Service", "value": "true" },
        { "@type": "PropertyValue", "name": "Licensed and Insured", "value": "true" }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    script.id = 'service-schema';
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('service-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return null;
}
