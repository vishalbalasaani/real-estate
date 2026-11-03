import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Building2, Sparkles, ShieldCheck, Trees } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const BuildingExteriorSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const textContainer = textContainerRef.current;
    const badges = badgesRef.current;

    if (!section || !image || !textContainer) return;

    // Subtle parallax scale and gentle vertical movement on image
    const imageTween = gsap.fromTo(
      image,
      { scale: 1.12, yPercent: -4 },
      {
        scale: 1.0,
        yPercent: 4,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      }
    );

    // Elegant entrance animation for the text overlay
    const textTween = gsap.fromTo(
      textContainer.children,
      {
        opacity: 0,
        y: 35,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Badges stagger animation
    let badgeTween: gsap.core.Tween | null = null;
    if (badges) {
      badgeTween = gsap.fromTo(
        badges.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: badges,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    return () => {
      imageTween.kill();
      textTween.kill();
      if (badgeTween) badgeTween.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section || t.trigger === badges) t.kill();
      });
    };
  }, []);

  return (
    <section
      id="exterior-reveal"
      ref={sectionRef}
      className="relative w-full min-h-[95vh] lg:min-h-screen bg-slate-950 overflow-hidden flex flex-col justify-between py-16 sm:py-20 lg:py-24"
    >
      {/* 1. Full-Width Architectural Visual with Parallax */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          ref={imageRef}
          src="/images/exterior_building.jpg"
          alt="Crescent Developments luxury residential apartment towers and landscaped gated community in Hyderabad"
          className="w-full h-full object-cover object-center will-change-transform"
          loading="eager"
        />

        {/* Cinematic Vignette & Warm Atmospheric Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/20 to-transparent" />
      </div>

      {/* 2. Top Accent / Subtle Architecture Label */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/15 text-amber-200 text-xs font-semibold tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#c69a68]" />
          <span>The Architectural Landmark</span>
        </div>
      </div>

      {/* 3. Center/Lower-Left Editorial Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-12">
        <div ref={textContainerRef} className="max-w-3xl">
          {/* Eyebrow */}
          <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#e3c29b] mb-4">
            Residential Architecture & Presence
          </p>

          {/* Headline (Editorial Serif Display) */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-editorial font-medium tracking-tight text-white leading-[1.08] drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)]">
            A place to call your own.
          </h2>

          {/* Supporting Text */}
          <p className="mt-5 sm:mt-6 text-base sm:text-lg lg:text-xl text-slate-200/95 max-w-2xl leading-relaxed font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Thoughtfully envisioned residential living, where architecture and everyday life come together.
          </p>
        </div>
      </div>

      {/* 4. Bottom Architectural Highlights Strip */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div
          ref={badgesRef}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-white/15"
        >
          {/* Pill 1 */}
          <div className="flex items-center gap-3 bg-slate-950/70 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 shadow-lg">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4 text-[#c69a68]" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Gated Apartment Community</h4>
              <p className="text-[11px] text-slate-400">Contemporary Towers with Elegant Terraces</p>
            </div>
          </div>

          {/* Pill 2 */}
          <div className="flex items-center gap-3 bg-slate-950/70 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 shadow-lg">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <Trees className="w-4 h-4 text-[#c69a68]" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Landscaped Arrival</h4>
              <p className="text-[11px] text-slate-400">Tropical Greenery & Grand Paved Court</p>
            </div>
          </div>

          {/* Pill 3 */}
          <div className="flex items-center gap-3 bg-slate-950/70 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 shadow-lg">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#c69a68]" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Signature Development</h4>
              <p className="text-[11px] text-slate-400">Prime Hyderabad Residential Setting</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

