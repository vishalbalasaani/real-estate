import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroExteriorSection } from './components/HeroExteriorSection';
import { ApartmentScrollTour } from './components/ApartmentScrollTour';
import { CategoryCards } from './components/CategoryCards';
import { AboutSection } from './components/AboutSection';
import { FeaturedProjects, projectsData } from './components/FeaturedProjects';
import { Footer } from './components/Footer';
import {
  ContactSalesModal,
  RequestInfoModal,
  ProjectDetailModal,
} from './components/Modals';
import { AllDevelopmentsModal } from './components/AllDevelopmentsModal';
import { AboutStoryModal } from './components/AboutStoryModal';
import { ProjectItem } from './types';

export default function App() {
  const [contactSalesOpen, setContactSalesOpen] = useState(false);
  const [requestInfoOpen, setRequestInfoOpen] = useState(false);
  const [allDevelopmentsOpen, setAllDevelopmentsOpen] = useState(false);
  const [aboutStoryOpen, setAboutStoryOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<
    'all' | 'luxury' | 'urban' | 'waterfront'
  >('all');
  const [inquiryTargetProject, setInquiryTargetProject] = useState('Skyline Towers');

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'news') {
      setAboutStoryOpen(true);
      return;
    }
    if (sectionId === 'home' || sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (sectionId === 'interior-tour') {
      const elem = document.getElementById('interior-tour');
      if (elem) {
        window.scrollTo({
          top: elem.offsetTop,
          behavior: 'smooth',
        });
        return;
      }
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      const navOffset = 70;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleSelectCategory = (category: 'luxury' | 'urban' | 'waterfront') => {
    setActiveCategoryFilter(category);
    setAllDevelopmentsOpen(true);
  };

  const handleOpenInquiryFromProject = (projectName: string) => {
    setInquiryTargetProject(projectName);
    setContactSalesOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col selection:bg-[#c69a68] selection:text-white">
      {/* 1. Header / Top Navigation Bar */}
      <Navbar
        onOpenContactSales={() => {
          setInquiryTargetProject('General Portfolio');
          setContactSalesOpen(true);
        }}
        onNavigate={handleNavigate}
      />

      {/* 2. Main Content Flow */}
      <main className="flex-1">
        {/* Screen 1: Building Exterior Hero with smooth slide-up animation on scroll */}
        <HeroExteriorSection
          onExploreInterior={() => handleNavigate('interior-tour')}
          onRequestInfo={() => setRequestInfoOpen(true)}
        />

        {/* Screen 2: Cinematic Scrolling Interior Walkthrough */}
        <ApartmentScrollTour />

        {/* 3. Feature / Category Cards (Luxury Residences, Urban Living, Waterfront Homes) */}
        <CategoryCards onSelectCategory={handleSelectCategory} />

        {/* 4. About Crescent Section */}
        <AboutSection onLearnMore={() => setAboutStoryOpen(true)} />

        {/* 5. Featured Projects Section (Skyline Towers, Midtown Lofts, The Shoreline) */}
        <FeaturedProjects
          onSelectProject={(project) => setSelectedProject(project)}
          onViewAll={() => {
            setActiveCategoryFilter('all');
            setAllDevelopmentsOpen(true);
          }}
        />
      </main>

      {/* 6. Dark Footer Bar */}
      <Footer
        onNavigate={handleNavigate}
        onOpenContactSales={() => {
          setInquiryTargetProject('General Portfolio');
          setContactSalesOpen(true);
        }}
      />

      {/* Interactive Modals */}
      <ContactSalesModal
        isOpen={contactSalesOpen}
        onClose={() => setContactSalesOpen(false)}
        defaultProject={inquiryTargetProject}
      />

      <RequestInfoModal
        isOpen={requestInfoOpen}
        onClose={() => setRequestInfoOpen(false)}
      />

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onInquire={handleOpenInquiryFromProject}
      />

      <AllDevelopmentsModal
        isOpen={allDevelopmentsOpen}
        onClose={() => setAllDevelopmentsOpen(false)}
        onSelectProject={(project) => setSelectedProject(project)}
        initialFilter={activeCategoryFilter}
      />

      <AboutStoryModal
        isOpen={aboutStoryOpen}
        onClose={() => setAboutStoryOpen(false)}
        onContactSales={() => {
          setInquiryTargetProject('Executive Advisory');
          setContactSalesOpen(true);
        }}
      />
    </div>
  );
}
