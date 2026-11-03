import React, { useState } from 'react';
import { Logo } from './Logo';
import { Mail, Phone, MapPin, Check, ArrowRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenContactSales: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenContactSales }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer id="contact" className="w-full bg-white text-slate-600 pt-16 pb-12 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-100">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-4">
            <button
              onClick={() => onNavigate('home')}
              className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c69a68] rounded cursor-pointer"
            >
              <Logo isDark={true} />
            </button>
            <p className="mt-4 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm">
              Creating signature residential communities that blend contemporary architectural
              distinction, sustainable construction, and elevated modern living.
            </p>

            <div className="mt-6 flex flex-col space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#c69a68] shrink-0" />
                <span>400 Crescent Promenade, Suite 1200</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#c69a68] shrink-0" />
                <span>+1 (800) 555-0198 / +1 (212) 555-8390</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#c69a68] shrink-0" />
                <span>sales@crescentdevelopments.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Navigation
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-500">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('properties')}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Properties
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('properties')}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Developments
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContactSales}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Contact Sales
                </button>
              </li>
            </ul>
          </div>

          {/* Communities Column */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Communities
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-500">
              <li>
                <button
                  onClick={() => onNavigate('properties')}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Skyline Towers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('properties')}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Midtown Lofts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('properties')}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  The Shoreline
                </button>
              </li>
              <li>
                <span className="text-slate-400 text-[11px]">Belvedere Park (Upcoming)</span>
              </li>
              <li>
                <span className="text-slate-400 text-[11px]">The Grand Haven (Q3 2027)</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              VIP Private Previews
            </h4>
            <p className="mt-4 text-xs text-slate-500 leading-relaxed">
              Receive exclusive architectural portfolios, floor plan releases, and priority
              invitations to private residences before public market launches.
            </p>

            <form onSubmit={handleSubscribe} className="mt-4 flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#c69a68] flex-1"
              />
              <button
                type="submit"
                disabled={subscribed}
                className="px-4 py-2 bg-[#c69a68] hover:bg-[#b88c58] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
              >
                {subscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Joined</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </button>
            </form>
            {subscribed && (
              <p className="mt-2 text-[11px] text-emerald-600">
                Thank you! You have been added to our VIP preview registry.
              </p>
            )}
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© 2026 Crescent Developments. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-700 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-slate-700 transition-colors">
              Terms of Service
            </a>
            <a href="#equal-housing" className="hover:text-slate-700 transition-colors">
              Equal Housing Opportunity
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
