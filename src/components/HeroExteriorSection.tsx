import React, { useEffect, useRef } from 'react';
import { ArrowDown, ChevronDown } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HeroExteriorSectionProps {
  onExploreInterior: () => void;
  onRequestInfo: () => void;
}

export const HeroExteriorSection: React.FC<HeroExteriorSectionProps> = ({
  onExploreInterior,
  onRequestInfo,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const text = textRef.current;

    if (!section || !image || !text) return;

    // Fluid parallax & text fade without scroll-locking or pinned traps
    const stImage = gsap.to(image, {
      yPercent: 18,
      scale: 1.05,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.3,
      },
    });

    const stText = gsap.to(text, {
      opacity: 0,
      y: -35,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '70% top',
        scrub: 0.2,
      },
    });

    return () => {
      stImage.scrollTrigger?.kill();
      stText.scrollTrigger?.kill();
    };
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full h-screen min-h-[100dvh] z-30 overflow-hidden bg-slate-950"
    >
      {/* Full-bleed Architectural Image with Parallax */}
      <img
        ref={imageRef}
        src="/images/exterior_building.jpg"
        alt="Crescent Developments luxury residential apartment towers and landscaped community in Hyderabad"
        className="absolute inset-0 w-full h-full object-cover object-center will-change-transform"
        loading="eager"
      />

      {/* Cinematic Vignettes and Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-slate-950/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/20 to-transparent pointer-events-none" />

      {/* Hero Content Overlay */}
      <div
        ref={textRef}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center pt-16 sm:pt-20 will-change-transform"
      >
        <div className="max-w-2xl">
          {/* Editorial Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-editorial font-medium tracking-tight text-white leading-[1.1] drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)]">
            <span>Modern Living</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#f1d7b6]">
              Starts Here.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-xl text-slate-200/95 max-w-xl leading-relaxed font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            Discover premium new residential communities designed for contemporary living. Scroll down to take an immersive interior tour.
          </p>

          {/* CTAs */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={onExploreInterior}
              className="w-full sm:w-auto justify-center px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-white bg-[#c69a68] hover:bg-[#b88c58] active:bg-[#a97c48] rounded-md shadow-xl shadow-amber-950/30 transition-all duration-200 cursor-pointer inline-flex items-center gap-2.5 group"
            >
              <span>Explore Interior Tour</span>
              <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
            </button>

            <button
              onClick={onRequestInfo}
              className="w-full sm:w-auto justify-center px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-white bg-black/40 hover:bg-black/60 border border-white/60 hover:border-white rounded-md backdrop-blur-xs transition-all duration-200 cursor-pointer shadow-lg inline-flex items-center"
            >
              Request Info
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="absolute bottom-7 inset-x-0 flex flex-col items-center justify-center text-white/80 pointer-events-none z-10">
        <span className="text-[11px] font-medium tracking-widest uppercase text-slate-300 drop-shadow-md mb-2">
          Scroll to enter residence
        </span>
        <ChevronDown className="w-4 h-4 text-[#c69a68] animate-bounce" />
      </div>
    </section>
  );
};
