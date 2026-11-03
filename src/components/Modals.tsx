import React, { useState } from 'react';
import { X, Check, Building2, MapPin, Bed, Maximize2, Calendar, ShieldCheck, Download, ArrowRight } from 'lucide-react';
import { ProjectItem, InquiryFormData } from '../types';
import { projectsData } from './FeaturedProjects';

interface ContactSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProject?: string;
}

export const ContactSalesModal: React.FC<ContactSalesModalProps> = ({
  isOpen,
  onClose,
  defaultProject = 'Skyline Towers',
}) => {
  const [formData, setFormData] = useState<InquiryFormData>({
    fullName: '',
    email: '',
    phone: '',
    project: defaultProject,
    budget: '$1M - $2M',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-8 shadow-2xl relative border border-slate-100 max-h-[94vh] sm:max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-12 text-center flex flex-col items-center">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Inquiry Received</h3>
            <p className="mt-2 text-sm text-slate-500 max-w-xs">
              A Crescent Developments Sales Advisor will contact you within 2 business hours.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-[11px] font-bold tracking-widest text-[#c69a68] uppercase font-mono">
                Private Advisory
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">Connect with Sales</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Schedule a confidential consultation or private sales gallery viewing.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-[#c69a68] focus:ring-1 focus:ring-[#c69a68]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="eleanor@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-[#c69a68] focus:ring-1 focus:ring-[#c69a68]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-[#c69a68] focus:ring-1 focus:ring-[#c69a68]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Development of Interest
                  </label>
                  <select
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-[#c69a68] bg-white"
                  >
                    <option value="Skyline Towers">Skyline Towers (Luxury)</option>
                    <option value="Midtown Lofts">Midtown Lofts (Urban)</option>
                    <option value="The Shoreline">The Shoreline (Waterfront)</option>
                    <option value="General Portfolio">General Portfolio Advisory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Price Range
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-[#c69a68] bg-white"
                  >
                    <option value="Under $1M">Under $1,000,000</option>
                    <option value="$1M - $2M">$1,000,000 – $2,000,000</option>
                    <option value="$2M - $4M">$2,000,000 – $4,000,000</option>
                    <option value="$4M+">$4,000,000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message / Specific Preferences
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about desired floor level, move-in timeline, or bedroom requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-[#c69a68] focus:ring-1 focus:ring-[#c69a68]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#c69a68] hover:bg-[#b88c58] text-white font-semibold text-sm rounded-md transition-colors shadow-sm cursor-pointer"
              >
                Submit Confidential Inquiry
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

interface RequestInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestInfoModal: React.FC<RequestInfoModalProps> = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleDownloadBrochure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadComplete(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-8 shadow-2xl relative border border-slate-100 max-h-[94vh] sm:max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 bg-amber-50 text-[#c69a68] rounded-xl flex items-center justify-center mb-4">
          <Download className="w-6 h-6 stroke-[1.8]" />
        </div>

        <h3 className="text-xl font-bold text-slate-900">Request Information & Brochure</h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Receive the 2026 Crescent Developments Portfolio Lookbook including floor plans, master plans, and price lists.
        </p>

        {downloadComplete ? (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
            <Check className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
            <p className="text-xs font-semibold text-emerald-800">Brochure Packet Sent!</p>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              Check your inbox at {email} for the high-res architectural lookbook.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleDownloadBrochure} className="mt-5 space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-[#c69a68]"
              />
            </div>

            <button
              type="submit"
              disabled={downloading}
              className="w-full py-2.5 bg-[#c69a68] hover:bg-[#b88c58] text-white text-xs sm:text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2"
            >
              {downloading ? 'Preparing Portfolio...' : 'Download Digital Lookbook (PDF)'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onInquire: (projectName: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onInquire,
}) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative border border-slate-100 max-h-[94vh] sm:max-h-[92vh] flex flex-col">
        {/* Header Image */}
        <div className="relative w-full h-44 sm:h-64 bg-slate-900 shrink-0 overflow-hidden">
          <img
            src={project.image}
            alt={project.name}
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-950/60 hover:bg-slate-950/80 text-white p-2 rounded-full backdrop-blur-xs transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-sm px-3.5 py-1.5 rounded-md text-white text-xs font-semibold">
            {project.price}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-7 overflow-y-auto flex-1 min-h-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-[#c69a68] uppercase font-mono">
                {project.category} Collection
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{project.name}</h3>
              <p className="text-sm text-slate-500">{project.subtitle}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs text-slate-400 block font-mono">Target Delivery</span>
              <span className="text-xs font-bold text-slate-800">{project.completion}</span>
            </div>
          </div>

          <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {project.description}
          </p>

          {/* Quick Specifications */}
          <div className="mt-5 grid grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-100 text-center">
            <div>
              <span className="block text-[11px] text-slate-400 font-mono uppercase">Bedrooms</span>
              <span className="text-xs sm:text-sm font-bold text-slate-800">{project.beds}</span>
            </div>
            <div>
              <span className="block text-[11px] text-slate-400 font-mono uppercase">Living Area</span>
              <span className="text-xs sm:text-sm font-bold text-slate-800">{project.sqft}</span>
            </div>
            <div>
              <span className="block text-[11px] text-slate-400 font-mono uppercase">Location</span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 truncate px-1">
                {project.location}
              </span>
            </div>
          </div>

          {/* Key Amenities */}
          <div className="mt-5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Signature Amenities
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {project.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-[#c69a68] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-md"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onInquire(project.name);
              }}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#c69a68] hover:bg-[#b88c58] rounded-md transition-colors"
            >
              Inquire About {project.name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
