import React from 'react';
import { CheckCircle2, Award, ArrowRight } from 'lucide-react';

interface AboutSectionProps {
  onLearnMore: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onLearnMore }) => {
  return (
    <section id="about" className="py-20 sm:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Text Content */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              About Crescent
            </h2>

            <p className="mt-4 sm:mt-5 text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
              Crescent Developments creates vibrant residential communities, blend modern design,
              luxury living, and prime locations, ensuring exceptional properties that elevate
              lifestyle and set new standards in living excellence.
            </p>

            {/* Learn More Button */}
            <button
              onClick={onLearnMore}
              className="mt-6 px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white bg-[#c69a68] hover:bg-[#b88c58] active:bg-[#a97c48] rounded-md shadow-sm transition-all duration-200 cursor-pointer inline-flex items-center gap-2 group"
            >
              <span>Learn More About Us</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Trust Points Row */}
            <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pt-8 border-t border-slate-100 w-full">
              {/* Point 1: Trusted Experience */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-[#c69a68]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Trusted Experience</h4>
                  <p className="mt-1 text-xs text-slate-500 leading-normal">
                    Over two decades shaping landmark communities across Hyderabad's finest enclaves.
                  </p>
                </div>
              </div>

              {/* Point 2: Premium Quality */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-slate-800" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Premium Quality</h4>
                  <p className="mt-1 text-xs text-slate-500 leading-normal">
                    Uncompromising engineering standards, natural stone finishes, and architectural longevity.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Photography */}
          <div className="lg:col-span-6 relative flex flex-col justify-center">
            <div className="relative w-full h-[260px] sm:h-[360px] lg:h-[480px] rounded-2xl overflow-hidden shadow-xl border border-slate-100 group">
              <img
                src="/images/about_crescent_hd.jpg"
                alt="Crescent Developments luxury residential community and clubhouse architecture in Hyderabad"
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Subtle decorative accent pill/tag */}
            <div className="hidden sm:flex items-center gap-2 absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-lg shadow-lg border border-slate-100">
              <div className="w-2.5 h-2.5 rounded-full bg-[#c69a68]" />
              <span className="text-xs font-semibold text-slate-800">
                25+ Years of Architectural Mastery
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
