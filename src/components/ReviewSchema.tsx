import { useEffect } from 'react';

export function ReviewSchema() {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Molalla Trailer Rentals",
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
            "name": "Sarah M."
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "reviewBody": "Outstanding service! The trailer was clean, the drop-off was right on time, and the whole process was seamless. As a veteran myself, I really appreciate supporting a fellow veteran-owned business. Will definitely use again!",
          "datePublished": "2024-11-15"
        },
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
          "reviewBody": "I've rented from several trailer companies in the area, and Molalla Trailer Rentals is by far the best. The 7x14 trailer handled my construction debris perfectly. Great pricing, excellent equipment, and top-notch service.",
          "datePublished": "2024-10-22"
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Jennifer L."
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "reviewBody": "Needed a trailer on short notice for yard cleanup. They delivered same day! The hydraulic dump feature made unloading so easy. Highly recommend for anyone in the Molalla or Canby area.",
          "datePublished": "2024-09-30"
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
