import React, { useState } from 'react';

export const VenueSection: React.FC = () => {
  const [activePhoto, setActivePhoto] = useState(1); // 0-indexed: 1 is Dot2Active as in Frame 7

  interface VenueSlide {
    title: string;
    subtitle: string;
    icon: string;
    tag: string;
    image?: string;
    bgGradient: string;
  }

  const venueSlides: VenueSlide[] = [
    {
      title: 'Jardín & Espacio para disfrutar',
      subtitle: 'Área al aire libre para el intercambio de votos rodeada de vegetación natural.',
      icon: '🌿',
      tag: 'CEREMONIA',
      image: '/images/Salon-fuera.webp',
      bgGradient: 'from-[#13383F] via-[#183B42] to-[#0B272D]',
    },
    {
      title: 'Salón de Eventos',
      subtitle: 'Salón principal con iluminación cálida, ventanales panorámicos y pista de baile.',
      icon: '🏰',
      tag: 'RECEPCIÓN & FIESTA',
      image: '/images/Salonfiesta.webp',
      bgGradient: 'from-[#0B272D] via-[#183B42] to-[#13383F]',
    },
    {
      title: 'Barra para una noche Fantástica',
      subtitle: 'Espacio de bienvenida para el brindis al anochecer y barra de tragos.',
      icon: '🥂',
      tag: 'Tragos',
      image: '/images/barra.webp',
      bgGradient: 'from-[#213B36] via-[#183B42] to-[#0B272D]',
    },
  ];

  const handleOpenGoogleMaps = () => {
    window.open('https://maps.app.goo.gl/o1Gp52L7mBvscUoHA', '_blank');
  };

  const handlePrev = () => {
    setActivePhoto((prev) => (prev === 0 ? venueSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActivePhoto((prev) => (prev === venueSlides.length - 1 ? 0 : prev + 1));
  };

  const currentSlide = venueSlides[activePhoto];

  return (
    <section id="venue" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#E0E8E5] relative">
      <div className="max-w-[1280px] mx-auto">

        {/* Section Header (1:1 from casamiento.pen Frame 7) */}
        <div className="text-center mb-14">
          <span className="text-[#5A9696] font-semibold text-xs tracking-[0.25em] uppercase block mb-3 font-sans">
            LUGAR & CÓMO LLEGAR
          </span>
          <h2 className="font-serif-display text-4xl sm:text-5xl font-semibold text-[#0B272D] mb-4">
            Ubicación del Evento
          </h2>
          <p className="text-[#1D373C] text-sm sm:text-base max-w-2xl mx-auto font-sans">
            Descubre el lugar donde celebraremos nuestro casamiento. Aquí encontrarás fotos del recinto, un mapa interactivo y datos de acceso.
          </p>
        </div>

        {/* Two-Column Layout (1:1 from casamiento.pen Frame 7) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Gallery Carousel (640px × 560px on desktop) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="w-full h-[480px] sm:h-[560px] rounded-2xl bg-[#183B42] border border-[#0B272D]/20 shadow-xl overflow-hidden relative flex flex-col justify-between p-8 text-white group">

              {/* Background Image or Gradient */}
              {currentSlide.image ? (
                <>
                  <img
                    src={currentSlide.image}
                    alt={currentSlide.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B272D]/95 via-[#0B272D]/50 to-[#0B272D]/30 pointer-events-none" />
                </>
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${currentSlide.bgGradient}`} />
              )}

              {/* Top Tag */}
              <div className="flex items-center justify-between z-10">
                <span className="bg-[#D6E4BA] text-[#0B272D] text-[10px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full shadow-sm font-sans">
                  {currentSlide.tag}
                </span>
                <span className="text-2xl">{currentSlide.icon}</span>
              </div>

              {/* Graphic Venue Representation */}
              <div className="my-auto text-center z-10 py-6">
                {!currentSlide.image && (
                  <div className="w-24 h-24 mx-auto rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-5xl mb-4 shadow-inner">
                    {currentSlide.icon}
                  </div>
                )}
                <h3 className="font-serif-display text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight drop-shadow-md">
                  {currentSlide.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#E0E8E5]/90 max-w-md mx-auto leading-relaxed font-sans drop-shadow-sm">
                  {currentSlide.subtitle}
                </p>
              </div>

              {/* Carousel Controls Bottom (1:1 from casamiento.pen Frame 7) */}
              <div className="flex items-center justify-between pt-6 border-t border-white/15 z-10">
                <button
                  onClick={handlePrev}
                  className="w-11 h-11 rounded-full bg-white text-[#0B272D] border-[1.5px] border-[#5A9696] flex items-center justify-center text-base font-semibold hover:bg-[#BBDB93] transition-colors shadow-md"
                  aria-label="Foto anterior"
                >
                  ←
                </button>

                {/* Pagination Dots Frame */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActivePhoto(0)}
                    className={`rounded-full transition-all ${activePhoto === 0 ? 'w-7 h-3 bg-[#BBDB93] border border-[#0B272D]' : 'w-3 h-3 bg-[#0B272D]/30'
                      }`}
                    aria-label="Foto 1"
                  />
                  <button
                    onClick={() => setActivePhoto(1)}
                    className={`rounded-full transition-all ${activePhoto === 1 ? 'w-7 h-3 bg-[#BBDB93] border border-[#0B272D]' : 'w-3 h-3 bg-[#0B272D]/30'
                      }`}
                    aria-label="Foto 2"
                  />
                  <button
                    onClick={() => setActivePhoto(2)}
                    className={`rounded-full transition-all ${activePhoto === 2 ? 'w-7 h-3 bg-[#BBDB93] border border-[#0B272D]' : 'w-3 h-3 bg-[#0B272D]/30'
                      }`}
                    aria-label="Foto 3"
                  />
                </div>

                <button
                  onClick={handleNext}
                  className="w-11 h-11 rounded-full bg-white text-[#0B272D] border-[1.5px] border-[#5A9696] flex items-center justify-center text-base font-semibold hover:bg-[#BBDB93] transition-colors shadow-md"
                  aria-label="Foto siguiente"
                >
                  →
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Map, Travel Pill, Chips, Venue Info, CTA (560px on desktop) */}
          <div className="lg:col-span-6 flex flex-col space-y-4">

            {/* 1. Map Placeholder / Interactive Map Box */}
            <div className="w-full h-[300px] sm:h-[340px] rounded-xl bg-[#E0E8E5] border border-[#0B272D]/20 overflow-hidden relative shadow-md flex items-center justify-center">
              <iframe
                title="Google Map Venue Location"
                src="https://maps.google.com/maps?q=-31.4421686,-68.6603381&hl=es&z=14&output=embed"
                className="w-full h-full border-0 filter saturate-90 contrast-95"
                loading="lazy"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#0B272D]/10 text-[10px] font-bold text-[#0B272D] tracking-wider uppercase font-sans shadow-sm">
                📍 MAPA EN VIVO
              </div>
            </div>

            {/* 2. Travel Pill */}
            <div className="w-full h-12 rounded-full bg-[#0B272D] px-6 flex items-center text-white text-xs font-semibold tracking-wide shadow-md font-sans">
              <span className="truncate">⏱️ ~31 min desde el centro</span>
            </div>

            {/* 3. Chips Row (Ceremonia, Recepción, Estacionamiento) */}
            <div className="w-full h-10 rounded-full bg-white border border-[#0B272D]/15 px-4 flex items-center gap-3 shadow-sm font-sans">
              <span className="bg-[#0B272D] text-white text-[11px] font-semibold px-4 py-1 rounded-full">
                Ceremonia
              </span>
              <span className="bg-[#0B272D] text-white text-[11px] font-semibold px-4 py-1 rounded-full">
                Recepción
              </span>
              <span className="bg-[#0B272D] text-white text-[11px] font-semibold px-4 py-1 rounded-full">
                Estacionamiento
              </span>
            </div>

            {/* 4. Venue Info Card */}
            <div className="w-full rounded-xl bg-white border border-[#0B272D]/15 p-5 sm:p-6 shadow-md font-sans space-y-2">
              <h3 className="font-serif-display text-xl font-semibold text-[#0B272D]">
                Salón de Eventos Complejo U.N.S.J
              </h3>
              <p className="text-xs text-[#1D373C]">
                <strong>Dirección:</strong> Complejo Dique de Ullum
              </p>

              <p className="text-xs text-[#1D373C]">
                <strong>Estacionamiento:</strong> Dentro del predio
              </p>
            </div>

            {/* 5. CTA Button */}
            <button
              onClick={handleOpenGoogleMaps}
              className="w-full h-12 rounded-full bg-[#0B272D] hover:bg-[#051518] text-white text-xs font-semibold tracking-[0.1em] uppercase transition-all shadow-lg flex items-center justify-center font-sans"
            >
              VER EN GOOGLE MAPS →
            </button>

          </div>

        </div>

      </div>
    </section>
  );
};
