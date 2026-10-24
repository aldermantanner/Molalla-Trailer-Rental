import { useEffect } from 'react';

export function ReviewSchema() {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Bare Acre Hauling",
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Alex M."
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "reviewBody": "Quick, efficient service made junk removal easy. Their top-notch customer service is highly recommended!"
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
