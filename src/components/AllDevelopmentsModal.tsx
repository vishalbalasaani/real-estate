import React, { useState } from 'react';
import { X, Search, Filter, ArrowUpRight } from 'lucide-react';
import { ProjectItem } from '../types';
import { projectsData } from './FeaturedProjects';

interface AllDevelopmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (project: ProjectItem) => void;
  initialFilter?: 'all' | 'luxury' | 'urban' | 'waterfront';
}

export const AllDevelopmentsModal: React.FC<AllDevelopmentsModalProps> = ({
  isOpen,
  onClose,
  onSelectProject,
  initialFilter = 'all',
}) => {
  const [filter, setFilter] = useState<'all' | 'luxury' | 'urban' | 'waterfront'>(initialFilter);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // Extended portfolio
  const extendedPortfolio: ProjectItem[] = [
    ...projectsData,
    {
      id: 'belvedere-park',
      name: 'Belvedere Park Residences',
      subtitle: 'Tranquil garden estate living',
      description:
        'Nestled amidst protected botanical acreage, offering expansive glass pavilions, private infinity pools, and organic garden allotments.',
      image: '/images/about_crescent_hd.jpg',
      location: 'Jubilee Hills, Hyderabad',
      beds: '3 - 5 BHK Luxury Residences',
      price: 'From ₹4.20 Cr',
      sqft: '3,200 - 5,800 sq ft',
      completion: 'Winter 2027',
      category: 'luxury',
      features: ['Private Tennis Pavilion', 'Clubhouse Access', 'Wine Cellars', 'Landscaped Trails'],
    },
    {
      id: 'marina-promenade',
      name: 'Marina Promenade Villas',
      subtitle: 'Waterside architectural residences',
      description:
        'Direct lakefront access, serene water views, floor-to-ceiling glass looking out over the open bay, and private plunge pools.',
      image: '/images/project_shoreline_hd.jpg',
      location: 'Durgam Cheruvu, Hyderabad',
      beds: '4 - 5 BHK Lakefront Villas',
      price: 'From ₹6.50 Cr',
      sqft: '4,500 - 7,200 sq ft',
      completion: 'Fall 2027',
      category: 'waterfront',
      features: ['Private Lake Deck', 'Rooftop Solarium', 'Smart Home Automation', 'Concierge'],
    },
    {
      id: 'veridian-quarter',
      name: 'Veridian Urban Quarter',
      subtitle: 'Smart sustainable urban sanctuary',
      description:
        'Platinum certified urban community with zero-emission sustainable design, vertical gardens, and high-speed metro connectivity.',
      image: '/images/project_midtown_hd.jpg',
      location: 'HITEC City, Hyderabad',
      beds: '2 - 3 BHK Urban Lofts',
      price: 'From ₹1.95 Cr',
      sqft: '1,450 - 2,400 sq ft',
      completion: 'Ready for Occupancy',
      category: 'urban',
      features: ['Green Building Certified', 'Community Coworking', 'EV Charging Stations', 'Sky Lounge'],
    },
  ];

  const filtered = extendedPortfolio.filter((item) => {
    const matchesCategory = filter === 'all' || item.category === filter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-5xl w-full p-4 sm:p-7 shadow-2xl relative border border-slate-100 max-h-[94vh] sm:max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3 sm:pb-4 shrink-0">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#c69a68] uppercase font-mono">
              Portfolio Catalog
            </span>
            <h3 className="text-xl sm:text-3xl font-bold text-slate-900 mt-0.5">
              All Crescent Developments
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Explore our current and upcoming signature communities across prime locations.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 border-b border-slate-100 shrink-0">
          {/* Category Tabs - horizontally scrollable on mobile */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-lg w-full sm:w-auto overflow-x-auto no-scrollbar whitespace-nowrap shrink-0">
            {(
              [
                { id: 'all', label: 'All Developments' },
                { id: 'luxury', label: 'Luxury Residences' },
                { id: 'urban', label: 'Urban Living' },
                { id: 'waterfront', label: 'Waterfront' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filter === tab.id
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:border-[#c69a68]"
            />
          </div>
        </div>

        {/* Card List: flex-col on mobile, grid on md+ */}
        <div className="flex-1 min-h-0 overflow-y-auto py-4 sm:py-6 flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 pr-1">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              onClick={() => {
                onClose();
                onSelectProject(proj);
              }}
              style={{ minHeight: '300px' }}
              className="group bg-white rounded-xl overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1 shrink-0 w-full"
            >
              <div
                className="relative w-full bg-slate-100 overflow-hidden shrink-0"
                style={{ height: '180px', minHeight: '180px' }}
              >
                <img
                  src={proj.image}
                  alt={proj.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-1 rounded bg-slate-950/75 text-white backdrop-blur-xs font-mono shadow-sm">
                  {proj.price}
                </span>
              </div>
              <div
                className="p-4 flex flex-col justify-between flex-1 bg-white shrink-0"
                style={{ minHeight: '110px' }}
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#c69a68] transition-colors">
                    {proj.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{proj.subtitle}</p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>{proj.beds}</span>
                  <span>{proj.completion}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
