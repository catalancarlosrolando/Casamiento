import React, { useState, useEffect } from 'react';

export const HeroSection: React.FC = () => {
  // Target wedding date: Nov 7, 2026, 21:00 (from casamiento.pen)
  const targetDate = new Date('2026-11-07T21:00:00');

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCalendar = () => {
    const title = encodeURIComponent("Shweta & Abhinav's Wedding");
    const details = encodeURIComponent("Join us to celebrate the wedding ceremony of Shweta and Abhinav in Ghaziabad, India.");
    const location = encodeURIComponent("Estancia / Salón de Eventos El Paraíso, Ghaziabad, India");
    const dates = "20261107T153000Z/20261108T040000Z";
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    window.open(googleUrl, '_blank');
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-between items-center text-center overflow-hidden pt-28 pb-16 bg-[#0B272D]">
      {/* Visual Atmospheric Layers (1:1 from casamiento.pen Frame 1) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B272D]/90 via-[#13383F]/70 to-[#0B272D] z-0" />
      
      {/* Decorative Botanical Elements & Gradient Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#BBDB93]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#5A9696]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center my-auto">
        
        {/* Countdown Timer Container (1:1 from casamiento.pen Frame 1) */}
        <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0B272D]/80 border border-[#D6E4BA]/30 backdrop-blur-md text-[#D6E4BA] text-xs font-semibold tracking-widest uppercase mb-8 shadow-sm animate-fade-in font-sans">
          <span>🌿</span>
          <span>{timeLeft.days} DAYS • {timeLeft.hours} HOURS • {timeLeft.minutes} MINS</span>
        </div>

        {/* Script Intro */}
        <p className="font-script text-2xl sm:text-3xl lg:text-4xl text-[#D6E4BA] mb-3 font-normal max-w-2xl mx-auto leading-relaxed">
          Together with their families, we invite you to celebrate the marriage of
        </p>

        {/* Couple Title */}
        <h1 className="font-serif-display text-5xl sm:text-7xl lg:text-8xl font-semibold text-white tracking-tight leading-[1.05] mb-6 drop-shadow-md">
          Shweta <span className="font-script text-4xl sm:text-6xl text-[#BBDB93] font-normal">&</span> Abhinav
        </h1>

        {/* Botanical Flourish */}
        <div className="flex items-center gap-3 text-[#BBDB93]/70 mb-8 font-sans">
          <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#BBDB93]/60" />
          <span className="text-sm">🌿 — ✦ — 🌿</span>
          <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#BBDB93]/60" />
        </div>

        {/* Event Quick-Info Pill (1:1 from casamiento.pen Frame 1) */}
        <div className="bg-[#FFFFFF] text-[#0B272D] rounded-2xl sm:rounded-full p-3 sm:p-2 sm:pl-8 sm:pr-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 shadow-xl border border-[#0B272D]/10 mb-10 w-full sm:w-auto font-sans">
          <div className="text-center sm:text-left">
            <p className="text-xs sm:text-sm font-bold text-[#0B272D] leading-tight">
              Saturday, Nov 7, 2026
            </p>
            <p className="text-[10px] text-[#5A9696] tracking-wider uppercase font-semibold">
              WEDDING CEREMONY
            </p>
          </div>
          
          <div className="hidden sm:block w-[1px] h-8 bg-[#0B272D]/15" />

          <div className="text-center sm:text-left">
            <p className="text-xs sm:text-sm font-bold text-[#0B272D] leading-tight">
              09:00 PM • Ghaziabad
            </p>
            <p className="text-[10px] text-[#5A9696] tracking-wider uppercase font-semibold">
              GRAND CELEBRATION VENUE
            </p>
          </div>
        </div>

        {/* Hero Action CTA Group */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center font-sans">
          <a
            href="#rsvp"
            className="inline-flex items-center justify-center bg-[#BBDB93] hover:bg-[#d6e4ba] text-[#0B272D] font-bold text-xs sm:text-sm tracking-widest uppercase px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            CONFIRM RSVP
          </a>
          <button
            onClick={handleAddToCalendar}
            className="inline-flex items-center justify-center bg-[#FFFFFF]/15 hover:bg-[#FFFFFF]/25 text-white border border-[#FFFFFF]/30 font-semibold text-xs sm:text-sm tracking-wider uppercase px-7 py-4 rounded-full backdrop-blur-md transition-all duration-300"
          >
            ADD TO CALENDAR
          </button>
        </div>

      </div>

      {/* Scroll Indicator - Know More (1:1 from casamiento.pen Frame 1) */}
      <div className="relative z-10 flex flex-col items-center gap-1 text-[#E0E8E5]/70 text-xs tracking-widest uppercase mt-6 font-sans">
        <span className="text-[10px] font-semibold text-[#BBDB93]">KNOW MORE</span>
        <span className="text-sm text-[#BBDB93] animate-bounce">⌵</span>
        <span className="text-[9px] text-[#E0E8E5]/50 tracking-wider">Scroll to explore our story</span>
      </div>
    </section>
  );
};
