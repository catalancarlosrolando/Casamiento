import React, { useState, useEffect, useRef } from 'react';

export interface DressItem {
  id: string;
  tag: string;
  tagBg: string;
  tagTextColor: string;
  title: string;
  subtitle?: string;
  image?: string; // URL / asset path to upload image
  backdropColor: string;
  icon: string;
}

export const DressCodeSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const touchStartX = useRef<number | null>(null);

  const dressItems: DressItem[] = [
    {
      id: 'damas-largo',
      tag: '✨ DAMAS',
      tagBg: '#BBDB93',
      tagTextColor: '#0B272D',
      title: 'Vestido Largo de Gala',
      subtitle: 'Siluetas fluidas y tonos botánicos',
      image: './public/images/dress.webp', // Can be replaced by the user with any image URL
      backdropColor: '#0E2F37',
      icon: '👗',
    },
    {
      id: 'caballeros-traje',
      tag: 'CABALLEROS',
      tagBg: '#D6E4BA',
      tagTextColor: '#0B272D',
      title: 'Traje Formal / Clásico',
      subtitle: 'Elegancia atemporal y sobria',
      image: './public/images/suits.webp', // Can be replaced by the user with any image URL
      backdropColor: '#183B42',
      icon: '🤵',
    },
    {
      id: 'damas-midi',
      tag: 'CÓCTEL ELEGANTE',
      tagBg: '#D6E4BA',
      tagTextColor: '#0B272D',
      title: 'Vestido Cóctel / Midi',
      subtitle: 'Corte refinado y moderno',
      image: './public/images/dress1.1.jpg', // Can be replaced by the user with any image URL
      backdropColor: '#274640',
      icon: '✨',
    },
    {
      id: 'gala-blacktie',
      tag: 'ESMOQUIN / GALA',
      tagBg: '#D6E4BA',
      tagTextColor: '#0B272D',
      title: 'Esmoquin de Noche',
      subtitle: 'Distinción y presencia formal',
      image: './public/images/suits1.webp', // Can be replaced by the user with any image URL
      backdropColor: '#102A30',
      icon: '🎩',
    },
    {
      id: 'damas-jumpsuit',
      tag: 'ESTILO CONTEMPORÁNEO',
      tagBg: '#D6E4BA',
      tagTextColor: '#0B272D',
      title: 'Enterito / Mono de Fiesta',
      subtitle: 'Vanguardia y comodidad elegante',
      image: './public/images/dress1.2.jpg', // Can be replaced by the user with any image URL
      backdropColor: '#1A3338',
      icon: '💫',
    },
  ];

  const totalItems = dressItems.length;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === totalItems - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Indices for left, center, right cards
  const prevIndex = (activeIndex - 1 + totalItems) % totalItems;
  const nextIndex = (activeIndex + 1) % totalItems;

  const activeItem = dressItems[activeIndex];
  const prevItem = dressItems[prevIndex];
  const nextItem = dressItems[nextIndex];

  // Card Content Renderer (supports image or styled botanical illustration)
  const renderCardContent = (item: DressItem, isFeatured: boolean) => {
    return (
      <>
        {/* Image / Graphic Backdrop */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center transition-colors duration-500 overflow-hidden"
          style={{ backgroundColor: item.backdropColor }}
        >
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="text-center opacity-25 select-none my-auto">
              <span className={isFeatured ? 'text-9xl' : 'text-8xl'}>{item.icon}</span>
            </div>
          )}
          {/* Subtle overlay gradient to keep text readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B272D]/95 via-[#0B272D]/20 to-transparent pointer-events-none" />
        </div>

        {/* Top Tags */}
        <div className="relative z-10 p-5 sm:p-6 flex items-center justify-between">
          <span
            className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full shadow-md font-sans"
            style={{ backgroundColor: item.tagBg, color: item.tagTextColor }}
          >
            {item.tag}
          </span>
          <button
            onClick={(e) => toggleLike(item.id, e)}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${likedItems[item.id]
              ? 'bg-[#BBDB93] text-[#0B272D]'
              : 'bg-white/80 text-[#0B272D] hover:bg-white'
              }`}
            aria-label="Guardar"
          >
            <span className="text-base sm:text-lg leading-none">♥</span>
          </button>
        </div>

        {/* Center Script/Subheading Accent */}
        {item.subtitle && (
          <div className="relative z-10 text-center px-4 py-2">
            <p className="font-script text-[24px] sm:text-[28px] text-[#D6E4BA] drop-shadow-md">
              “{item.subtitle}”
            </p>
          </div>
        )}

        {/* Bottom Frosted Overlay */}
        <div className="relative z-10 p-5 sm:p-6 rounded-b-[20px] bg-[#0B272D]/90 backdrop-blur-md border-t border-[#BBDB93]/30">
          <h3 className="font-serif-display text-xl sm:text-2xl font-semibold text-white leading-snug">
            {item.title}
          </h3>
          <span className="text-[11px] text-[#BBDB93] font-medium tracking-wider uppercase block mt-1">
            Ejemplo de Inspiración
          </span>
        </div>
      </>
    );
  };

  return (
    <section id="dress-code" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0B272D] text-white border-y border-[#FFFFFF]/10 relative select-none overflow-hidden">
      {/* Decorative Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#5A9696]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">

        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-14">
          <span className="text-[#BBDB93] font-semibold text-xs tracking-[0.25em] uppercase block mb-3 font-sans">
            CÓDIGO DE VESTIMENTA & INSPIRACIÓN
          </span>
          <h2 className="font-serif-display text-4xl sm:text-5xl font-semibold text-white mb-4">
            Inspiración de Atuendo: Elegante
          </h2>
          <p className="text-[#E0E8E5]/90 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed font-sans">
            Les compartimos algunas ideas de inspiración para la celebración. Lo más importante para nosotros es que vengan con ganas de disfrutar, festejar y bailar juntos toda la noche.
          </p>
        </div>

        {/* ============================================================ */}
        {/* DESKTOP COVERFLOW CAROUSEL (3-Card 3D Stage) */}
        {/* ============================================================ */}
        <div className="hidden md:flex justify-center items-center relative mb-12 min-h-[600px]">
          <div className="w-full max-w-[1100px] flex items-center justify-center gap-6 lg:gap-8 relative">

            {/* 1. LEFT CARD (Previous) */}
            <div
              onClick={handlePrev}
              className="w-[320px] h-[520px] rounded-[20px] relative overflow-hidden shadow-xl border border-[#5A9696]/25 bg-[#13383F] flex flex-col justify-between p-0 transition-all duration-500 transform hover:scale-[1.02] cursor-pointer opacity-80 hover:opacity-100 shrink-0 group"
              title={`Ver ${prevItem.title}`}
            >
              {renderCardContent(prevItem, false)}
            </div>

            {/* 2. CENTER CARD (Active Featured - 380px × 580px) */}
            <div
              className="w-[380px] h-[580px] rounded-[20px] relative overflow-hidden shadow-2xl border-2 border-[#BBDB93] bg-[#0B272D] flex flex-col justify-between p-0 transition-all duration-500 z-20 shrink-0 group"
            >
              {renderCardContent(activeItem, true)}
            </div>

            {/* 3. RIGHT CARD (Next) */}
            <div
              onClick={handleNext}
              className="w-[320px] h-[520px] rounded-[20px] relative overflow-hidden shadow-xl border border-[#5A9696]/25 bg-[#213B36] flex flex-col justify-between p-0 transition-all duration-500 transform hover:scale-[1.02] cursor-pointer opacity-80 hover:opacity-100 shrink-0 group"
              title={`Ver ${nextItem.title}`}
            >
              {renderCardContent(nextItem, false)}
            </div>

          </div>
        </div>

        {/* ============================================================ */}
        {/* MOBILE CAROUSEL CARD */}
        {/* ============================================================ */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="md:hidden flex flex-col items-center mb-8"
        >
          <div className="w-full max-w-[350px] h-[520px] rounded-[20px] relative overflow-hidden shadow-2xl border-2 border-[#BBDB93] bg-[#0B272D] flex flex-col justify-between p-0 transition-all duration-300">
            {renderCardContent(activeItem, true)}
          </div>
        </div>

        {/* ============================================================ */}
        {/* CAROUSEL CONTROLS */}
        {/* ============================================================ */}
        <div className="flex items-center justify-center gap-5 sm:gap-6 mb-12">
          <button
            onClick={handlePrev}
            className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#BBDB93] text-white hover:text-[#0B272D] border border-white/20 flex items-center justify-center text-base font-semibold active:scale-95 transition-all shadow-sm backdrop-blur-sm"
            aria-label="Atuendo anterior"
          >
            ←
          </button>

          {/* Pagination Dots */}
          <div className="flex items-center gap-2.5 px-2">
            {dressItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`rounded-full transition-all duration-300 ${i === activeIndex
                  ? 'w-7 sm:w-8 h-3.5 bg-[#BBDB93] border border-white/60 shadow-sm'
                  : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'
                  }`}
                aria-label={`Ir a la opción ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#BBDB93] text-white hover:text-[#0B272D] border border-white/20 flex items-center justify-center text-base font-semibold active:scale-95 transition-all shadow-sm backdrop-blur-sm"
            aria-label="Atuendo siguiente"
          >
            →
          </button>
        </div>

        {/* ============================================================ */}
        {/* CELEBRATION ADVICE CARD */}
        {/* ============================================================ */}
        <div className="max-w-[780px] mx-auto bg-[#13383F]/80 backdrop-blur-md rounded-2xl sm:rounded-full py-4 px-6 sm:px-8 border border-[#5A9696]/40 shadow-lg text-center">
          <h4 className="text-xs sm:text-sm font-semibold text-[#D6E4BA] mb-1 font-sans">
            🌿 Consejo para la Celebración
          </h4>
          <p className="text-[11px] sm:text-xs text-[#E0E8E5]/90 font-normal leading-relaxed font-sans">
            La recepción y los brindis se desarrollarán en espacios verdes y jardines al aire libre. Sugerimos calzado cómodo con taco ancho o plataformas para bailar y disfrutar sin preocupaciones.
          </p>
        </div>

      </div>
    </section>
  );
};
