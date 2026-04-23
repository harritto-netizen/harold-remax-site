import { Home, Building2, Key, Search, Star, Calendar, TrendingUp, Play, MessageCircle, X, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import SchemaMarkup from './components/SchemaMarkup';
import PropertyAlertForm from './components/PropertyAlertForm';
import ExitIntentPopup from './components/ExitIntentPopup';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { getCurrentUser } from './lib/auth';
import { initTracking, trackContact, trackViewContent } from './lib/tracking';

type View = 'main' | 'admin-login' | 'admin-dashboard';

function App() {
  const [currentView, setCurrentView] = useState<View>('main');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [alertPrefill, setAlertPrefill] = useState<{ location: string; propertyType: string }>({ location: '', propertyType: '' });

  const scrollToAlerts = (location: string = '', propertyType: string = '') => {
    setAlertPrefill({ location, propertyType });
    const el = document.getElementById('property-alerts');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    checkAuth();
    initTracking();
  }, []);

  const checkAuth = async () => {
    const path = window.location.pathname;

    if (path === '/admin') {
      const user = await getCurrentUser();
      if (user) {
        setCurrentView('admin-dashboard');
      } else {
        setCurrentView('admin-login');
      }
    } else {
      setCurrentView('main');
    }

    setIsCheckingAuth(false);
  };

  const handleLoginSuccess = () => {
    setCurrentView('admin-dashboard');
    window.history.pushState({}, '', '/admin');
  };

  const handleLogout = () => {
    setCurrentView('admin-login');
    window.history.pushState({}, '', '/admin');
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <p className="font-lato text-cream">Loading...</p>
      </div>
    );
  }

  if (currentView === 'admin-login') {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentView === 'admin-dashboard') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-cream">
      <SchemaMarkup />
      {/* Header/Navigation */}
      <header className="bg-cream/95 backdrop-blur-sm border-b border-charcoal/10 fixed w-full top-0 z-50 transition-all duration-300">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <img
                src="/re_max_next_door_(4).png"
                alt="RE/MAX Next Door Logo"
                className="h-8 sm:h-10 w-auto"
                width="180"
                height="48"
              />
            </div>
            <div className="hidden lg:flex space-x-12">
              <a href="#inicio" className="text-charcoal text-sm uppercase tracking-widest hover:opacity-60 transition-opacity">Home</a>
              <a href="#servicios" className="text-charcoal text-sm uppercase tracking-widest hover:opacity-60 transition-opacity">Services</a>
              <a href="#propiedades" className="text-charcoal text-sm uppercase tracking-widest hover:opacity-60 transition-opacity">Properties</a>
              <a href="#testimonios" className="text-charcoal text-sm uppercase tracking-widest hover:opacity-60 transition-opacity">Testimonials</a>
              <a href="#blog" className="text-charcoal text-sm uppercase tracking-widest hover:opacity-60 transition-opacity">Blog</a>
            </div>
            <a
              href="https://wa.me/18094262269?text=Hello%20Harold,%20I'm%20interested%20in%20your%20real%20estate%20services"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContact('whatsapp_general')}
              className="border border-charcoal text-charcoal px-6 py-2 text-sm uppercase tracking-widest hover:bg-charcoal hover:text-cream transition-all duration-300"
            >
              Get In Touch
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section with Video Background */}
      <section id="inicio" className="relative pt-24 overflow-hidden min-h-screen flex items-center">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            aria-label="Background video showing luxury Caribbean beachfront properties"
          >
            <source src="/18335298-hd_1920_1080_24fps.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-charcoal/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h1 className="font-montserrat text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-cream uppercase tracking-wider leading-tight mb-8">
            Luxury Caribbean
            <span className="block mt-2">Real Estate</span>
          </h1>
          <p className="font-lato text-xl text-cream/90 mb-12 max-w-2xl mx-auto">
            Exclusive properties in Santo Domingo and Punta Cana
          </p>
          <a href="#propiedades" className="inline-block border-2 border-cream text-cream px-8 py-3 text-sm uppercase tracking-widest hover:bg-cream hover:text-charcoal transition-all duration-300">
            View Properties
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-24 md:py-32 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-montserrat text-4xl sm:text-5xl md:text-6xl font-light text-charcoal uppercase tracking-wider mb-6">
              Our Services
            </h2>
            <p className="font-lato text-lg text-charcoal/70 max-w-2xl mx-auto">
              Comprehensive real estate solutions for buyers, sellers, and investors
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="text-center">
              <Home className="w-12 h-12 text-charcoal mx-auto mb-6" />
              <h3 className="font-montserrat text-xl uppercase tracking-wider text-charcoal mb-4">Property Buying</h3>
              <p className="font-lato text-charcoal/70">
                Expert guidance through every step of the buying process, ensuring the best investment for your future.
              </p>
            </div>

            <div className="text-center">
              <Building2 className="w-12 h-12 text-charcoal mx-auto mb-6" />
              <h3 className="font-montserrat text-xl uppercase tracking-wider text-charcoal mb-4">Property Selling</h3>
              <p className="font-lato text-charcoal/70">
                Maximize your property value with effective marketing strategies and exposure to the right market.
              </p>
            </div>

            <div className="text-center">
              <Key className="w-12 h-12 text-charcoal mx-auto mb-6" />
              <h3 className="font-montserrat text-xl uppercase tracking-wider text-charcoal mb-4">Property Rentals</h3>
              <p className="font-lato text-charcoal/70">
                Find the perfect tenant or ideal rental property with transparent and secure processes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section className="py-24 md:py-32 bg-beige-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src="/harold-portrait.jpg"
                alt="Harold - Certified Real Estate Agent RE/MAX Next Door in Santo Domingo"
                className="w-full h-auto object-cover"
                loading="lazy"
                width="600"
                height="800"
              />
            </div>
            <div className="space-y-8">
              <h2 className="font-montserrat text-4xl sm:text-5xl font-light text-charcoal uppercase tracking-wider leading-tight">
                About Harold
              </h2>
              <p className="font-lato text-lg text-charcoal/80 leading-relaxed">
                With over 15 years of experience in the Caribbean real estate market, I specialize in helping clients find their ideal properties in Santo Domingo and Punta Cana.
              </p>
              <p className="font-lato text-lg text-charcoal/80 leading-relaxed">
                My commitment is to provide personalized, transparent, and professional service at every stage of the process. Whether you're buying, selling, or renting, I work tirelessly to exceed your expectations.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div>
                  <p className="font-montserrat text-5xl font-light text-charcoal mb-2">500+</p>
                  <p className="font-lato text-sm text-charcoal/70 uppercase tracking-wider">Properties Sold</p>
                </div>
                <div>
                  <p className="font-montserrat text-5xl font-light text-charcoal mb-2">15+</p>
                  <p className="font-lato text-sm text-charcoal/70 uppercase tracking-wider">Years Experience</p>
                </div>
              </div>
              <a
                href="https://wa.me/18094262269?text=Hello%20Harold,%20I'm%20interested%20in%20your%20real%20estate%20services"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContact('whatsapp_hero')}
                className="inline-block border-2 border-charcoal text-charcoal px-8 py-3 text-sm uppercase tracking-widest hover:bg-charcoal hover:text-cream transition-all duration-300 mt-4"
              >
                Get In Touch
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Gallery */}
      <section id="propiedades" className="py-24 md:py-32 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-montserrat text-4xl sm:text-5xl md:text-6xl font-light text-charcoal uppercase tracking-wider mb-6">
              Featured Properties
            </h2>
            <p className="font-lato text-lg text-charcoal/70 max-w-2xl mx-auto">
              Discover exceptional properties in Santo Domingo and Punta Cana
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Luxury Villa in Punta Cana',
                price: '$850,000',
                beds: 5,
                baths: 4,
                sqft: '4,200',
                image: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1200',
                location: 'Punta Cana'
              },
              {
                title: 'GreenWood Apartment',
                price: '$260,000',
                beds: 1,
                baths: 1,
                sqft: '786',
                image: '/d-2574-1765469617-c45431a7-3384-488b-b949-0103dfb4aa72.png',
                location: 'Cap Cana'
              },
              {
                title: 'Villa Playa Nueva Romana',
                price: '$540,000',
                beds: 3,
                baths: 3,
                sqft: '4,521',
                image: '/laud-2.webp',
                location: 'Playa Nueva Romana'
              },
              {
                title: 'Luxury Home with Panoramic View',
                price: '$780,000',
                beds: 4,
                baths: 4,
                sqft: '3,800',
                image: '/2025-12-13_09_46_23-edificio_rentable_con_en_santo_domingo,_distrito_nacional,_republica_dominicana_.png',
                location: 'Santo Domingo'
              },
              {
                title: 'Tropical Villa in Punta Cana',
                price: '$950,000',
                beds: 5,
                baths: 4,
                sqft: '4,500',
                image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
                location: 'Punta Cana'
              },
              {
                title: 'Furnished Apartment in Bayahibe',
                price: '$145,000',
                beds: 1,
                baths: 1,
                sqft: '554',
                image: '/d-2392-1764611103-8d08280a-5912-4dc7-ab09-fc84088d5fcc.jpg',
                location: 'Bayahibe'
              }
            ].map((property, index) => (
              <div key={index} className="group hover-zoom overflow-hidden">
                <div className="relative h-80 overflow-hidden mb-4">
                  <img
                    src={property.image}
                    alt={`${property.title} - Property with ${property.beds} bedrooms and ${property.baths} bathrooms in ${property.location}`}
                    className="w-full h-full object-cover transition-transform duration-500"
                    loading="lazy"
                    width="400"
                    height="320"
                  />
                  <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/30 transition-colors duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="font-lato text-sm uppercase tracking-wider mb-2 opacity-90">{property.location}</p>
                    <h3 className="font-montserrat text-xl uppercase tracking-wide">{property.title}</h3>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="font-montserrat text-2xl font-light text-charcoal">{property.price}</p>
                  <div className="flex gap-6 font-lato text-sm text-charcoal/70">
                    <span>{property.beds} Beds</span>
                    <span>{property.baths} Baths</span>
                    <span>{property.sqft} ft²</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
                    <a
                      href={`https://wa.me/18094262269?text=Hello%20Harold,%20I'm%20interested%20in%20the%20${encodeURIComponent(property.title)}%20listed%20at%20${encodeURIComponent(property.price)}%20in%20${encodeURIComponent(property.location)}.%20Can%20you%20provide%20more%20details?`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        const numericPrice = Number(property.price.replace(/[^0-9]/g, '')) || undefined;
                        trackViewContent({ contentName: property.title, value: numericPrice });
                        trackContact('whatsapp_property');
                      }}
                      className="inline-block font-lato text-sm text-charcoal uppercase tracking-widest border-b border-charcoal hover:opacity-60 transition-opacity pb-1"
                    >
                      View Details
                    </a>
                    <button
                      type="button"
                      onClick={() => scrollToAlerts(property.location, '')}
                      className="inline-flex items-center gap-1.5 font-lato text-xs text-charcoal/70 uppercase tracking-wider hover:text-charcoal transition-colors"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      Alert me of similar in {property.location.split(',')[0]}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Alert Signup Section */}
      <section id="property-alerts" className="py-0 bg-cream scroll-mt-24">
        <div className="max-w-4xl mx-auto">
          <PropertyAlertForm initialLocation={alertPrefill.location} initialPropertyType={alertPrefill.propertyType} />
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonios" className="py-24 md:py-32 bg-beige-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-montserrat text-4xl sm:text-5xl md:text-6xl font-light text-charcoal uppercase tracking-wider mb-6">
              Client Testimonials
            </h2>
            <p className="font-lato text-lg text-charcoal/70 max-w-2xl mx-auto">
              What our clients say about working with us
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                name: 'María González',
                role: 'Home Buyer',
                text: 'Excellent service. He helped me find the perfect house for my family in record time. His market knowledge and attention to detail were impressive.',
              },
              {
                name: 'Carlos Rodríguez',
                role: 'Seller',
                text: 'I sold my property in less than a month and above the price I expected. His marketing strategy and negotiation skills are exceptional.',
              },
              {
                name: 'Ana Martínez',
                role: 'Investor',
                text: 'As an investor, I needed an agent who understood the market deeply. His analysis and recommendations were key to my success.',
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-cream p-8">
                <p className="font-lato text-charcoal/80 leading-relaxed mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-montserrat text-sm uppercase tracking-wider text-charcoal">{testimonial.name}</p>
                  <p className="font-lato text-xs text-charcoal/60 uppercase tracking-wider mt-1">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-24 md:py-32 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-montserrat text-4xl sm:text-5xl md:text-6xl font-light text-charcoal uppercase tracking-wider mb-6">
              Market Insights
            </h2>
            <p className="font-lato text-lg text-charcoal/70 max-w-2xl mx-auto">
              Latest news and trends in Caribbean real estate
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Buying Your First Home in Santo Domingo',
                date: 'March 15, 2025',
                excerpt: 'Essential tips for first-time buyers in the Dominican Republic real estate market.',
                image: '/2025-12-13_09_46_23-edificio_rentable_con_en_santo_domingo,_distrito_nacional,_republica_dominicana_.png',
              },
              {
                title: 'Preparing Your Property for Sale',
                date: 'March 10, 2025',
                excerpt: 'How to maximize your property value with strategic staging and marketing.',
                image: '/d-2392-1764611103-8d08280a-5912-4dc7-ab09-fc84088d5fcc.jpg',
              },
              {
                title: 'Caribbean Real Estate Trends 2025',
                date: 'March 5, 2025',
                excerpt: 'Market analysis and predictions for luxury properties in the Caribbean.',
                image: '/d-2574-1765469617-c45431a7-3384-488b-b949-0103dfb4aa72.png',
              },
            ].map((post, index) => (
              <article key={index} className="group">
                <div className="h-64 overflow-hidden mb-4">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <p className="font-lato text-xs text-charcoal/50 uppercase tracking-wider mb-2">{post.date}</p>
                <h3 className="font-montserrat text-xl uppercase tracking-wide text-charcoal mb-3 group-hover:opacity-60 transition-opacity">
                  {post.title}
                </h3>
                <p className="font-lato text-charcoal/70 mb-4">
                  {post.excerpt}
                </p>
                <a
                  href="#blog"
                  className="inline-block font-lato text-sm text-charcoal uppercase tracking-widest border-b border-charcoal hover:opacity-60 transition-opacity pb-1"
                >
                  Read More
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cream border-t border-charcoal/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex items-center space-x-3">
              <img
                src="/re_max_next_door_(4).png"
                alt="RE/MAX Next Door Logo - Real Estate Dominican Republic"
                className="h-10 w-auto"
                loading="lazy"
                width="180"
                height="40"
              />
            </div>
            <div className="text-center md:text-right">
              <p className="font-lato text-sm text-charcoal/60">© 2025 RE/MAX Next Door. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setShowVideoModal(false)}>
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden shadow-2xl">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/6DD3ioZrsfs?autoplay=1&rel=0&modestbranding=1"
                title="Presentation video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-8 right-8 z-50">
        {showWhatsApp && (
          <div className="mb-4 bg-cream border border-charcoal/20 shadow-xl p-6 max-w-sm animate-fade-in">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-montserrat text-sm uppercase tracking-wider text-charcoal">Harold</h3>
                  <p className="font-lato text-xs text-charcoal/60">RE/MAX Agent</p>
                </div>
              </div>
              <button
                onClick={() => setShowWhatsApp(false)}
                className="text-charcoal/60 hover:text-charcoal transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="font-lato text-charcoal/70 mb-4 leading-relaxed">
              Send me a message on WhatsApp to discuss your property needs.
            </p>
            <a
              href="https://wa.me/18094262269?text=Hello%20Harold,%20I'm%20interested%20in%20your%20real%20estate%20services"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContact('whatsapp_floating')}
              className="block w-full bg-green-500 hover:bg-green-600 text-white font-lato text-sm uppercase tracking-wider py-3 px-4 transition-colors text-center"
            >
              Start Conversation
            </a>
          </div>
        )}
        <button
          onClick={() => setShowWhatsApp(!showWhatsApp)}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
          aria-label="Contact via WhatsApp"
        >
          {showWhatsApp ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </button>
      </div>
      <ExitIntentPopup />
    </div>
  );
}

export default App;
