import React, { useEffect, useRef, useState } from 'react';
import { Star, Building2, Waves, ArrowUpRight, X, Sparkles, ChevronUp } from 'lucide-react';
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

  // Track which cards have their text revealed (empty by default so only photos show)
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
      subtitle: 'Signature High-Rise Sanctuaries',
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
      subtitle: 'Contemporary Boutique Lofts',
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
      subtitle: 'Tranquil Lakefront Estates',
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

    // Reset revealed text when user scrolls away to another section (in either direction)
    // so when they scroll back, only the images are showing!
    const stReset = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      onLeave: () => {
        // Scrolled down past this section into next section
        setRevealedCards({});
      },
      onLeaveBack: () => {
        // Scrolled up past this section into previous section
        setRevealedCards({});
      },
    });

    const isDesktop = window.matchMedia('(min-width: 768px)').matches;

    if (isDesktop) {
      // Pinned scroll-synchronized sequential reveal: cards enter view one after another
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: 0.6,
        },
      });

      gsap.set([card1, card2, card3], { opacity: 0, y: 35 });
      if (header) gsap.set(header, { opacity: 0, y: 20 });

      tl.to(header, { opacity: 1, y: 0, duration: 0.35 })
        .to(card1, { opacity: 1, y: 0, duration: 0.6 }, '+=0.05')
        .to(card2, { opacity: 1, y: 0, duration: 0.6 }, '+=0.1')
        .to(card3, { opacity: 1, y: 0, duration: 0.6 }, '+=0.1');

      return () => {
        tl.kill();
        stReset.kill();
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === section) st.kill();
        });
      };
    } else {
      // Mobile: Individual scroll-triggered reveals as user scrolls through each card
      const cards = [card1, card2, card3];
      const anims: gsap.core.Tween[] = [];

      cards.forEach((card) => {
        const anim = gsap.fromTo(
          card,
          { opacity: 0, y: 25 },
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
      className="relative w-full min-h-screen bg-slate-950 flex flex-col justify-center items-center overflow-hidden py-20 px-4 sm:px-6 lg:px-8 z-20"
    >
      {/* Background Architectural Ambient Visual */}
      <img
        src="/images/exterior_building.jpg"
        alt="Crescent Developments luxury residential architecture"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-30 will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/85 pointer-events-none" />

      {/* Section Header */}
      <div ref={headerRef} className="relative z-10 text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#e3c29b] font-mono">
          Residential Collections
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-medium text-white mt-2 leading-tight">
          Crafted for Every Lifestyle
        </h2>
        <p className="mt-2.5 text-xs sm:text-sm text-slate-300 font-light max-w-md mx-auto">
          Click or swipe on any photograph to reveal collection details and specifications.
        </p>
      </div>

      {/* 3 Interactive Cards Container */}
      <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
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
                  // Trigger on tap or swipe gesture on the card
                  if (deltaX > 20 || deltaY > 20 || deltaY < 12) {
                    toggleCardReveal(cat.id);
                  }
                }
              }}
              className="group relative h-[440px] sm:h-[480px] lg:h-[510px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 hover:border-[#c69a68]/50 transition-all duration-300 cursor-pointer will-change-transform select-none"
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
              {/* Full-bleed Distinct Architectural Photo */}
              <img
                src={cat.image}
                alt={`${cat.title} by Crescent Developments`}
                className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ${
                  isRevealed ? 'scale-110 filter brightness-50' : 'group-hover:scale-105'
                }`}
                loading="lazy"
              />

              {/* Cinematic Vignettes */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-slate-950/40 pointer-events-none" />

              {/* Unrevealed View: Clean Luxury Photo Presentation (Text Hidden) */}
              <div
                className={`absolute inset-0 p-6 sm:p-7 flex flex-col justify-between transition-opacity duration-300 pointer-events-none ${
                  isRevealed ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {/* Top Badge: Category Title & Icon */}
                <div className="flex items-center justify-between w-full">
                  <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-950/65 backdrop-blur-md border border-white/15 shadow-lg">
                    <Icon className={`w-4 h-4 ${cat.iconColor}`} />
                    <span className="text-xs font-semibold tracking-wide text-white">
                      {cat.title}
                    </span>
                  </div>

                  <span className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 group-hover:bg-[#c69a68] group-hover:text-white transition-colors shadow-md">
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Bottom Prompt: Click or swipe to reveal */}
                <div className="flex items-center justify-between pt-4 border-t border-white/15">
                  <span className="text-xs font-medium tracking-wide text-white/90 drop-shadow-md">
                    Click or swipe to view details
                  </span>
                  <div className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white group-hover:translate-y-[-2px] transition-transform">
                    <ChevronUp className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Revealed View: Rich Glassmorphic Text Card (Slides/Fades in on click or swipe) */}
              <div
                className={`absolute inset-0 p-6 sm:p-7 bg-slate-950/90 backdrop-blur-md flex flex-col justify-between text-white transition-all duration-400 ease-out ${
                  isRevealed
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
              >
                {/* Header row with Icon and Close Button */}
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-lg">
                    <Icon className={`w-6 h-6 ${cat.iconColor} stroke-[1.8]`} />
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCardReveal(cat.id);
                    }}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                    aria-label="Hide details"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Main Revealed Text Content */}
                <div className="my-auto py-4">
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#e3c29b] font-mono">
                    {cat.subtitle}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-editorial font-medium text-white mt-1.5 leading-tight">
                    {cat.title}
                  </h3>

                  <p className="mt-3 text-xs sm:text-[13px] text-slate-200/90 font-light leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Golden Hairline Divider */}
                  <div className="w-14 h-px bg-[#c69a68] my-4" />

                  {/* Spec / Metric */}
                  <div className="text-xs font-semibold tracking-wider text-[#e3c29b] uppercase font-mono">
                    {cat.metric}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCategory(cat.id);
                  }}
                  className="w-full py-3 px-4 bg-[#c69a68] hover:bg-[#b88c58] active:bg-[#a97c48] text-white text-xs font-semibold rounded-lg shadow-xl shadow-amber-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer group/btn"
                >
                  <span>Explore {cat.title}</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
