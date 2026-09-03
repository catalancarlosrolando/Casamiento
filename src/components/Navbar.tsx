import React, { useState, useEffect } from 'react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '#hero' },
    { name: 'SAVE THE DATE', href: '#save-the-date' },
    { name: 'DRESS CODE', href: '#dress-code' },
    { name: 'VENUE', href: '#venue' },
    { name: 'RSVP', href: '#rsvp' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans ${
        isScrolled
          ? 'bg-[#0B272D]/95 backdrop-blur-md shadow-lg border-b border-[#FFFFFF]/10 py-3'
          : 'bg-gradient-to-b from-[#0B272D]/80 via-[#0B272D]/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Monogram / Brand (1:1 from casamiento.pen Frame 1 Logo Text) */}
        <a href="#hero" className="group flex items-center gap-3 text-white">
          <span className="font-script text-3xl sm:text-4xl text-[#D6E4BA] group-hover:text-white transition-colors">
            S & A
          </span>
          <span className="hidden sm:inline-block text-[10px] tracking-[0.25em] font-medium text-[#E0E8E5]/80 uppercase border-l border-[#FFFFFF]/20 pl-3">
            07 · NOV · 2026
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs tracking-[0.15em] uppercase font-semibold text-[#E0E8E5]/90 hover:text-[#BBDB93] transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#rsvp"
            className="bg-[#BBDB93] hover:bg-[#d6e4ba] text-[#0B272D] text-xs font-bold tracking-wider uppercase px-5 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-sm"
          >
            CONFIRM RSVP
          </a>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white hover:text-[#BBDB93] focus:outline-none"
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B272D] border-b border-[#FFFFFF]/10 px-6 py-6 space-y-4 animate-in fade-in duration-200">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm tracking-wider uppercase font-semibold text-[#E0E8E5] hover:text-[#BBDB93]"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#rsvp"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-center bg-[#BBDB93] text-[#0B272D] text-xs font-bold tracking-widest uppercase py-3 rounded-full"
          >
            CONFIRM RSVP
          </a>
        </div>
      )}
    </header>
  );
};
