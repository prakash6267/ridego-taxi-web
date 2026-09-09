import React, { useEffect } from 'react';

const SEO = ({
  title = "RideGo | Premium Commercial Taxi & Cab Booking Service",
  description = "Book premium commercial taxis, outstation cabs, and airport transfers with real-time distance calculation and transparent per-km rates. 24x7 support at +91 62672 28958.",
  canonicalUrl = window.location.href,
  schemaType = "TaxiService"
}) => {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // 2. Update or Create Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 3. OpenGraph Tags
    const ogTags = {
      'og:title': title,
      'og:description': description,
      'og:url': canonicalUrl,
      'og:type': 'website',
      'og:site_name': 'RideGo Commercial Cabs',
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // 4. JSON-LD Structured Data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": schemaType,
      "name": "RideGo Commercial Cabs",
      "url": "https://ridego.example.com",
      "logo": "https://ridego.example.com/logo.png",
      "telephone": "+91-6267228958",
      "priceRange": "₹10 - ₹20 / km",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Indore",
        "addressRegion": "Madhya Pradesh",
        "postalCode": "452001",
        "addressCountry": "IN"
      },
      "areaServed": ["Indore", "Ujjain", "Bhopal", "Omkareshwar", "Central India"],
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      }
    };

    let scriptTag = document.getElementById('json-ld-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'json-ld-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

  }, [title, description, canonicalUrl, schemaType]);

  return null;
};

export default SEO;
