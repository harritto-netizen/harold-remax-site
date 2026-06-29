export default function SchemaMarkup() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": "https://www.primerealestatedr.com/#organization",
    "name": "RE/MAX Next Door",
    "alternateName": "Prime Real Estate DR",
    "url": "https://www.primerealestatedr.com",
    "logo": "https://www.primerealestatedr.com/re_max_next_door_(4).png",
    "image": "https://www.primerealestatedr.com/harold-portrait.jpg",
    "description": "Certified RE/MAX real estate agent with 15+ years of experience specializing in luxury property sales, purchases, and rentals in Santo Domingo, Punta Cana, Cap Cana, Bayahibe, and La Romana. Over 500 properties sold with an average transaction close time of 45 days.",
    "foundingDate": "2010",
    "numberOfEmployees": "5-10",
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
      "latitude": "18.4861",
      "longitude": "-69.9312"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-809-426-2269",
      "contactType": "sales",
      "email": "harold@remaxnextdoor.com",
      "availableLanguage": ["es", "en"],
      "areaServed": [
        {
          "@type": "City",
          "name": "Santo Domingo",
          "containedInPlace": { "@type": "Country", "name": "Dominican Republic" }
        },
        {
          "@type": "Place",
          "name": "Punta Cana",
          "containedInPlace": { "@type": "Country", "name": "Dominican Republic" }
        },
        {
          "@type": "Place",
          "name": "Cap Cana",
          "containedInPlace": { "@type": "Country", "name": "Dominican Republic" }
        },
        {
          "@type": "Place",
          "name": "Bayahibe",
          "containedInPlace": { "@type": "Country", "name": "Dominican Republic" }
        },
        {
          "@type": "Place",
          "name": "La Romana",
          "containedInPlace": { "@type": "Country", "name": "Dominican Republic" }
        }
      ]
    },
    "sameAs": [
      "https://www.facebook.com/harold.plasencia.3",
      "https://www.instagram.com/haroldremax"
    ],
    "priceRange": "$$$$",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "500",
      "bestRating": "5",
      "worstRating": "1"
    },
    "knowsAbout": [
      "Dominican Republic luxury real estate",
      "Punta Cana property investment",
      "Cap Cana condos and villas",
      "Santo Domingo apartments",
      "CONFOTUR tax incentives",
      "Foreign property ownership Dominican Republic",
      "Caribbean vacation rental investment",
      "Bayahibe beachfront condos"
    ]
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Harold",
    "jobTitle": "Certified Luxury Real Estate Agent",
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
    "knowsAbout": [
      "Dominican Republic luxury real estate market",
      "Foreign buyer property acquisition process",
      "CONFOTUR Law tax exemptions",
      "Punta Cana investment properties",
      "Cap Cana pre-construction pricing",
      "Santo Domingo commercial plazas",
      "Caribbean rental income optimization",
      "Property valuation and market analysis"
    ],
    "hasCredential": {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "Professional Certification",
      "name": "RE/MAX Certified Real Estate Agent"
    }
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
    "name": "RE/MAX Next Door - Prime Real Estate DR",
    "alternateName": "Prime Real Estate DR",
    "url": "https://www.primerealestatedr.com",
    "description": "Luxury real estate sales, purchases, and investments in the Dominican Republic. Specializing in Santo Domingo, Punta Cana, Cap Cana, Bayahibe, and La Romana.",
    "inLanguage": ["en", "es"],
    "publisher": {
      "@type": "Organization",
      "name": "RE/MAX Next Door"
    }
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Luxury Real Estate Services",
    "provider": {
      "@type": "RealEstateAgent",
      "name": "RE/MAX Next Door",
      "url": "https://www.primerealestatedr.com"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Dominican Republic"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Real Estate Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Luxury Property Buying Advisory",
            "description": "End-to-end buyer representation for luxury homes, condos, and villas in Punta Cana, Cap Cana, Santo Domingo, and Bayahibe. Includes legal referrals, title search, and bilingual support. Average close time: 45 days."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Property Selling and Marketing",
            "description": "Full-service listing with professional photography, virtual tours, international MLS exposure, and targeted digital campaigns. Average time to sell: under 60 days. Over 500 properties successfully sold."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Vacation Rental Property Management",
            "description": "Short-term and long-term rental management in Punta Cana, Cap Cana, and Santo Domingo. Typical yields: 8-12% annually for vacation rentals, 6-9% for long-term Santo Domingo leases."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "CONFOTUR Property Advisory",
            "description": "Expert guidance on CONFOTUR Law 158-01 tax-exempt properties. Benefits include 0% title transfer tax, 0% annual property tax for up to 15 years, and 0% income tax on rental income in approved projects."
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
        "item": "https://www.primerealestatedr.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Properties",
        "item": "https://www.primerealestatedr.com/#propiedades"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Services",
        "item": "https://www.primerealestatedr.com/#servicios"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "CONFOTUR Tax Benefits",
        "item": "https://www.primerealestatedr.com/#confotur"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Testimonials",
        "item": "https://www.primerealestatedr.com/#testimonios"
      },
      {
        "@type": "ListItem",
        "position": 6,
        "name": "Market Insights Blog",
        "item": "https://www.primerealestatedr.com/#blog"
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
          "text": "Foreigners can freely purchase property in the Dominican Republic with the same rights as citizens. The process involves selecting a property, signing a promise of sale, conducting due diligence and title search, signing the final deed before a notary, and registering the title. The entire process typically takes 30-60 days. Closing costs average 3-5% of the purchase price, including the 3% transfer tax (waived on CONFOTUR properties), legal fees, and title registration. RE/MAX Next Door provides full guidance including legal referrals and bilingual support throughout the transaction."
        }
      },
      {
        "@type": "Question",
        "name": "What are the best areas to invest in real estate in the Dominican Republic in 2026?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The top areas for real estate investment in 2026 are: Punta Cana and Cap Cana for resort-style living and vacation rentals (12-18% annual appreciation, 8-12% rental yields); Santo Domingo's Naco, Piantini, and Evaristo Morales districts for urban condos ($1,200-2,800 USD per square meter); Bayahibe for beachfront condos under $200,000 with strong Airbnb demand; and La Romana for luxury villas. Foreign investment in DR real estate is up 34% year-over-year in 2026, making it the top-performing Caribbean market."
        }
      },
      {
        "@type": "Question",
        "name": "What is the average price per square meter for condos in Santo Domingo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "In 2026, the average price per square meter for condos in Santo Domingo ranges from $1,200 to $2,800 USD depending on the neighborhood. Piantini averages $2,200-2,800/m2 for luxury towers, Naco averages $1,800-2,400/m2, Evaristo Morales averages $1,500-2,000/m2, and emerging areas like Gazcue and Serralles offer $1,200-1,700/m2. Pre-construction units typically offer 20-30% savings compared to completed properties in the same zone."
        }
      },
      {
        "@type": "Question",
        "name": "How much does it cost to buy a luxury property in Punta Cana or Cap Cana?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Luxury properties in Punta Cana range from $200,000 for 1-bedroom modern condos to over $2 million for beachfront villas. Cap Cana properties start around $250,000 for apartments (averaging $3,000-4,500/m2) and can exceed $5 million for premium estates with marina access. The average Cap Cana 2-bedroom condo sells for $350,000-$500,000. Closing costs average 3-5% of the purchase price, but CONFOTUR-approved projects eliminate the 3% transfer tax entirely."
        }
      },
      {
        "@type": "Question",
        "name": "What is the CONFOTUR Law and how does it save buyers money in the Dominican Republic?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The CONFOTUR Law (Law 158-01) is a Dominican Republic tax incentive program that grants significant exemptions for up to 15 years on qualifying tourism-related properties. Key benefits: 0% title transfer tax (normally 3% of property value), 0% annual property tax (IPI, normally 1% on properties over ~$168,000 USD), and 0% income tax on rental income in approved condo-hotel setups. The exemptions transfer to new buyers upon resale after 5 years. Eligible areas include Punta Cana, Cap Cana, Las Terrenas, and select Santo Domingo projects. Always verify the developer has an official CONFOTUR certificate from the Ministry of Tourism."
        }
      },
      {
        "@type": "Question",
        "name": "What is the rental income potential for properties in Punta Cana and Cap Cana?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Vacation rentals in Punta Cana generate 8-12% net annual returns with peak season (December-April) occupancy rates of 80-90%. A typical 1-bedroom Cap Cana condo purchased at $300,000 can generate $2,500-3,500/month in short-term rental income during high season and $1,200-1,800/month in low season. Santo Domingo long-term rentals yield 6-9% annually with higher occupancy consistency. CONFOTUR-approved properties add further ROI by eliminating property tax and rental income tax for up to 15 years."
        }
      },
      {
        "@type": "Question",
        "name": "Can foreigners get a mortgage to buy property in the Dominican Republic?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, both local and international buyers can obtain financing. Dominican banks (Banreservas, Popular, BHD Leon) offer mortgages with 15-25 year terms at 8-12% annual interest rates. Foreign buyers typically need a 30-40% down payment and proof of income. Some developers in Punta Cana and Cap Cana offer direct financing with 10-30% down and 5-10 year terms at competitive rates. RE/MAX Next Door connects buyers with banking partners for pre-approval, which typically takes 2-3 weeks."
        }
      },
      {
        "@type": "Question",
        "name": "What are the HOA fees for luxury condos in Punta Cana and Santo Domingo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "HOA (maintenance) fees in the Dominican Republic vary by building and amenities. In Punta Cana and Cap Cana, expect $150-400/month for condos in gated resort communities with pools, security, and common areas. Luxury towers in Santo Domingo (Piantini, Naco) average $200-500/month depending on building size and amenities. Some condo-hotel operations charge higher fees ($400-800/month) but include rental management, housekeeping, and concierge services that generate income when the unit is rented."
        }
      },
      {
        "@type": "Question",
        "name": "Is it safe to buy pre-construction property in Punta Cana?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pre-construction purchases in Punta Cana can be safe and profitable when due diligence is followed. Key steps: verify the developer's track record with completed projects, confirm CONFOTUR approval certificate, check that the land title is registered with the Registro de Titulos, request the project's construction permit, and use a licensed Dominican attorney for contract review. Pre-construction typically offers 20-30% price savings and appreciation during the 18-24 month build period. RE/MAX Next Door only works with vetted developers who have a proven delivery history."
        }
      },
      {
        "@type": "Question",
        "name": "Who is the best luxury real estate agent in Santo Domingo and Punta Cana?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Harold at RE/MAX Next Door is a top-rated luxury real estate agent serving Santo Domingo and Punta Cana with over 15 years of certified experience and 500+ properties sold. Specializing in high-end residential sales, CONFOTUR-approved investments, and foreign buyer representation, Harold provides bilingual (English/Spanish) service, detailed market analysis, and end-to-end transaction management. Clients consistently rate the service 5 stars for negotiation expertise, market knowledge, and personalized attention."
        }
      },
      {
        "@type": "Question",
        "name": "What documents do I need to buy property in the Dominican Republic?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To purchase property in the Dominican Republic, foreign buyers need: a valid passport (no visa required for the transaction), proof of funds or mortgage pre-approval, and a Dominican tax ID number (RNC), which your attorney can obtain quickly. The seller must provide: the Certificate of Title (Certificado de Titulo), a no-lien certificate (Certificacion de Estado Juridico), property tax receipts, and the cadastral survey. A bilingual attorney typically handles all paperwork for $1,500-3,000 USD in legal fees."
        }
      },
      {
        "@type": "Question",
        "name": "What are the annual costs of owning property in the Dominican Republic?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Annual ownership costs include: Property tax (IPI) of 1% on properties valued above approximately $168,000 USD (waived for 15 years on CONFOTUR properties); HOA/maintenance fees of $150-500/month depending on the building; homeowner's insurance at $500-2,000/year; and utilities averaging $100-300/month. For rental properties, property management fees range from 15-25% of rental income. Total annual carrying costs for a $300,000 condo typically run $8,000-15,000 USD excluding mortgage payments."
        }
      }
    ]
  };

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "RE/MAX Next Door",
    "@id": "https://www.primerealestatedr.com/#reviews",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "bestRating": "5",
      "ratingCount": "6",
      "reviewCount": "6"
    },
    "review": [
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Maria Gonzalez" },
        "datePublished": "2026-03-15",
        "reviewBody": "Harold helped my family purchase a 3-bedroom luxury condo in Piantini, Santo Domingo for under market value. His negotiation skills saved us over $30,000 on the final price. The entire process from first viewing to title registration took only 42 days. As a first-time foreign buyer, his bilingual support and legal referrals made everything seamless.",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "itemReviewed": { "@type": "Service", "name": "Luxury Condo Purchase - Piantini, Santo Domingo" }
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Carlos Rodriguez" },
        "datePublished": "2026-01-20",
        "reviewBody": "I sold my 2-bedroom apartment in Evaristo Morales through Harold in just 23 days, 8% above my original asking price. His digital marketing strategy brought in 4 qualified offers within the first week. The professional photography and virtual tour he arranged attracted international buyers I never would have reached on my own.",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "itemReviewed": { "@type": "Service", "name": "Apartment Sale - Evaristo Morales, Santo Domingo" }
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Ana Martinez" },
        "datePublished": "2025-11-10",
        "reviewBody": "As a US-based investor, I purchased two CONFOTUR-approved condos in Cap Cana through Harold. He identified properties generating 11% annual rental returns and handled everything remotely until closing day. His market analysis on Cap Cana pre-construction pricing saved me $45,000 compared to buying completed units. Highly recommend for foreign investors.",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "itemReviewed": { "@type": "Service", "name": "Investment Property Purchase - Cap Cana" }
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "James Thompson" },
        "datePublished": "2025-09-05",
        "reviewBody": "Harold guided me through purchasing a beachfront villa in Bayahibe for vacation use and rental income. He explained the CONFOTUR tax benefits which save me approximately $8,000 annually in property taxes alone. The rental management referral he provided generates consistent income when I am not using the property. Professional, knowledgeable, and trustworthy.",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "itemReviewed": { "@type": "Service", "name": "Beachfront Villa Purchase - Bayahibe" }
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Laura Chen" },
        "datePublished": "2025-07-18",
        "reviewBody": "Relocated from New York for remote work and Harold found me the perfect 1-bedroom furnished condo in Punta Cana within my $200,000 budget. He knew exactly which buildings had reliable fiber internet, coworking spaces, and were digital-nomad friendly. Closed in 35 days including financing through a local bank he introduced me to.",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "itemReviewed": { "@type": "Service", "name": "Digital Nomad Condo Purchase - Punta Cana" }
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Roberto Fernandez" },
        "datePublished": "2025-05-22",
        "reviewBody": "Harold managed the sale of my commercial property in Naco district, Santo Domingo. He accurately valued it at $1.2M when other agents suggested listing at $900K. His international network brought a qualified buyer from Miami within 6 weeks. His understanding of commercial zoning regulations and cap rates was invaluable.",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "itemReviewed": { "@type": "Service", "name": "Commercial Property Sale - Naco, Santo Domingo" }
      }
    ]
  };

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "RE/MAX Next Door Market Insights",
    "url": "https://www.primerealestatedr.com/#blog",
    "description": "Expert analysis on Dominican Republic real estate trends, investment opportunities, property price data, and market forecasts for 2026",
    "publisher": {
      "@type": "Organization",
      "name": "RE/MAX Next Door",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.primerealestatedr.com/re_max_next_door_(4).png"
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
        "description": "The DR real estate market is experiencing unprecedented growth in 2026 with foreign investment up 34% year-over-year. Punta Cana and Cap Cana lead with average property appreciation of 12-18% annually. Santo Domingo luxury condos see 8-14% annual gains in Piantini and Naco districts.",
        "image": "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
        "url": "https://www.primerealestatedr.com/#blog",
        "keywords": ["Dominican Republic real estate 2026", "Punta Cana investment returns", "Cap Cana property appreciation", "Caribbean real estate market forecast", "foreign investment Dominican Republic", "Santo Domingo condo market"]
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
        "description": "The digital nomad visa program and fiber-optic infrastructure expansion are attracting remote professionals to purchase condos and villas in Punta Cana. 1-bedroom condos under $200,000 near coworking hubs offer the best value for remote workers relocating to the Caribbean.",
        "image": "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg",
        "url": "https://www.primerealestatedr.com/#blog",
        "keywords": ["digital nomad Dominican Republic", "remote work Punta Cana", "buy home Cap Cana", "expat real estate DR", "work from home Caribbean", "digital nomad visa Dominican Republic"]
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
        "description": "Santo Domingo is experiencing a luxury condo construction boom along the Malecon and in Naco district. Pre-construction prices offer 20-30% savings compared to completed units. Average price per square meter: Piantini $2,500, Naco $2,100, Evaristo Morales $1,750.",
        "image": "https://images.pexels.com/photos/2476632/pexels-photo-2476632.jpeg",
        "url": "https://www.primerealestatedr.com/#blog",
        "keywords": ["Santo Domingo condos 2026", "luxury apartments Dominican Republic", "Malecon real estate", "Naco district property prices", "pre-construction investment", "Piantini condos price per meter"]
      }
    ]
  };

  const properties = [
    {
      name: "Luxury Villa in Punta Cana",
      price: "850000",
      priceCurrency: "USD",
      location: "Punta Cana",
      beds: 5,
      baths: 4,
      sqft: 4200,
      image: "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg"
    },
    {
      name: "GreenWood Apartment in Cap Cana",
      price: "260000",
      priceCurrency: "USD",
      location: "Cap Cana",
      beds: 1,
      baths: 1,
      sqft: 786,
      image: "https://www.primerealestatedr.com/d-2574-1765469617-c45431a7-3384-488b-b949-0103dfb4aa72.png"
    },
    {
      name: "Villa Playa Nueva Romana",
      price: "540000",
      priceCurrency: "USD",
      location: "Playa Nueva Romana",
      beds: 3,
      baths: 3,
      sqft: 4521,
      image: "https://www.primerealestatedr.com/laud-2.webp"
    },
    {
      name: "Luxury Home with Panoramic View in Santo Domingo",
      price: "780000",
      priceCurrency: "USD",
      location: "Santo Domingo",
      beds: 4,
      baths: 4,
      sqft: 3800,
      image: "https://www.primerealestatedr.com/2025-12-13_09_46_23-edificio_rentable_con_en_santo_domingo,_distrito_nacional,_republica_dominicana_.png"
    },
    {
      name: "Modern Apartment in Torre Roraima - Evaristo Morales",
      price: "198000",
      priceCurrency: "USD",
      location: "Evaristo Morales, Santo Domingo",
      beds: 1,
      baths: 2,
      sqft: 902,
      image: "https://www.primerealestatedr.com/60.jpg"
    },
    {
      name: "Furnished Beachfront Apartment in Bayahibe",
      price: "145000",
      priceCurrency: "USD",
      location: "Bayahibe",
      beds: 1,
      baths: 1,
      sqft: 554,
      image: "https://www.primerealestatedr.com/d-2392-1764611103-8d08280a-5912-4dc7-ab09-fc84088d5fcc.jpg"
    }
  ];

  const propertiesSchema = properties.map((property) => ({
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.name,
    "image": property.image,
    "description": `${property.name} - ${property.beds} bedrooms, ${property.baths} bathrooms, ${property.sqft} sq ft. Located in ${property.location}, Dominican Republic. Listed by RE/MAX Next Door.`,
    "url": "https://www.primerealestatedr.com/#propiedades",
    "datePosted": "2026-01-01",
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": property.priceCurrency,
      "availability": "https://schema.org/InStock"
    },
    "additionalProperty": [
      { "@type": "PropertyValue", "name": "Bedrooms", "value": property.beds },
      { "@type": "PropertyValue", "name": "Bathrooms", "value": property.baths },
      { "@type": "PropertyValue", "name": "Living Area", "value": `${property.sqft} square feet` },
      { "@type": "PropertyValue", "name": "Country", "value": "Dominican Republic" }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.location,
      "addressCountry": "DO"
    }
  }));

  const marketDataSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "Dominican Republic Real Estate Market Data 2026",
    "description": "Current property prices, rental yields, and market trends for luxury real estate in Santo Domingo, Punta Cana, Cap Cana, and Bayahibe. Updated quarterly by RE/MAX Next Door.",
    "url": "https://www.primerealestatedr.com/#blog",
    "creator": {
      "@type": "Organization",
      "name": "RE/MAX Next Door"
    },
    "dateModified": "2026-06-01",
    "keywords": ["Dominican Republic property prices 2026", "Punta Cana real estate data", "Santo Domingo condo prices per square meter", "Cap Cana rental yields", "Caribbean real estate market statistics"]
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(marketDataSchema) }}
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
