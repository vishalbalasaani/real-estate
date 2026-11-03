import React from 'react';

interface LogoProps {
  className?: string;
  isDark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', isDark = false }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Stylized Crescent Icon */}
      <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer elegant crescent moon arc */}
          <path
            d="M 50 10 A 40 40 0 1 0 50 90 A 28 36 0 0 1 50 10 Z"
            fill="url(#crescentGold)"
          />
          {/* Subtle inner accent glow/orb */}
          <circle cx="50" cy="50" r="10" fill="url(#crescentInner)" opacity="0.9" />
          <defs>
            <linearGradient id="crescentGold" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#e3c29b" />
              <stop offset="0.5" stopColor="#c69a68" />
              <stop offset="1" stopColor="#966d3b" />
            </linearGradient>
            <linearGradient id="crescentInner" x1="40" y1="40" x2="60" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f3deb8" />
              <stop offset="1" stopColor="#b88c58" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <span
          className={`text-lg sm:text-xl font-bold tracking-[0.16em] uppercase leading-none font-sans ${
            isDark ? 'text-slate-900' : 'text-white'
          }`}
        >
          Crescent
        </span>
        <span
          className={`text-[9px] sm:text-[10px] tracking-[0.28em] uppercase font-semibold mt-1 leading-none ${
            isDark ? 'text-slate-500' : 'text-slate-300'
          }`}
        >
          Developments
        </span>
      </div>
    </div>
  );
};
