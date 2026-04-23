export default function SchemaMarkup() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": "https://www.primerealestatedr.com/#organization",
    "name": "RE/MAX Next Door",
    "url": "https://www.primerealestatedr.com",
    "logo": "https://www.primerealestatedr.com/re_max_next_door_(4).png",
    "image": "https://www.primerealestatedr.com/harold-portrait.jpg",
    "description": "Certified RE/MAX real estate agent with 15+ years of experience in Santo Domingo and Punta Cana. Services for buying, selling, and renting luxury properties.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Plaza Cuadra Alameda, Prol. Av. 27 de Febrero 7",
      "addressLocality": "Santo Domingo",
      "addressRegion": "Distrito Nacional",
      "addressCountry": "DO"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "18.4861",
      "longitude": "-69.9312"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-809-426-2269",
      "contactType": "sales",
      "email": "harold@remaxnextdoor.com",
      "availableLanguage": ["es", "en"],
      "areaServed": ["DO", "Santo Domingo", "Punta Cana", "Cap Cana"]
    },
    "sameAs": [
      "https://www.facebook.com/remaxnextdoor",
      "https://www.instagram.com/remaxnextdoor"
    ],
    "priceRange": "$$$$",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "500",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Harold",
    "jobTitle": "Certified Real Estate Agent",
    "image": "https://www.primerealestatedr.com/harold-portrait.jpg",
    "telephone": "+1-809-426-2269",
    "email": "harold@remaxnextdoor.com",
    "worksFor": {
      "@type": "Organization",
      "name": "RE/MAX Next Door"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Santo Domingo",
      "addressRegion": "Distrito Nacional",
      "addressCountry": "DO"
    },
    "alumniOf": "Certified Real Estate Agent",
    "knowsAbout": ["Real Estate", "Property Sales", "Property Management", "Investment Properties"]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "RE/MAX Next Door",
    "image": "https://www.primerealestatedr.com/re_max_next_door_(4).png",
    "@id": "https://www.primerealestatedr.com",
    "url": "https://www.primerealestatedr.com",
    "telephone": "+1-809-426-2269",
    "priceRange": "$$$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Plaza Cuadra Alameda, Prol. Av. 27 de Febrero 7",
      "addressLocality": "Santo Domingo",
      "addressRegion": "Distrito Nacional",
      "postalCode": "10101",
      "addressCountry": "DO"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 18.4861,
      "longitude": -69.9312
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "10:00",
        "closes": "14:00"
      }
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "RE/MAX Next Door",
    "url": "https://www.primerealestatedr.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.primerealestatedr.com/?s={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Real Estate Services",
    "provider": {
      "@type": "RealEstateAgent",
      "name": "RE/MAX Next Door"
    },
    "areaServed": {
      "@type": "Country",
      "name": "República Dominicana"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Real Estate Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Property Buying",
            "description": "Personalized advice for buying residential and commercial properties"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Property Selling",
            "description": "Complete marketing and property sales service"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Property Rentals",
            "description": "Rental management and search for qualified tenants"
          }
        }
      ]
    }
  };

  const properties = [
    {
      name: "Luxury Villa in Punta Cana",
      price: "850000",
      location: "Punta Cana",
      beds: 5,
      baths: 4,
      sqft: 4200,
      image: "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg"
    },
    {
      name: "GreenWood Apartment",
      price: "260000",
      location: "Cap Cana",
      beds: 1,
      baths: 1,
      sqft: 786,
      image: "https://www.primerealestatedr.com/d-2574-1765469617-c45431a7-3384-488b-b949-0103dfb4aa72.png"
    },
    {
      name: "Villa Playa Nueva Romana",
      price: "540000",
      location: "Playa Nueva Romana",
      beds: 3,
      baths: 3,
      sqft: 4521,
      image: "https://www.primerealestatedr.com/laud-2.webp"
    }
  ];

  const propertiesSchema = properties.map((property, index) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `https://www.primerealestatedr.com/property/${index + 1}`,
    "name": property.name,
    "image": property.image,
    "description": `Luxury property in ${property.location} with ${property.beds} bedrooms and ${property.baths} bathrooms`,
    "offers": {
      "@type": "Offer",
      "url": `https://www.primerealestatedr.com/property/${index + 1}`,
      "priceCurrency": "USD",
      "price": property.price,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "RealEstateAgent",
        "name": "RE/MAX Next Door"
      }
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Bedrooms",
        "value": property.beds
      },
      {
        "@type": "PropertyValue",
        "name": "Bathrooms",
        "value": property.baths
      },
      {
        "@type": "PropertyValue",
        "name": "Area",
        "value": `${property.sqft} square feet`
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.location,
      "addressCountry": "DO"
    }
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {propertiesSchema.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
