import { useState, useEffect } from 'react';
import { Truck, CheckCircle, Shield, Phone, Mail, MapPin, Star, Calendar, Menu, X, Lock, LogOut } from 'lucide-react';
import { BookingForm } from './components/BookingForm';
import { AdminBookings } from './components/AdminBookings';
import { AdminLogin } from './components/AdminLogin';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Gallery } from './components/Gallery';
import { TrailerSpecs } from './components/TrailerSpecs';
import { ServiceArea } from './components/ServiceArea';
import { PricingCalculator } from './components/PricingCalculator';
import { AvailabilityCalendar } from './components/AvailabilityCalendar';
import { CustomerPortal } from './components/CustomerPortal';
import { ChatWidget } from './components/ChatWidget';
import { AdCampaign } from './components/AdCampaign';
import { PaymentSuccess } from './components/PaymentSuccess';
import { supabase } from './lib/supabase';

type View = 'home' | 'booking' | 'admin' | 'portal' | 'ad' | 'success';

function App() {
  console.log('🏠 App component rendered');
  const [currentView, setCurrentView] = useState<View>('home');
  console.log('📍 Current view:', currentView);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();

    const params = new URLSearchParams(window.location.search);
    if (params.get('session_id')) {
      setCurrentView('success');
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setCurrentView('home');
  };

  if (currentView === 'ad') {
    return <AdCampaign onBookNow={() => {
      console.log('📱 Book Now clicked from ad');
      setCurrentView('booking');
      console.log('✅ View set to booking');
    }} />;
  }

  if (currentView === 'success') {
    return <PaymentSuccess />;
  }

  if (currentView === 'booking') {
    console.log('📝 Rendering booking view');
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-slate-800 shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <button onClick={() => setCurrentView('home')} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <img src="/logo Offical.JPG" alt="Molalla Trailer Rentals" className="h-14 w-14 rounded-full object-cover" />
                <span className="text-2xl font-bold text-white">Molalla Trailer Rentals</span>
              </button>
              <button
                onClick={() => setCurrentView('home')}
                className="text-white hover:text-green-400 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </nav>
        </header>
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Book Your Service</h1>
            <p className="text-xl text-gray-600">Fill out the form below and we'll contact you to confirm</p>
          </div>
          <BookingForm />
        </div>
      </div>
    );
  }

  if (currentView === 'admin') {
    if (!isAuthenticated) {
      return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-slate-800 shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <button onClick={() => setCurrentView('home')} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <img src="/logo Offical.JPG" alt="Molalla Trailer Rentals" className="h-14 w-14 rounded-full object-cover" />
                <span className="text-2xl font-bold text-white">Molalla Trailer Rentals</span>
              </button>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentView('home')}
                  className="text-white hover:text-green-400 transition-colors"
                >
                  Back to Home
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </nav>
        </header>
        <AdminBookings />
      </div>
    );
  }

  if (currentView === 'portal') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-slate-800 shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <button onClick={() => setCurrentView('home')} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <img src="/logo Offical.JPG" alt="Molalla Trailer Rentals" className="h-14 w-14 rounded-full object-cover" />
                <span className="text-2xl font-bold text-white">Molalla Trailer Rentals</span>
              </button>
              <button
                onClick={() => setCurrentView('home')}
                className="text-white hover:text-green-400 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </nav>
        </header>
        <CustomerPortal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-slate-800 shadow-lg sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img src="/logo Offical.JPG" alt="Molalla Trailer Rentals" className="h-14 w-14 rounded-full object-cover" />
              <span className="text-2xl font-bold text-white">Molalla Trailer Rentals</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#services" className="text-gray-200 hover:text-green-400 transition-colors">Services</a>
              <a href="#reviews" className="text-gray-200 hover:text-green-400 transition-colors">Reviews</a>
              <a href="#faq" className="text-gray-200 hover:text-green-400 transition-colors">FAQ</a>
              <a href="#booking" onClick={(e) => { e.preventDefault(); setCurrentView('booking'); }} className="text-gray-200 hover:text-green-400 transition-colors">Book Now</a>
              <a href="#portal" onClick={(e) => { e.preventDefault(); setCurrentView('portal'); }} className="text-gray-200 hover:text-green-400 transition-colors">My Bookings</a>
              <a href="#about" className="text-gray-200 hover:text-green-400 transition-colors">About</a>
              <a href="#contact" className="text-gray-200 hover:text-green-400 transition-colors">Contact</a>
            </div>
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => setCurrentView('booking')}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Book Online
              </button>
              <a href="tel:503-500-6121" className="bg-slate-700 text-white px-6 py-2 rounded-lg hover:bg-slate-600 transition-colors font-semibold">
                Call Now
              </a>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2 hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-slate-700 pt-4">
              <div className="flex flex-col space-y-4">
                <a href="#services" onClick={() => setMobileMenuOpen(false)} className="text-gray-200 hover:text-green-400 transition-colors py-2">Services</a>
                <a href="#reviews" onClick={() => setMobileMenuOpen(false)} className="text-gray-200 hover:text-green-400 transition-colors py-2">Reviews</a>
                <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-gray-200 hover:text-green-400 transition-colors py-2">FAQ</a>
                <button onClick={() => { setCurrentView('booking'); setMobileMenuOpen(false); }} className="text-left text-gray-200 hover:text-green-400 transition-colors py-2">Book Now</button>
                <button onClick={() => { setCurrentView('portal'); setMobileMenuOpen(false); }} className="text-left text-gray-200 hover:text-green-400 transition-colors py-2">My Bookings</button>
                <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-gray-200 hover:text-green-400 transition-colors py-2">About</a>
                <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-gray-200 hover:text-green-400 transition-colors py-2">Contact</a>
                <div className="flex flex-col gap-2 pt-4 border-t border-slate-700">
                  <button
                    onClick={() => { setCurrentView('booking'); setMobileMenuOpen(false); }}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold text-center"
                  >
                    Book Online
                  </button>
                  <a href="tel:503-500-6121" className="bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-600 transition-colors font-semibold text-center">
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 font-semibold text-lg">Veteran Owned & Operated</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
                Dump Trailer Rentals & Junk Removal
              </h1>
              <p className="text-xl text-gray-200 mb-8">
                Professional dump trailer rentals and complete junk removal services serving Molalla and surrounding areas. Whether you're clearing out a property or hauling debris, we've got you covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setCurrentView('booking')}
                  className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors text-center shadow-lg flex items-center justify-center gap-2"
                >
                  <Calendar className="h-5 w-5" />
                  Book Online Now
                </button>
                <a href="tel:503-500-6121" className="bg-white text-slate-800 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors text-center shadow-lg flex items-center justify-center gap-2">
                  <Phone className="h-5 w-5" />
                  Call: 503-500-6121
                </a>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <img
                src="/image copy copy copy copy.png"
                alt="Dump trailer in action"
                className="rounded-lg shadow-2xl w-auto max-w-full h-auto max-h-96 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-slate-800 mb-16">Why Choose Us</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-xl transition-shadow bg-gray-50">
              <div className="inline-block p-4 bg-red-100 rounded-full mb-6">
                <Star className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Veteran Owned</h3>
              <p className="text-gray-600">
                Proudly veteran owned and operated with a commitment to excellence and integrity.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-xl transition-shadow bg-gray-50">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Reliable Equipment</h3>
              <p className="text-gray-600">
                Well-maintained dump trailers ready for your project. Clean, inspected, and dependable.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-xl transition-shadow bg-gray-50">
              <div className="inline-block p-4 bg-slate-100 rounded-full mb-6">
                <Truck className="h-10 w-10 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Delivery Available</h3>
              <p className="text-gray-600">
                Convenient delivery service available for your dump trailer rentals.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-xl transition-shadow bg-gray-50">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
                <Shield className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Local & Trusted</h3>
              <p className="text-gray-600">
                Serving Molalla and surrounding areas with honest pricing and reliable service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-slate-800 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            From dump trailer rentals to complete junk removal and material delivery, we provide the solutions you need for your projects in Molalla and surrounding areas.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img
                src="https://www.MyTrailer.Rentals/Portal/Images/000483/Trailers/1503/074c04195a9189533abdee75a5afdda9.jpg"
                alt="Dump trailer rental in action"
                className="w-full h-72 object-cover"
              />
              <div className="p-8">
                <h3 className="text-3xl font-semibold text-slate-800 mb-4">Dump Trailer Rentals</h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Heavy-duty dump trailers perfect for hauling debris, yard waste, construction materials, dirt, and more. Easy to load, easy to dump.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Professional-grade dump trailers</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Daily and weekly rental rates</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Delivery available</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Clean and well-maintained</span>
                  </li>
                </ul>
                <div className="text-green-600 font-bold text-2xl">Starting at $120/day</div>
                <p className="text-gray-600 mt-2">Delivery available</p>
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img
                src="/image.png"
                alt="Junk removal service with equipment"
                className="w-full h-72 object-cover"
              />
              <div className="p-8">
                <h3 className="text-3xl font-semibold text-slate-800 mb-4">Junk Removal Services</h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Full-service junk removal for homes, businesses, and properties. We handle everything from pickup to disposal.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">We load and haul everything</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Residential & commercial</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Construction debris removal</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Eco-friendly disposal</span>
                  </li>
                </ul>
                <div className="text-green-600 font-bold text-2xl">Call for Quote</div>
                <p className="text-gray-600 mt-2">503-500-6121</p>
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img
                src="/image copy copy copy copy copy.png"
                alt="Material delivery service"
                className="w-full h-72 object-cover"
              />
              <div className="p-8">
                <h3 className="text-3xl font-semibold text-slate-800 mb-4">Dirt, Gravel & Mulch Delivery</h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Professional delivery of rock, fill dirt, and premium mulch for your landscaping and construction projects.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">7 yards of rock: <strong>$350-$550</strong></span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">7 yards of fill dirt: <strong>$100</strong></span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">7 yards of mulch: <strong>$280-$445</strong></span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Delivery included</span>
                  </li>
                </ul>
                <div className="text-green-600 font-bold text-2xl">Starting at $100</div>
                <p className="text-gray-600 mt-2">Per 7 yards delivered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Book Your Trailer?</h2>
          <p className="text-xl mb-8 opacity-90">
            Book online in minutes or call us directly. We'll confirm your reservation and delivery details.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentView('booking')}
              className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <Calendar className="h-5 w-5" />
              Book Online Now
            </button>
            <a
              href="tel:503-500-6121"
              className="bg-slate-800 text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-slate-700 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <Phone className="h-5 w-5" />
              Call: 503-500-6121
            </a>
          </div>
        </div>
      </section>

      {/* Trailer Specifications */}
      <TrailerSpecs />

      {/* Availability Calendar */}
      <AvailabilityCalendar />

      {/* Photo Gallery */}
      <Gallery />

      {/* Pricing Calculator */}
      <PricingCalculator />

      {/* Service Area */}
      <ServiceArea />

      {/* Testimonials */}
      <div id="reviews">
        <Testimonials />
      </div>

      {/* FAQ */}
      <div id="faq">
        <FAQ />
      </div>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Star className="h-6 w-6 text-red-600 fill-red-600" />
                <span className="text-red-600 font-semibold text-xl">Veteran Owned & Operated</span>
              </div>
              <h2 className="text-4xl font-bold text-slate-800 mb-6">Serving Molalla & Surrounding Areas</h2>
              <p className="text-lg text-gray-600 mb-4">
                We're a veteran-owned and operated business specializing in dump trailer rentals and junk removal services for the Molalla community and surrounding areas.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                Whether you're tackling a home renovation, cleaning out a property, or managing a construction site, we provide the equipment and services you need to get the job done efficiently.
              </p>
              <p className="text-lg text-gray-600">
                Our mission is simple: deliver quality equipment, fair pricing, and exceptional customer service backed by the values of integrity and dedication that come with military service.
              </p>
            </div>
            <div>
              <img
                src="/logo Offical.JPG"
                alt="Molalla Trailer Rentals"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-700 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-12 opacity-90">
            Contact us today to rent a dump trailer or schedule junk removal service. Serving Molalla and surrounding areas!
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="flex items-start space-x-4">
              <Phone className="h-6 w-6 mt-1 flex-shrink-0 text-green-400" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Call or Text</h3>
                <a href="tel:503-500-6121" className="hover:text-green-400 transition-colors text-xl font-semibold">503-500-6121</a>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Mail className="h-6 w-6 mt-1 flex-shrink-0 text-green-400" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Email Us</h3>
                <a href="mailto:Molallatrailerrental@outlook.com" className="hover:text-green-400 transition-colors">Molallatrailerrental@outlook.com</a>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <MapPin className="h-6 w-6 mt-1 flex-shrink-0 text-green-400" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Service Area</h3>
                <p>Molalla, OR<br />& Surrounding Areas</p>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-600">
            <p className="text-lg font-semibold mb-4">Clackamas County & Surrounding Areas</p>
            <p className="text-2xl font-bold text-green-400 mb-2">Call or Text: 503-500-6121</p>
            <p className="opacity-90">Dump trailer rentals starting at $120/day with delivery available</p>
            <button
              onClick={() => setCurrentView('admin')}
              className="mt-8 text-xs text-gray-500 hover:text-gray-400 transition-colors flex items-center gap-1 mx-auto"
            >
              <Lock className="h-3 w-3" />
              Admin
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-gray-400 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img src="/logo Offical.JPG" alt="Molalla Trailer Rentals" className="h-8 w-8 rounded-full object-cover" />
            <span className="text-xl font-bold text-white">Molalla Trailer Rentals</span>
          </div>
          <p className="mb-2">Veteran Owned & Operated</p>
          <p>&copy; 2025 Molalla Trailer Rentals. All rights reserved.</p>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}

export default App;
