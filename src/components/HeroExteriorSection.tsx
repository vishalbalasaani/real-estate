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
  const curtainRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const curtain = curtainRef.current;
    const image = imageRef.current;
    const text = textRef.current;

    if (!section || !curtain || !image || !text) return;

    // Smooth curtain lift-up animation on scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=100%',
        scrub: 0.8,
        pin: true,
        pinSpacing: false, // Next section (interior video) sits directly underneath
      },
    });

    tl.to(image, {
      scale: 1.08,
      yPercent: -15,
      ease: 'none',
    }, 0)
    .to(text, {
      opacity: 0,
      y: -40,
      ease: 'power1.in',
    }, 0)
    .to(curtain, {
      yPercent: -100, // Slides up out of the viewport to reveal the interior video
      ease: 'power2.inOut',
    }, 0.15);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section) t.kill();
      });
    };
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full h-screen z-30 overflow-hidden bg-slate-950"
    >
      {/* Sliding Curtain Container */}
      <div
        ref={curtainRef}
        className="relative w-full h-full overflow-hidden will-change-transform shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
      >
        {/* Full-bleed Architectural Image */}
        <img
          ref={imageRef}
          src="/images/exterior_building.jpg"
          alt="Crescent Developments luxury residential apartment towers and landscaped community in Hyderabad"
          className="absolute inset-0 w-full h-full object-cover object-center will-change-transform"
          loading="eager"
        />

        {/* Cinematic Vignettes and Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-slate-950/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/15 to-transparent pointer-events-none" />

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
      </div>
    </section>
  );
};

