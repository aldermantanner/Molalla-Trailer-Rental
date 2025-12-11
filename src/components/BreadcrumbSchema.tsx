import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function BreadcrumbSchema() {
  const location = useLocation();

  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);

    const breadcrumbList = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://rentmolallatrailers.com/"
      }
    ];

    const pageNames: { [key: string]: string } = {
      'booking': 'Book Trailer Rental',
      'pricing': 'Pricing Calculator',
      'specifications': 'Trailer Specifications',
      'customer-portal': 'Customer Portal',
      'availability': 'Check Availability',
      'payment-success': 'Payment Success'
    };

    pathSegments.forEach((segment, index) => {
      const pageName = pageNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      const itemUrl = `https://rentmolallatrailers.com/${pathSegments.slice(0, index + 1).join('/')}`;

      breadcrumbList.push({
        "@type": "ListItem",
        "position": index + 2,
        "name": pageName,
        "item": itemUrl
      });
    });

    if (breadcrumbList.length > 1) {
      const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbList
      };

      const existingScript = document.getElementById('breadcrumb-schema');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      script.id = 'breadcrumb-schema';
      document.head.appendChild(script);
    }

    return () => {
      const existingScript = document.getElementById('breadcrumb-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [location.pathname]);

  return null;
}
