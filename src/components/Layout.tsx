import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X, Facebook, Lock, Mail, MapPin } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-slate-800 shadow-lg sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-6 lg:px-12 py-5">
          <div className="flex items-center justify-between gap-12">
            <div className="flex items-center gap-12">
              <Link
                to="/admin"
                onClick={() => window.scrollTo(0, 0)}
                className="hidden lg:flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <Lock className="h-4 w-4" />
                <span>Admin</span>
              </Link>

              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/';
                }}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
              >
                <img src="/logo Offical.JPG" alt="Molalla Trailer Rentals" className="h-12 w-12 rounded-full object-cover" />
                <span className="text-xl font-bold text-white whitespace-nowrap">Molalla Trailer Rentals</span>
              </a>
            </div>

            <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
              <a href="/#services" className="text-gray-200 hover:text-green-400 transition-colors font-medium">Services</a>
              <a href="/#reviews" className="text-gray-200 hover:text-green-400 transition-colors font-medium">Reviews</a>
              <Link to="/pricing" onClick={() => window.scrollTo(0, 0)} className="text-gray-200 hover:text-green-400 transition-colors font-medium">Pricing</Link>
              <Link to="/mybookings" onClick={() => window.scrollTo(0, 0)} className="text-gray-200 hover:text-green-400 transition-colors font-medium">My Bookings</Link>
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <a href="tel:503-500-6121" className="text-white hover:text-green-400 transition-colors font-semibold flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <span className="whitespace-nowrap">503-500-6121</span>
              </a>

              <Link
                to="/booking"
                onClick={() => window.scrollTo(0, 0)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all font-bold shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                Book Now
              </Link>

              <div className="relative">
                <button
                  onClick={() => setResourcesOpen(!resourcesOpen)}
                  onBlur={() => setTimeout(() => setResourcesOpen(false), 200)}
                  className="text-white hover:text-green-400 transition-colors p-2"
                  aria-label="Resources menu"
                >
                  <Menu className="h-6 w-6" />
                </button>
                {resourcesOpen && (
                  <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[220px] z-50">
                    <Link
                      to="/availability"
                      onClick={() => { setResourcesOpen(false); window.scrollTo(0, 0); }}
                      className="block px-4 py-3 text-slate-700 hover:bg-green-50 hover:text-green-600 transition-colors font-medium"
                    >
                      Availability Calendar
                    </Link>
                    <Link
                      to="/specifications"
                      onClick={() => { setResourcesOpen(false); window.scrollTo(0, 0); }}
                      className="block px-4 py-3 text-slate-700 hover:bg-green-50 hover:text-green-600 transition-colors font-medium"
                    >
                      Trailer Specifications
                    </Link>
                    <Link
                      to="/junk-removal-pricing"
                      onClick={() => { setResourcesOpen(false); window.scrollTo(0, 0); }}
                      className="block px-4 py-3 text-slate-700 hover:bg-green-50 hover:text-green-600 transition-colors font-medium"
                    >
                      Junk Removal Pricing
                    </Link>
                    <a
                      href="/#faq"
                      onClick={() => setResourcesOpen(false)}
                      className="block px-4 py-3 text-slate-700 hover:bg-green-50 hover:text-green-600 transition-colors font-medium"
                    >
                      FAQ
                    </a>
                    <a
                      href="/#contact"
                      onClick={() => setResourcesOpen(false)}
                      className="block px-4 py-3 text-slate-700 hover:bg-green-50 hover:text-green-600 transition-colors font-medium"
                    >
                      Contact
                    </a>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white p-2 hover:bg-slate-700 rounded-lg transition-colors ml-auto"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden mt-6 pb-4 border-t border-slate-700 pt-6">
              <div className="flex flex-col space-y-4">
                <Link
                  to="/admin"
                  onClick={() => { setMobileMenuOpen(false); window.scrollTo(0, 0); }}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors py-2 text-sm"
                >
                  <Lock className="h-4 w-4" />
                  Admin Portal
                </Link>
                <a href="/#services" onClick={() => setMobileMenuOpen(false)} className="text-gray-200 hover:text-green-400 transition-colors py-2 text-lg">Services</a>
                <a href="/#reviews" onClick={() => setMobileMenuOpen(false)} className="text-gray-200 hover:text-green-400 transition-colors py-2 text-lg">Reviews</a>
                <Link to="/pricing" onClick={() => { setMobileMenuOpen(false); window.scrollTo(0, 0); }} className="text-gray-200 hover:text-green-400 transition-colors py-2 text-lg">Pricing</Link>
                <Link to="/mybookings" onClick={() => { setMobileMenuOpen(false); window.scrollTo(0, 0); }} className="text-gray-200 hover:text-green-400 transition-colors py-2 text-lg">My Bookings</Link>

                <div className="flex flex-col gap-3 pt-6 border-t border-slate-700 mt-4">
                  <Link
                    to="/booking"
                    onClick={() => { setMobileMenuOpen(false); window.scrollTo(0, 0); }}
                    className="bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition-colors font-bold text-center text-lg shadow-lg"
                  >
                    Book Now
                  </Link>
                  <a href="tel:503-500-6121" className="bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-600 transition-colors font-bold text-center text-lg shadow-lg flex items-center justify-center gap-2">
                    <Phone className="h-5 w-5" />
                    503-500-6121
                  </a>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main>{children}</main>

      {isHomePage && (
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
            </div>
          </div>
        </section>
      )}

      <footer className="bg-slate-900 text-gray-400 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = '/';
            }}
            className="flex items-center justify-center space-x-2 mb-4 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <img src="/logo Offical.JPG" alt="Molalla Trailer Rentals" className="h-8 w-8 rounded-full object-cover" />
            <span className="text-xl font-bold text-white">Molalla Trailer Rentals</span>
          </a>
          <p className="mb-4">Veteran Owned & Operated</p>

          <div className="flex items-center justify-center gap-6 mb-6">
            <a
              href="https://www.facebook.com/molallatrailerrental"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Visit our Facebook page"
            >
              <Facebook className="h-6 w-6" />
              <span className="text-sm">Facebook</span>
            </a>
            <a
              href="https://www.tiktok.com/@molallatrailerrental"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Visit our TikTok page"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
              <span className="text-sm">TikTok</span>
            </a>
          </div>

          <p>&copy; 2025 Molalla Trailer Rentals. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
