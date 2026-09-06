import React from 'react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B272D] text-white pt-20 pb-12 px-4 sm:px-6 lg:px-8 border-t border-[#FFFFFF]/10 relative overflow-hidden font-sans">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#5A9696]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
        
        {/* Monogram */}
        <div className="space-y-2">
          <span className="font-script text-5xl sm:text-6xl text-[#D6E4BA]">
            Shweta & Abhinav
          </span>
          <p className="text-xs tracking-[0.3em] uppercase text-[#BBDB93] font-semibold">
            07 · NOVEMBER · 2026 · GHAZIABAD
          </p>
        </div>

        {/* Romantic Quote */}
        <p className="font-serif-display text-xl sm:text-2xl text-[#E0E8E5]/90 italic max-w-lg mx-auto leading-relaxed">
          “Together with their families, we invite you to celebrate this joyous union and make memories that will last a lifetime.”
        </p>

        {/* Quick Nav */}
        <div className="flex flex-wrap justify-center gap-6 text-xs uppercase tracking-wider font-semibold text-[#E0E8E5]/70 pt-4">
          <a href="#hero" className="hover:text-[#BBDB93] transition-colors">Home</a>
          <a href="#save-the-date" className="hover:text-[#BBDB93] transition-colors">Save The Date</a>
          <a href="#itinerary" className="hover:text-[#BBDB93] transition-colors">Itinerario</a>
          <a href="#dress-code" className="hover:text-[#BBDB93] transition-colors">Dress Code</a>
          <a href="#venue" className="hover:text-[#BBDB93] transition-colors">Venue</a>
          <a href="#rsvp" className="hover:text-[#BBDB93] transition-colors">Confirm RSVP</a>
        </div>

        {/* Back to top button */}
        <div className="pt-6">
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-[#FFFFFF]/10 hover:bg-[#BBDB93] hover:text-[#0B272D] text-white flex items-center justify-center mx-auto transition-all shadow-md text-sm"
            aria-label="Back to top"
          >
            ↑
          </button>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 border-t border-[#FFFFFF]/10 text-[10px] text-[#E0E8E5]/50 tracking-wider">
          BOTANICAL SPRING EDITION • WEDDING CELEBRATION & RSVP DESIGN SYSTEM
        </div>

      </div>
    </footer>
  );
};
