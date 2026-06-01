export default function SchemaMarkup() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": "https://primerealestatedr.com/#organization",
    "name": "RE/MAX Next Door",
    "url": "https://primerealestatedr.com",
    "logo": "https://primerealestatedr.com/re_max_next_door_(4).png",
    "image": "https://primerealestatedr.com/harold-portrait.jpg",
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
    "image": "https://primerealestatedr.com/harold-portrait.jpg",
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
    "image": "https://primerealestatedr.com/re_max_next_door_(4).png",
    "@id": "https://primerealestatedr.com",
    "url": "https://primerealestatedr.com",
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
    "url": "https://primerealestatedr.com"
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://primerealestatedr.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Properties",
        "item": "https://primerealestatedr.com/#propiedades"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Services",
        "item": "https://primerealestatedr.com/#servicios"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Testimonials",
        "item": "https://primerealestatedr.com/#testimonios"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Blog",
        "item": "https://primerealestatedr.com/#blog"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the process of buying property in the Dominican Republic as a foreigner?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Foreigners can freely purchase property in the Dominican Republic with the same rights as citizens. The process involves selecting a property, signing a promise of sale, conducting due diligence and title search, signing the final deed before a notary, and registering the title. The entire process typically takes 30-60 days. RE/MAX Next Door provides full guidance including legal referrals and bilingual support throughout the transaction."
        }
      },
      {
        "@type": "Question",
        "name": "What are the best areas to invest in real estate in the Dominican Republic?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The top areas for real estate investment include Punta Cana and Cap Cana for resort-style living and vacation rentals, Santo Domingo for urban apartments and commercial properties, Bayahibe for beachfront condos, and La Romana for luxury villas. Each area offers different investment returns depending on whether you seek rental income, capital appreciation, or personal use."
        }
      },
      {
        "@type": "Question",
        "name": "How much does it cost to buy a luxury property in Punta Cana?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Luxury properties in Punta Cana typically range from $200,000 for modern apartments and condos to over $2 million for beachfront villas. Cap Cana properties start around $250,000 for apartments and can exceed $5 million for premium estates. Closing costs average 3-5% of the purchase price, including transfer tax, legal fees, and registration."
        }
      },
      {
        "@type": "Question",
        "name": "What services does RE/MAX Next Door provide for property sellers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "RE/MAX Next Door provides comprehensive selling services including professional photography and virtual tours, strategic pricing based on market analysis, listing on international MLS and real estate portals, targeted digital marketing campaigns, qualified buyer screening, negotiation expertise, and full transaction management through closing. Our average time to sell is under 60 days."
        }
      },
      {
        "@type": "Question",
        "name": "Can I get a mortgage to buy property in the Dominican Republic?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, both local and international buyers can obtain financing in the Dominican Republic. Local banks offer mortgages with terms of 15-25 years at competitive rates. Foreign buyers may qualify for financing with a 30-40% down payment. Some developers also offer direct financing plans. RE/MAX Next Door can connect you with trusted banking partners for pre-approval."
        }
      },
      {
        "@type": "Question",
        "name": "What is the rental income potential for properties in Punta Cana and Santo Domingo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Vacation rentals in Punta Cana can generate 8-12% annual returns, with peak season occupancy rates of 80-90%. Santo Domingo long-term rentals typically yield 6-9% annually. Cap Cana luxury properties can achieve higher nightly rates during tourist season. RE/MAX Next Door provides rental management services and market data to help maximize your investment returns."
        }
      }
    ]
  };

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "RE/MAX Next Door",
    "@id": "https://primerealestatedr.com/#reviews",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "bestRating": "5",
      "ratingCount": "3",
      "reviewCount": "3"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "María González"
        },
        "datePublished": "2025-02-15",
        "reviewBody": "Excellent service. He helped me find the perfect house for my family in record time. His market knowledge and attention to detail were impressive.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Carlos Rodríguez"
        },
        "datePublished": "2025-01-20",
        "reviewBody": "I sold my property in less than a month and above the price I expected. His marketing strategy and negotiation skills are exceptional.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Ana Martínez"
        },
        "datePublished": "2024-12-10",
        "reviewBody": "As an investor, I needed an agent who understood the market deeply. His analysis and recommendations were key to my success.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      }
    ]
  };

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "RE/MAX Next Door Market Insights",
    "url": "https://primerealestatedr.com/#blog",
    "description": "Expert analysis on Dominican Republic real estate trends, investment opportunities, and market forecasts",
    "publisher": {
      "@type": "Organization",
      "name": "RE/MAX Next Door",
      "logo": {
        "@type": "ImageObject",
        "url": "https://primerealestatedr.com/re_max_next_door_(4).png"
      }
    },
    "blogPost": [
      {
        "@type": "BlogPosting",
        "headline": "Dominican Republic Real Estate Market Forecast 2026: Record Foreign Investment Drives Growth",
        "datePublished": "2026-05-28",
        "dateModified": "2026-05-28",
        "author": {
          "@type": "Person",
          "name": "Harold",
          "jobTitle": "Certified Real Estate Agent",
          "worksFor": { "@type": "Organization", "name": "RE/MAX Next Door" }
        },
        "description": "The DR real estate market is experiencing unprecedented growth in 2026 with foreign investment up 34% year-over-year. Punta Cana and Cap Cana lead with average property appreciation of 12-18% annually.",
        "image": "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
        "url": "https://primerealestatedr.com/#blog",
        "keywords": ["Dominican Republic real estate 2026", "Punta Cana investment", "Cap Cana property", "Caribbean real estate market", "foreign investment DR"]
      },
      {
        "@type": "BlogPosting",
        "headline": "Why Remote Workers Are Buying Homes in Punta Cana and Cap Cana in 2026",
        "datePublished": "2026-05-15",
        "dateModified": "2026-05-15",
        "author": {
          "@type": "Person",
          "name": "Harold",
          "jobTitle": "Certified Real Estate Agent",
          "worksFor": { "@type": "Organization", "name": "RE/MAX Next Door" }
        },
        "description": "The digital nomad visa program and fiber-optic infrastructure expansion are attracting remote professionals to purchase condos and villas in Punta Cana.",
        "image": "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg",
        "url": "https://primerealestatedr.com/#blog",
        "keywords": ["digital nomad Dominican Republic", "remote work Punta Cana", "buy home Cap Cana", "expat real estate DR", "work from home Caribbean"]
      },
      {
        "@type": "BlogPosting",
        "headline": "Santo Domingo Luxury Condo Boom: New Developments and Investment Returns",
        "datePublished": "2026-05-02",
        "dateModified": "2026-05-02",
        "author": {
          "@type": "Person",
          "name": "Harold",
          "jobTitle": "Certified Real Estate Agent",
          "worksFor": { "@type": "Organization", "name": "RE/MAX Next Door" }
        },
        "description": "Santo Domingo is experiencing a luxury condo construction boom along the Malecon and in Naco district. Pre-construction prices offer 20-30% savings compared to completed units.",
        "image": "https://images.pexels.com/photos/2476632/pexels-photo-2476632.jpeg",
        "url": "https://primerealestatedr.com/#blog",
        "keywords": ["Santo Domingo condos", "luxury apartments Dominican Republic", "Malecon real estate", "Naco district property", "pre-construction investment"]
      }
    ]
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
      image: "https://primerealestatedr.com/d-2574-1765469617-c45431a7-3384-488b-b949-0103dfb4aa72.png"
    },
    {
      name: "Villa Playa Nueva Romana",
      price: "540000",
      location: "Playa Nueva Romana",
      beds: 3,
      baths: 3,
      sqft: 4521,
      image: "https://primerealestatedr.com/laud-2.webp"
    }
  ];

  const propertiesSchema = properties.map((property) => ({
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.name,
    "image": property.image,
    "description": `Luxury property in ${property.location} with ${property.beds} bedrooms and ${property.baths} bathrooms`,
    "url": "https://primerealestatedr.com/#propiedades",
    "datePosted": "2025-01-01",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
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
