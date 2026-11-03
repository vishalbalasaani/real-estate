import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onViewProperties: () => void;
  onRequestInfo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onViewProperties, onRequestInfo }) => {
  return (
    <section
      id="home"
      className="w-full pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
            <span>Modern Living</span>
            <br />
            <span>Starts Here.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-slate-600 max-w-lg leading-relaxed font-normal">
            Discover premium new residential communities designed for contemporary living
          </p>

          {/* Call to Actions */}
          <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            {/* View Properties */}
            <button
              onClick={onViewProperties}
              className="px-6 sm:px-7 py-3 text-xs sm:text-sm font-semibold text-white bg-[#c69a68] hover:bg-[#b88c58] active:bg-[#a97c48] rounded-md shadow-xs transition-all duration-200 cursor-pointer inline-flex items-center gap-2 group"
            >
              <span>View Properties</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Request Info */}
            <button
              onClick={onRequestInfo}
              className="px-6 sm:px-7 py-3 text-xs sm:text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-md transition-all duration-200 cursor-pointer"
            >
              Request Info
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
