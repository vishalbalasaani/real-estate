import React from 'react';
import { ArrowUpRight, ChevronRight, MapPin, Bed, Maximize2 } from 'lucide-react';
import { ProjectItem } from '../types';

interface FeaturedProjectsProps {
  onSelectProject: (project: ProjectItem) => void;
  onViewAll: () => void;
}

export const projectsData: ProjectItem[] = [
  {
    id: 'skyline-towers',
    name: 'Skyline Towers',
    subtitle: 'Sophisticated luxury living',
    description:
      'Twin high-rise landmark towers offering panoramic skyline vistas, custom Italian cabinetry, private sky lounge, and white-glove concierge services.',
    image: '/images/project_skyline_hd.jpg',
    location: 'Financial District, Hyderabad',
    beds: '3 - 4 BHK Luxury Residences',
    price: 'From ₹3.85 Cr',
    sqft: '2,400 - 4,800 sq ft',
    completion: 'Q4 2026',
    category: 'luxury',
    features: ['Private Elevator Access', 'Infinity Sky Pool', 'Valet Parking', '24/7 Concierge'],
  },
  {
    id: 'midtown-lofts',
    name: 'Midtown Lofts',
    subtitle: 'Contemporary boutique residences',
    description:
      'Curated architectural lofts featuring 12-foot ceilings, integrated European appliances, co-working lounges, and private landscaped courtyards.',
    image: '/images/project_midtown_hd.jpg',
    location: 'Banjara Hills, Hyderabad',
    beds: '2 - 3 BHK Urban Lofts',
    price: 'From ₹2.10 Cr',
    sqft: '1,650 - 2,900 sq ft',
    completion: 'Move-in Ready',
    category: 'urban',
    features: ['Rooftop Garden', 'Fitness & Wellness Club', 'Co-working Studio', 'EV Charging'],
  },
  {
    id: 'the-shoreline',
    name: 'The Shoreline',
    subtitle: 'Waterside luxury living',
    description:
      'Premier waterside estate residences with expansive waterfront terraces, serene reflecting pools, direct promenade access, and lush greenery.',
    image: '/images/project_shoreline_hd.jpg',
    location: 'Lakefront Enclave, Hyderabad',
    beds: '4 - 5 BHK Waterfront Suites',
    price: 'From ₹5.40 Cr',
    sqft: '3,800 - 6,200 sq ft',
    completion: 'Spring 2027',
    category: 'waterfront',
    features: ['Waterfront Promenade', 'Waterside Dining Pavilion', 'Private Plunge Pools', 'Wellness Spa'],
  },
];

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({
  onSelectProject,
  onViewAll,
}) => {
  return (
    <section id="properties" className="py-20 sm:py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Featured Projects
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
              Signature residential developments setting new benchmarks for architectural quality
            </p>
          </div>

          <button
            onClick={onViewAll}
            className="self-start sm:self-auto px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-md shadow-2xs transition-colors duration-150 inline-flex items-center gap-1.5 group cursor-pointer"
          >
            <span>View All Developments</span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 text-slate-400 group-hover:text-slate-700" />
          </button>
        </div>

        {/* 3 Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {projectsData.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/80 transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectProject(project);
                }
              }}
            >
              {/* Image Frame */}
              <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={project.image}
                  alt={`${project.name} by Crescent Developments`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle scrim overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Top Corner Badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs p-1.5 rounded-md text-slate-700 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-90 shadow-sm">
                  <ArrowUpRight className="w-4 h-4 text-[#c69a68]" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#c69a68] transition-colors">
                  {project.name}
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-500 mt-1 font-medium">
                  {project.subtitle}
                </p>

                {/* Key metadata row */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="font-semibold text-slate-900">{project.price}</span>
                  <span className="text-slate-400 font-mono text-[11px]">{project.sqft}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
