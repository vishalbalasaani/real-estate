import React, { useEffect, useRef, useState } from 'react';
import { Star, Building2, Waves, ArrowUpRight, X } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CategoryCardsProps {
  onSelectCategory: (category: 'luxury' | 'urban' | 'waterfront') => void;
}

export const CategoryCards: React.FC<CategoryCardsProps> = ({ onSelectCategory }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Track which cards have their text drawer revealed
  const [revealedCards, setRevealedCards] = useState<Record<string, boolean>>({});

  const touchStartMap = useRef<Record<string, { x: number; y: number }>>({});

  const categories = [
    {
      id: 'luxury' as const,
      ref: card1Ref,
      image: '/images/category_luxury_residences.jpg',
      icon: Star,
      iconColor: 'text-[#c69a68]',
      title: 'Luxury Residences',
      subtitle: 'Signature High-Rise',
      description:
        'Bespoke high-rise residences crafted with Italian finishes, panoramic skyline vistas, and white-glove concierge services.',
      metric: '910 - 1,500 SQ FT',
    },
    {
      id: 'urban' as const,
      ref: card2Ref,
      image: '/images/category_urban_living.jpg',
      icon: Building2,
      iconColor: 'text-[#60a5fa]',
      title: 'Urban Living',
      subtitle: 'Boutique Lofts',
      description:
        'Dynamic, connected urban lofts designed for modern professionals, featuring co-working lounges and private wellness spaces.',
      metric: '190+ UNITS · 501K SQ FT',
    },
    {
      id: 'waterfront' as const,
      ref: card3Ref,
      image: '/images/category_waterfront_homes.jpg',
      icon: Waves,
      iconColor: 'text-[#38bdf8]',
      title: 'Waterfront Homes',
      subtitle: 'Lakefront Estates',
      description:
        'Tranquil lakefront estates offering uninterrupted water views, private promenades, and serene reflecting pools.',
      metric: '910 - 3,200 SQ FT',
    },
  ];

  // Toggle reveal state for a specific card
  const toggleCardReveal = (id: string) => {
    setRevealedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    const section = sectionRef.current;
    const card1 = card1Ref.current;
    const card2 = card2Ref.current;
    const card3 = card3Ref.current;
    const header = headerRef.current;

    if (!section || !card1 || !card2 || !card3) return;

    // Reset revealed text when user scrolls away to another section
    const stReset = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      onLeave: () => {
        setRevealedCards({});
      },
      onLeaveBack: () => {
        setRevealedCards({});
      },
    });

    const isDesktop = window.matchMedia('(min-width: 768px)').matches;

    if (isDesktop) {
      // Pinned sequential reveal on desktop
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      gsap.set([card1, card2, card3], { opacity: 0, y: 30 });
      if (header) gsap.set(header, { opacity: 0, y: 15 });

      tl.to(header, { opacity: 1, y: 0, duration: 0.35 })
        .to(card1, { opacity: 1, y: 0, duration: 0.55 }, '+=0.05')
        .to(card2, { opacity: 1, y: 0, duration: 0.55 }, '+=0.1')
        .to(card3, { opacity: 1, y: 0, duration: 0.55 }, '+=0.1');

      return () => {
        tl.kill();
        stReset.kill();
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === section) st.kill();
        });
      };
    } else {
      // Mobile reveals
      const cards = [card1, card2, card3];
      const anims: gsap.core.Tween[] = [];

      cards.forEach((card) => {
        const anim = gsap.fromTo(
          card,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              once: true,
            },
          }
        );
        anims.push(anim);
      });

      return () => {
        anims.forEach((a) => {
          a.scrollTrigger?.kill();
          a.kill();
        });
        stReset.kill();
      };
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-slate-950 flex flex-col justify-center items-center overflow-hidden py-16 sm:py-20 px-4 sm:px-6 lg:px-8 z-20"
    >
      {/* Background Architectural Ambient Visual */}
      <img
        src="/images/exterior_building.jpg"
        alt="Crescent Developments luxury residential architecture"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-25 will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/90 pointer-events-none" />

      {/* Section Header */}
      <div ref={headerRef} className="relative z-10 text-center max-w-xl mx-auto mb-8 sm:mb-10">
        <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#e3c29b] font-mono">
          Residential Collections
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-editorial font-medium text-white mt-1.5 leading-tight">
          Crafted for Every Lifestyle
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 font-light max-w-sm mx-auto">
          Tap any residence to explore specifications and curated floor plans.
        </p>
      </div>

      {/* 3 Compact, Simple & Clean Cards */}
      <div className="relative z-10 max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isRevealed = Boolean(revealedCards[cat.id]);

          return (
            <div
              key={cat.id}
              ref={cat.ref}
              onClick={() => toggleCardReveal(cat.id)}
              onTouchStart={(e) => {
                touchStartMap.current[cat.id] = {
                  x: e.touches[0].clientX,
                  y: e.touches[0].clientY,
                };
              }}
              onTouchEnd={(e) => {
                const start = touchStartMap.current[cat.id];
                if (start) {
                  const deltaX = Math.abs(e.changedTouches[0].clientX - start.x);
                  const deltaY = Math.abs(e.changedTouches[0].clientY - start.y);
                  if (deltaX > 20 || deltaY > 20 || deltaY < 12) {
                    toggleCardReveal(cat.id);
                  }
                }
              }}
              className="group relative h-[330px] sm:h-[350px] lg:h-[370px] rounded-2xl overflow-hidden shadow-xl border border-white/10 hover:border-[#c69a68]/60 transition-all duration-300 cursor-pointer will-change-transform select-none"
              role="button"
              tabIndex={0}
              aria-expanded={isRevealed}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleCardReveal(cat.id);
                }
              }}
            >
              {/* Distinct Architectural Photography */}
              <img
                src={cat.image}
                alt={`${cat.title} by Crescent Developments`}
                className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ${
                  isRevealed
                    ? 'scale-108 brightness-40 blur-[1px]'
                    : 'group-hover:scale-105 brightness-95'
                }`}
                loading="lazy"
              />

              {/* Subtle Ambient Contrast Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

              {/* Clean Front Presentation: Minimalist Floating Bottom Pill */}
              <div
                className={`absolute inset-x-3.5 bottom-3.5 p-3 rounded-xl bg-slate-950/70 backdrop-blur-md border border-white/15 flex items-center justify-between transition-all duration-300 ${
                  isRevealed
                    ? 'opacity-0 translate-y-2 pointer-events-none'
                    : 'opacity-100 translate-y-0 group-hover:bg-slate-950/85 group-hover:border-white/25'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Icon className={`w-4 h-4 ${cat.iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-semibold text-white tracking-wide truncate">
                      {cat.title}
                    </h3>
                    <span className="text-[10px] text-[#e3c29b] font-mono tracking-wider">
                      {cat.metric}
                    </span>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/90 group-hover:bg-[#c69a68] group-hover:text-white transition-all shrink-0">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Smooth Slide-Up Glass Drawer (Rich Details revealed on click/swipe) */}
              <div
                className={`absolute inset-0 p-5 sm:p-6 bg-slate-950/90 backdrop-blur-md flex flex-col justify-between text-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isRevealed
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-full pointer-events-none'
                }`}
              >
                {/* Header row with Icon, Title and Close Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center">
                      <Icon className={`w-4 h-4 ${cat.iconColor}`} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white tracking-wide">
                        {cat.title}
                      </h4>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#e3c29b]">
                        {cat.subtitle}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCardReveal(cat.id);
                    }}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Close details"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="py-2">
                  <p className="text-xs text-slate-200/90 font-light leading-relaxed">
                    {cat.description}
                  </p>

                  <div className="w-10 h-px bg-[#c69a68] my-3" />

                  <div className="text-[11px] font-semibold tracking-wider text-[#e3c29b] font-mono uppercase">
                    {cat.metric}
                  </div>
                </div>

                {/* Action CTA Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCategory(cat.id);
                  }}
                  className="w-full py-2.5 px-3 bg-[#c69a68] hover:bg-[#b88c58] active:bg-[#a97c48] text-white text-xs font-semibold rounded-lg shadow-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Explore Collection</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
