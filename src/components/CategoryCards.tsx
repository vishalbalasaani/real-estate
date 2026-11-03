import React, { useEffect, useRef } from 'react';
import { Star, Building2, Waves, ArrowUpRight } from 'lucide-react';
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

  const categories = [
    {
      id: 'luxury' as const,
      ref: card1Ref,
      image: '/images/project_skyline_hd.jpg',
      icon: Star,
      iconColor: 'text-[#c69a68]',
      title: 'Luxury Residences',
      description:
        'Bespoke high-rise residences crafted with Italian finishes, panoramic skyline vistas, and white-glove concierge services.',
      metric: '910 - 1,500 SQ FT',
    },
    {
      id: 'urban' as const,
      ref: card2Ref,
      image: '/images/project_midtown_hd.jpg',
      icon: Building2,
      iconColor: 'text-[#2563eb]',
      title: 'Urban Living',
      description:
        'Dynamic, connected urban lofts designed for modern professionals, featuring co-working lounges and private wellness spaces.',
      metric: '190+ UNITS · 501K SQ FT',
    },
    {
      id: 'waterfront' as const,
      ref: card3Ref,
      image: '/images/project_shoreline_hd.jpg',
      icon: Waves,
      iconColor: 'text-[#0284c7]',
      title: 'Waterfront Homes',
      description:
        'Tranquil lakefront estates offering uninterrupted water views, private promenades, and serene reflecting pools.',
      metric: '910 - 3,200 SQ FT',
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const card1 = card1Ref.current;
    const card2 = card2Ref.current;
    const card3 = card3Ref.current;
    const header = headerRef.current;

    if (!section || !card1 || !card2 || !card3) return;

    const isDesktop = window.matchMedia('(min-width: 768px)').matches;

    if (isDesktop) {
      // Pinned scroll-synchronized sequential reveal: cards appear one after another
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=160%',
          pin: true,
          scrub: 0.8,
        },
      });

      gsap.set([card1, card2, card3], { opacity: 0, y: 40 });
      if (header) gsap.set(header, { opacity: 0, y: 20 });

      tl.to(header, { opacity: 1, y: 0, duration: 0.4 })
        .to(card1, { opacity: 1, y: 0, duration: 0.7 }, '+=0.1')
        .to(card2, { opacity: 1, y: 0, duration: 0.7 }, '+=0.2')
        .to(card3, { opacity: 1, y: 0, duration: 0.7 }, '+=0.2');

      return () => {
        tl.kill();
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === section) st.kill();
        });
      };
    } else {
      // Mobile: Individual scroll/swipe-triggered reveals as user scrolls through each card
      const cards = [card1, card2, card3];
      const triggers: ScrollTrigger[] = [];

      cards.forEach((card) => {
        gsap.set(card, { opacity: 0, y: 30 });
        const st = ScrollTrigger.create({
          trigger: card,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(card, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
          },
        });
        triggers.push(st);
      });

      return () => {
        triggers.forEach((t) => t.kill());
      };
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-slate-950 flex flex-col justify-center items-center overflow-hidden py-20 px-4 sm:px-6 lg:px-8 z-20"
    >
      {/* Background Architectural Visual */}
      <img
        src="/images/exterior_building.jpg"
        alt="Crescent Developments luxury residential architecture"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-40 will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/80 pointer-events-none" />

      {/* Section Header */}
      <div ref={headerRef} className="relative z-10 text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#e3c29b] font-mono">
          Residential Collections
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-medium text-white mt-2 leading-tight">
          Crafted for Every Lifestyle
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-slate-300 font-light max-w-md mx-auto">
          Scroll down to discover each signature collection designed for modern living.
        </p>
      </div>

      {/* 3 Sequential Cards Container */}
      <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              ref={cat.ref}
              onClick={() => onSelectCategory(cat.id)}
              className="group bg-white rounded-xl overflow-hidden shadow-xl border border-slate-200/90 hover:border-slate-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer relative will-change-transform"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectCategory(cat.id);
                }
              }}
            >
              {/* Picture Frame with Category Icon Badge */}
              <div className="relative w-full h-44 sm:h-48 lg:h-52 overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={cat.image}
                  alt={`${cat.title} by Crescent Developments`}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Floating Category Icon Badge */}
                <div className="absolute top-3.5 left-3.5 w-10 h-10 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center shadow-md">
                  <Icon className={`w-5 h-5 ${cat.iconColor} stroke-[1.8]`} />
                </div>

                {/* Hover indicator arrow */}
                <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md">
                  <ArrowUpRight className="w-4 h-4 text-slate-700" />
                </div>
              </div>

              {/* Card Body - Content is 100% clearly visible */}
              <div className="p-6 sm:p-7 flex flex-col items-center text-center flex-1 bg-white">
                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#c69a68] transition-colors">
                  {cat.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-xs sm:text-[13px] text-slate-500 leading-relaxed max-w-xs">
                  {cat.description}
                </p>

                {/* Subtle Hairline Divider */}
                <div className="w-12 h-px bg-slate-100 my-4 group-hover:w-20 transition-all duration-300" />

                {/* Spec / Metric Footer */}
                <div className="text-[11px] sm:text-xs font-semibold tracking-wider text-slate-600 uppercase font-mono">
                  {cat.metric}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
