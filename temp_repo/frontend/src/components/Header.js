import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Menu, X, ChevronDown } from 'lucide-react';

const Header = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const location = useLocation();
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
    setIsMobileServicesOpen(false);
  }, [location]);

  const handleServicesEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsServicesOpen(true);
  };

  const handleServicesLeave = () => {
    timeoutRef.current = setTimeout(() => setIsServicesOpen(false), 200);
  };

  const serviceSubLinks = [
    { path: '/services/personnel', label: t("Accompagnement personnel", "Personal Coaching") },
    { path: '/services/professionnel', label: t("Accompagnement professionnel", "Professional Coaching") },
    { path: '/services/parentalite', label: t("Accompagnement parentalit\u00e9", "Parenting Support") },
    { path: '/services/home-organising', label: "Home Organising" }
  ];

  const navLinks = [
    { path: '/', label: t("Accueil", "Home") },
    { path: '/qui-suis-je', label: t("Qui suis-je\u00a0?", "About Me") },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' }
  ];

  const isServicePage = location.pathname.startsWith('/services');

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'backdrop-blur-xl bg-white/95 shadow-lg shadow-[#CAF0F8]/20' : 'bg-white/90'
      } border-b border-[#CAF0F8]`}
      data-testid="main-header"
    >
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-2">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0 group" data-testid="logo-link">
            <img
              src="/sophie_logo.jpg"
              alt="Sophie Lamour - Coach de vie"
              className="h-12 md:h-14 w-auto object-contain"
              data-testid="header-logo"
            />
          </Link>

          {/* Desktop + Tablet Nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 xl:gap-5" data-testid="desktop-nav">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-${link.path}`}
                className={`text-xs lg:text-sm font-medium tracking-wide px-2 lg:px-3 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap ${
                  location.pathname === link.path
                    ? 'text-[#0077B6] bg-[#CAF0F8]/40'
                    : 'text-[#023E8A] hover:text-[#0077B6] hover:bg-[#CAF0F8]/30'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleServicesEnter}
              onMouseLeave={handleServicesLeave}
            >
              <button
                className={`flex items-center gap-1 text-xs lg:text-sm font-medium tracking-wide px-2 lg:px-3 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap ${
                  isServicePage
                    ? 'text-[#0077B6] bg-[#CAF0F8]/40'
                    : 'text-[#023E8A] hover:text-[#0077B6] hover:bg-[#CAF0F8]/30'
                }`}
                data-testid="nav-services-dropdown"
                onClick={() => setIsServicesOpen(!isServicesOpen)}
              >
                Services
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isServicesOpen && (
                <div
                  className="absolute top-full left-0 mt-1 w-64 bg-white rounded-2xl shadow-xl shadow-[#03045E]/8 border border-[#CAF0F8] py-2 z-50"
                  data-testid="services-dropdown-menu"
                  onMouseEnter={handleServicesEnter}
                  onMouseLeave={handleServicesLeave}
                >
                  <Link
                    to="/services"
                    className="block px-4 py-2.5 text-xs lg:text-sm font-semibold text-[#03045E] hover:bg-[#CAF0F8]/40 transition-colors border-b border-[#CAF0F8]/50 mx-2 rounded-lg"
                  >
                    {t("Tous les services", "All Services")}
                  </Link>
                  {serviceSubLinks.map((sub) => (
                    <Link
                      key={sub.path}
                      to={sub.path}
                      data-testid={`nav-sub-${sub.path}`}
                      className={`block px-4 py-2.5 text-xs lg:text-sm transition-colors mx-2 rounded-lg ${
                        location.pathname === sub.path
                          ? 'text-[#0077B6] bg-[#CAF0F8]/40 font-medium'
                          : 'text-[#023E8A] hover:text-[#0077B6] hover:bg-[#CAF0F8]/30'
                      }`}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLinks.slice(2).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-${link.path}`}
                className={`text-xs lg:text-sm font-medium tracking-wide px-2 lg:px-3 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap ${
                  location.pathname === link.path
                    ? 'text-[#0077B6] bg-[#CAF0F8]/40'
                    : 'text-[#023E8A] hover:text-[#0077B6] hover:bg-[#CAF0F8]/30'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleLanguage}
              className="text-xs font-medium tracking-wide px-2.5 py-1.5 rounded-lg bg-[#CAF0F8] hover:bg-[#ADE8F4] transition-colors"
              data-testid="language-toggle"
            >
              <span className={language === 'fr' ? 'text-[#0077B6] font-bold' : 'text-[#023E8A]'}>FR</span>
              {' / '}
              <span className={language === 'en' ? 'text-[#0077B6] font-bold' : 'text-[#023E8A]'}>EN</span>
            </button>

            <button
              className="md:hidden text-[#03045E] p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col space-y-1 border-t border-[#CAF0F8] pt-4" data-testid="mobile-menu">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-sm font-medium tracking-wide px-3 py-2.5 rounded-lg transition-colors ${
                  location.pathname === link.path
                    ? 'text-[#0077B6] bg-[#CAF0F8]/40'
                    : 'text-[#023E8A] hover:bg-[#CAF0F8]/30'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div>
              <button
                onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                className={`w-full flex items-center justify-between text-sm font-medium tracking-wide px-3 py-2.5 rounded-lg transition-colors ${
                  isServicePage
                    ? 'text-[#0077B6] bg-[#CAF0F8]/40'
                    : 'text-[#023E8A] hover:bg-[#CAF0F8]/30'
                }`}
              >
                Services
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isMobileServicesOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isMobileServicesOpen && (
                <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-[#CAF0F8] pl-3">
                  <Link
                    to="/services"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-sm font-semibold text-[#03045E] px-3 py-2 rounded-lg hover:bg-[#CAF0F8]/30"
                  >
                    {t("Tous les services", "All Services")}
                  </Link>
                  {serviceSubLinks.map((sub) => (
                    <Link
                      key={sub.path}
                      to={sub.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block text-sm px-3 py-2 rounded-lg transition-colors ${
                        location.pathname === sub.path
                          ? 'text-[#0077B6] font-medium bg-[#CAF0F8]/40'
                          : 'text-[#023E8A] hover:bg-[#CAF0F8]/30'
                      }`}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLinks.slice(2).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-sm font-medium tracking-wide px-3 py-2.5 rounded-lg transition-colors ${
                  location.pathname === link.path
                    ? 'text-[#0077B6] bg-[#CAF0F8]/40'
                    : 'text-[#023E8A] hover:bg-[#CAF0F8]/30'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
