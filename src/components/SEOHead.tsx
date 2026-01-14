import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

export function SEOHead({
  title = 'Molalla Trailer Rentals | Dump Trailer Rental & Junk Removal | Clackamas County OR',
  description = 'Veteran-owned dump trailer rentals starting at $120/day. Serving Molalla, Canby, Oregon City & Clackamas County. Same-day delivery available. Book online or call 971-459-0077.',
  keywords = 'trailer rental Molalla, dump trailer rental Oregon, junk removal Molalla, dump trailer Canby, trailer rental Clackamas County, veteran owned trailer rental, dump trailer near me',
  ogImage = 'https://rentmolallatrailers.com/logo Offical.JPG',
  canonical,
}: SEOHeadProps) {
  const location = useLocation();
  const fullUrl = `https://rentmolallatrailers.com${location.pathname}`;
  const canonicalUrl = canonical || fullUrl;

  useEffect(() => {
    document.title = title;

    const updateMetaTag = (property: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:url', fullUrl, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', ogImage, true);

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;
  }, [title, description, keywords, ogImage, fullUrl, canonicalUrl]);

  return null;
}
