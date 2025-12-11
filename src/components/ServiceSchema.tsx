import { useEffect } from 'react';

export function ServiceSchema() {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": "https://rentmolallatrailers.com/#service",
      "serviceType": "Dump Trailer Rental and Junk Removal",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Molalla Trailer Rentals",
        "telephone": "+15035006121",
        "email": "Molallatrailerrental@outlook.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "33250 S Wilhoit Rd",
          "addressLocality": "Molalla",
          "addressRegion": "OR",
          "postalCode": "97038",
          "addressCountry": "US"
        }
      },
      "areaServed": [
        {
          "@type": "City",
          "name": "Molalla",
          "containedInPlace": {
            "@type": "State",
            "name": "Oregon"
          }
        },
        {
          "@type": "City",
          "name": "Canby",
          "containedInPlace": {
            "@type": "State",
            "name": "Oregon"
          }
        },
        {
          "@type": "City",
          "name": "Oregon City",
          "containedInPlace": {
            "@type": "State",
            "name": "Oregon"
          }
        },
        {
          "@type": "City",
          "name": "Woodburn",
          "containedInPlace": {
            "@type": "State",
            "name": "Oregon"
          }
        },
        {
          "@type": "City",
          "name": "Silverton",
          "containedInPlace": {
            "@type": "State",
            "name": "Oregon"
          }
        },
        {
          "@type": "City",
          "name": "Estacada",
          "containedInPlace": {
            "@type": "State",
            "name": "Oregon"
          }
        }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Trailer Rental and Junk Removal Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": "Southland 6x12 10k Dump Trailer Rental",
              "description": "6' x 12' dump trailer with 8,745 lb capacity. Perfect for residential projects, yard cleanup, and light construction debris.",
              "brand": {
                "@type": "Brand",
                "name": "Southland"
              },
              "model": "SL612-10K",
              "offers": {
                "@type": "AggregateOffer",
                "lowPrice": "120",
                "highPrice": "3000",
                "priceCurrency": "USD",
                "priceValidUntil": "2025-12-31",
                "availability": "https://schema.org/InStock"
              }
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": "Southland 7x14 14k Dump Trailer Rental",
              "description": "7' x 14' dump trailer with 12,308 lb capacity. Ideal for larger commercial and construction projects with maximum hauling capacity.",
              "brand": {
                "@type": "Brand",
                "name": "Southland"
              },
              "model": "SL714-14K",
              "offers": {
                "@type": "AggregateOffer",
                "lowPrice": "130",
                "highPrice": "3350",
                "priceCurrency": "USD",
                "priceValidUntil": "2025-12-31",
                "availability": "https://schema.org/InStock"
              }
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Junk Removal Service",
              "description": "Full-service junk removal for residential and commercial properties. We load and haul everything for you.",
              "serviceType": "Junk Removal"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Material Delivery Service",
              "description": "Professional delivery of dirt, gravel, rock, and mulch for landscaping and construction projects.",
              "serviceType": "Material Delivery"
            }
          }
        ]
      },
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Veteran Owned",
          "value": "true"
        },
        {
          "@type": "PropertyValue",
          "name": "Same Day Service",
          "value": "true"
        },
        {
          "@type": "PropertyValue",
          "name": "Licensed and Insured",
          "value": "true"
        }
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
