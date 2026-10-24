import { useEffect } from 'react';

export function ReviewSchema() {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Bare Acre Hauling",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "reviewCount": "150",
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Mike T."
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "reviewBody": "I've used several junk removal companies in the area, and Bare Acre Hauling is by far the best. They cleared my entire garage in a few hours. Great pricing, hard working crew, and top-notch service.",
          "datePublished": "2024-10-22"
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Robert K."
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "reviewBody": "Professional, reliable, and fairly priced. Used their junk removal service for an estate cleanout and they handled everything perfectly. Saved me so much time and hassle.",
          "datePublished": "2024-11-01"
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    script.id = 'review-schema';
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('review-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return null;
}
