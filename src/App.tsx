import React from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SaveTheDateSection } from './components/SaveTheDateSection';
import { DressCodeSection } from './components/DressCodeSection';
import { VenueSection } from './components/VenueSection';
import { RsvpSection } from './components/RsvpSection';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#E0E8E5] text-[#1D373C] flex flex-col selection:bg-[#BBDB93] selection:text-[#0B272D]">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <SaveTheDateSection />
        <DressCodeSection />
        <VenueSection />
        <RsvpSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;
