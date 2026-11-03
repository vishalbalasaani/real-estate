import React from 'react';
import { X, Award, ShieldCheck, Leaf, Compass } from 'lucide-react';

interface AboutStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContactSales: () => void;
}

export const AboutStoryModal: React.FC<AboutStoryModalProps> = ({
  isOpen,
  onClose,
  onContactSales,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-8 shadow-2xl relative border border-slate-100 max-h-[94vh] sm:max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-[11px] font-bold tracking-widest text-[#c69a68] uppercase font-mono">
          Our Heritage & Craft
        </span>
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
          The Crescent Philosophy
        </h3>

        <div className="mt-5 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Founded on the belief that a home should inspire every aspect of daily life,{' '}
            <strong className="text-slate-900 font-semibold">Crescent Developments</strong> has
            spearheaded award-winning architectural landmarks for over two decades.
          </p>
          <p>
            Each development is conceived through a multidisciplinary lens: marrying cutting-edge
            structural engineering, bioclimatic design, and the timeless warmth of natural
            materials. From our signature cantilevered penthouses to sustainable urban quarters,
            every residence is crafted to stand the test of generations.
          </p>
        </div>

        {/* 4 Pillars */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <Compass className="w-5 h-5 text-[#c69a68] mb-2" />
            <h4 className="text-xs font-bold text-slate-900">Prime Locations</h4>
            <p className="mt-1 text-[11px] text-slate-500 leading-normal">
              Selecting irreplaceable urban corridors and waterfront parcels with enduring value.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <Award className="w-5 h-5 text-[#c69a68] mb-2" />
            <h4 className="text-xs font-bold text-slate-900">Bespoke Design</h4>
            <p className="mt-1 text-[11px] text-slate-500 leading-normal">
              Collaborations with world-renowned architectural studios and interior artisans.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <Leaf className="w-5 h-5 text-[#c69a68] mb-2" />
            <h4 className="text-xs font-bold text-slate-900">Sustainable Future</h4>
            <p className="mt-1 text-[11px] text-slate-500 leading-normal">
              Targeting LEED Gold and Platinum standards with integrated clean energy systems.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <ShieldCheck className="w-5 h-5 text-[#c69a68] mb-2" />
            <h4 className="text-xs font-bold text-slate-900">Enduring Quality</h4>
            <p className="mt-1 text-[11px] text-slate-500 leading-normal">
              Rigorous precision inspection protocols guaranteeing decades of reliability.
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-8 flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onContactSales();
            }}
            className="px-5 py-2.5 bg-[#c69a68] hover:bg-[#b88c58] text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
          >
            Inquire with Leadership Team
          </button>
        </div>
      </div>
    </div>
  );
};
