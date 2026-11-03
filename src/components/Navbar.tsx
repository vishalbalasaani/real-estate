import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenContactSales: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenContactSales, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [activeNav, setActiveNav] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      // Threshold when the dark cinematic experiences (Exterior Hero + Interior Video) end and white content begins
      const tourElem = document.getElementById('interior-tour');
      if (tourElem) {
        const rect = tourElem.getBoundingClientRect();
        setIsScrolledPastHero(rect.bottom <= 70);
      } else {
        setIsScrolledPastHero(window.scrollY > window.innerHeight * 4);
      }

      // Detect active section on scroll
      const sections = [
        { id: 'contact', target: 'contact' },
        { id: 'about', target: 'about' },
        { id: 'properties', target: 'properties' },
        { id: 'hero', target: 'home' },
      ];

      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom >= 100) {
            setActiveNav(sec.target);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', target: 'home' },
    { label: 'Properties', target: 'properties' },
    { label: 'About Us', target: 'about' },
    { label: 'News', target: 'news' },
    { label: 'Contact', target: 'contact' },
  ];

  const handleLinkClick = (target: string) => {
    setActiveNav(target);
    onNavigate(target);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 py-3.5 sm:py-5 ${
        isScrolledPastHero
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Zone */}
          <button
            onClick={() => handleLinkClick('home')}
            className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c69a68] rounded transition-transform hover:opacity-90 cursor-pointer"
            aria-label="Crescent Developments Home"
          >
            <Logo isDark={isScrolledPastHero} />
          </button>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className={`hidden md:flex items-center gap-7 lg:gap-10 text-xs lg:text-sm font-medium tracking-wide transition-colors ${
              isScrolledPastHero
                ? 'text-slate-600'
                : 'text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]'
            }`}
          >
            {navItems.map((item) => {
              const isActive = activeNav === item.target;
              return (
                <button
                  key={item.label}
                  onClick={() => handleLinkClick(item.target)}
                  className={`relative py-1.5 transition-colors duration-200 cursor-pointer focus:outline-none group ${
                    isScrolledPastHero
                      ? isActive
                        ? 'text-slate-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                      : isActive
                      ? 'text-white font-semibold'
                      : 'text-white/85 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {/* Underline animated on hover & active on click */}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] transition-all duration-300 rounded-full ${
                      isScrolledPastHero ? 'bg-[#c69a68]' : 'bg-[#e3c29b]'
                    } ${
                      isActive
                        ? 'w-full opacity-100'
                        : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Right Action: Contact Sales */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onOpenContactSales}
              className={`px-4 lg:px-5 py-2 text-xs font-semibold tracking-wider rounded-md transition-all duration-150 active:scale-98 cursor-pointer inline-flex items-center ${
                isScrolledPastHero
                  ? 'text-slate-800 border border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                  : 'text-white border border-white/60 hover:bg-white/20 hover:border-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)] backdrop-blur-xs'
              }`}
            >
              Contact Sales
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-md transition-colors ${
                isScrolledPastHero
                  ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  : 'text-white hover:bg-white/20'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-white/10 px-5 pt-3 pb-6 space-y-3 shadow-2xl text-white animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1 pt-2">
            {navItems.map((item) => {
              const isActive = activeNav === item.target;
              return (
                <button
                  key={item.label}
                  onClick={() => handleLinkClick(item.target)}
                  className={`text-left text-sm font-medium py-3 px-3 rounded-lg transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-white/10 text-[#e3c29b] font-semibold border-l-2 border-[#c69a68]'
                      : 'text-slate-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#c69a68]" />}
                </button>
              );
            })}
          </div>

          <div className="pt-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContactSales();
              }}
              className="w-full py-3 text-center text-xs font-semibold tracking-wider text-white rounded-md bg-[#c69a68] hover:bg-[#b88c58] transition-colors shadow-md"
            >
              Contact Sales
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
