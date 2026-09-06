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

  // Hero Background Slideshow with Spectacular Ken Burns Transition
  const heroImages = [
    '/images/heroImage1.webp',
    '/images/heroImage2.webp',
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6500);
    return () => clearInterval(imageInterval);
  }, [heroImages.length]);

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
    const title = encodeURIComponent("Casamiento de Mariana & Carlos");
    const details = encodeURIComponent("Acompáñanos a celebrar el casamiento de Mariana y Carlos en Complejo Nautico Ullum.");
    const location = encodeURIComponent("Salon Complejo Nautico Ullum, San Juan");
    const dates = "20261107T210000Z/20261108T050000Z";
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    window.open(googleUrl, '_blank');
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-between items-center text-center overflow-hidden pt-28 pb-16 bg-[#0B272D00]">
      {/* Spectacular Ken Burns Background Slideshow */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {heroImages.map((src, index) => {
          const isActive = index === currentImageIndex;
          return (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${isActive ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <img
                src={src}
                alt="Mariana & Carlos"
                className={`w-full h-full object-cover object-center transform transition-transform duration-[8000ms] ease-out ${isActive ? 'scale-110 translate-y-[-1%]' : 'scale-100'
                  }`}
              />
            </div>
          );
        })}
      </div>

      {/* Cinematic Vignette & Botanical Darkness Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B272D]/40 via-[#0B272D]/40 to-[#0B272D] z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent via-[#0B272D]/40 to-[#0B272D]/90 z-0 pointer-events-none" />

      {/* Decorative Botanical Elements & Gradient Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#BBDB93]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#5A9696]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center">

        {/* Countdown Timer Container (Translucent Glassmorphism) */}
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-black/30 border border-[#D6E4BA]/40 backdrop-blur-md text-[#D6E4BA] text-xs font-semibold tracking-widest uppercase mb-8 shadow-lg animate-fade-in font-sans">
          <span>🌿</span>
          <span className="drop-shadow-sm">{timeLeft.days} DÍAS • {timeLeft.hours} HORAS • {timeLeft.minutes} MIN • {timeLeft.seconds} SEG</span>
        </div>

        {/* Script Intro */}
        <p className="font-script text-2xl sm:text-3xl lg:text-4xl text-[#D6E4BA] mb-3 font-normal max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          Ven y celebra con nosotros el casamiento de
        </p>

        {/* Couple Title */}
        <h1 className="font-serif-display text-5xl sm:text-7xl lg:text-8xl font-semibold text-white tracking-tight leading-[1.05] mb-6 drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]">
          Mariana <span className="font-script text-4xl sm:text-6xl text-[#BBDB93] font-normal">&</span> Carlos
        </h1>

        {/* Botanical Flourish */}
        <div className="flex items-center gap-3 text-[#BBDB93]/90 mb-8 font-sans drop-shadow-md">
          <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#BBDB93]/80" />
          <span className="text-sm">🌿 — ✦ — 🌿</span>
          <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#BBDB93]/80" />
        </div>


        {/* Lower Controls Container - positioned further down to reveal background */}
        <div className="LoweControl sm:mt-28 lg:mt-36 flex flex-col items-center w-full">

          {/* Event Quick-Info Pill - Hidden on Mobile, Glassmorphic on Desktop */}
          <div className="hidden sm:flex bg-black/30 backdrop-blur-md text-white rounded-full py-2.5 px-8 flex-row items-center gap-8 shadow-2xl border border-white/20 mb-8 font-sans transition-all">
            <div className="text-left">
              <p className="text-xs sm:text-sm font-bold text-white leading-tight drop-shadow-sm">
                Sábado, 7 de Noviembre de 2026
              </p>
              <p className="text-[10px] text-[#D6E4BA] tracking-wider uppercase font-semibold">
                CEREMONIA & VOTOS
              </p>
            </div>

            <div className="w-[1px] h-8 bg-white/25" />

            <div className="text-left">
              <p className="text-xs sm:text-sm font-bold text-white leading-tight drop-shadow-sm">
                21:00 HRS • Salón Complejo Nautico Ullum
              </p>
              <p className="text-[10px] text-[#D6E4BA] tracking-wider uppercase font-semibold">
                RECEPCIÓN & FIESTA
              </p>
            </div>
          </div>

          {/* Hero Action CTA Group */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center font-sans mb-8">
            <a
              href="#rsvp"
              className="inline-flex items-center justify-center bg-[#BBDB93]/90 hover:bg-[#BBDB93] text-[#0B272D] font-bold text-xs sm:text-sm tracking-widest uppercase px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl backdrop-blur-sm"
            >
              CONFIRMAR ASISTENCIA
            </a>
            <button
              onClick={handleAddToCalendar}
              className="inline-flex items-center justify-center bg-black/30 hover:bg-black/50 text-white border border-white/40 font-semibold text-xs sm:text-sm tracking-wider uppercase px-7 py-4 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg"
            >
              AGENDAR EN CALENDARIO
            </button>
          </div>

          {/* Slideshow Indicator Dots */}
          <div className="flex items-center justify-center gap-2.5">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                className={`rounded-full transition-all duration-700 ${i === currentImageIndex
                  ? 'w-8 h-2 bg-[#BBDB93] shadow-[0_0_8px_#BBDB93]'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                  }`}
                aria-label={`Foto ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Know More (1:1 from casamiento.pen Frame 1) */}
      <div className="relative z-10 flex flex-col items-center gap-1 text-[#E0E8E5]/70 text-xs tracking-widest uppercase mt-4 font-sans">
        <span className="text-[10px] font-semibold text-[#BBDB93]">CONOCE MÁS</span>
        <span className="text-sm text-[#BBDB93] animate-bounce">⌵</span>
        <span className="text-[9px] text-[#E0E8E5]/50 tracking-wider">Desliza para explorar la celebración</span>
      </div>
    </section>
  );
};
