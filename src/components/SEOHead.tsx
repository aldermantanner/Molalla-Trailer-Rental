import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SHARE_IMAGE = 'https://bareacrehauling.com/og-image.jpg';
const SHARE_IMAGE_ALT = 'Bare Acre Hauling logo for junk removal, debris removal, and demolition';
const SHARE_IMAGE_WIDTH = '1200';
const SHARE_IMAGE_HEIGHT = '630';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogImageAlt?: string;
  canonical?: string;
}

export function SEOHead({
  title = 'Bare Acre Hauling | Junk Removal Molalla OR | Veteran Owned | Clackamas County',
  description = 'Veteran-owned junk removal serving Molalla and Clackamas County, OR. Appliance removal, garage cleanouts, estate cleanouts, hoarder house cleanouts & more. Call 503-874-3705.',
  keywords = 'junk removal Molalla, appliance removal Oregon, garage cleanout Molalla, estate cleanout Clackamas County, hoarder house cleanout Oregon, debris removal Molalla, veteran owned junk removal',
  ogImage = SHARE_IMAGE,
  ogImageAlt = SHARE_IMAGE_ALT,
  canonical,
}: SEOHeadProps) {
  const location = useLocation();
  const fullUrl = `https://bareacrehauling.com${location.pathname}`;
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
    updateMetaTag('og:image:secure_url', ogImage, true);
    updateMetaTag('og:image:type', 'image/jpeg', true);
    updateMetaTag('og:image:width', SHARE_IMAGE_WIDTH, true);
    updateMetaTag('og:image:height', SHARE_IMAGE_HEIGHT, true);
    updateMetaTag('og:image:alt', ogImageAlt, true);
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', ogImage, true);
    updateMetaTag('twitter:image:alt', ogImageAlt, true);

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;
  }, [title, description, keywords, ogImage, ogImageAlt, fullUrl, canonicalUrl]);

  return null;
}
