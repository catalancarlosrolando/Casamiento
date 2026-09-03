import React, { useState, useEffect, useRef } from 'react';

interface DressItem {
  id: string;
  tag: string;
  tagBg: string;
  tagTextColor: string;
  title: string;
  quote: string;
  description: string;
  backdropColor: string;
  bgGradient: string;
  borderColor: string;
  accentBtnBg: string;
  accentBtnText: string;
  icon: string;
  tips: string[];
  colors: string[];
}

export const DressCodeSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0); // 0 = Vestido Largo (Featured center)
  const [selectedModal, setSelectedModal] = useState<DressItem | null>(null);
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const touchStartX = useRef<number | null>(null);

  const dressItems: DressItem[] = [
    {
      id: 'damas-largo',
      tag: '✨ DESTACADO • DAMAS',
      tagBg: '#BBDB93',
      tagTextColor: '#0B272D',
      title: 'Vestido Largo de Noche',
      quote: '“Siluetas fluidas y sofisticadas”',
      description: 'Vestidos largos y vaporosos con cortes elegantes, telas fluidas y accesorios sofisticados.',
      backdropColor: '#0E2F37',
      bgGradient: 'from-[#0B272D] via-[#0E2F37] to-[#0B272D]',
      borderColor: '#BBDB93',
      accentBtnBg: '#BBDB93',
      accentBtnText: '#0B272D',
      icon: '👗',
      colors: ['#0B272D', '#5A9696', '#BBDB93', '#D6E4BA', '#B8860B'],
      tips: [
        'Largo recomendado: hasta el tobillo o rozando el suelo',
        'Paleta sugerida: tonos botánicos, esmeralda, azul noche o terrosos',
        'Rogamos evitar el color blanco o marfil (reservado para la novia)',
      ],
    },
    {
      id: 'caballeros-traje',
      tag: 'CABALLEROS',
      tagBg: '#D6E4BA',
      tagTextColor: '#0B272D',
      title: 'Traje Clásico Oscuro',
      quote: '“Elegancia atemporal y sobria”',
      description: 'Traje formal o esmoquin con corbata/moño y calzado de vestir.',
      backdropColor: '#183B42',
      bgGradient: 'from-[#13383F] via-[#183B42] to-[#0B272D]',
      borderColor: '#5A969640',
      accentBtnBg: '#5A9696',
      accentBtnText: '#FFFFFF',
      icon: '🤵',
      colors: ['#0B272D', '#1A2A3A', '#2D3748', '#FFFFFF', '#5A9696'],
      tips: [
        'Traje formal completo de dos o tres piezas (negro, azul marino o marengo)',
        'Camisa clara con corbata de seda o moño formal',
        'Calzado de vestir en cuero negro o suela lustrada',
      ],
    },
    {
      id: 'damas-midi',
      tag: 'CÓCTEL ELEGANTE',
      tagBg: '#D6E4BA',
      tagTextColor: '#0B272D',
      title: 'Vestido Cóctel / Midi',
      quote: '“Corte refinado y moderno”',
      description: 'Corte refinado por debajo de la rodilla con joyería y calzado elegante.',
      backdropColor: '#274640',
      bgGradient: 'from-[#213B36] via-[#274640] to-[#0B272D]',
      borderColor: '#5A969640',
      accentBtnBg: '#5A9696',
      accentBtnText: '#FFFFFF',
      icon: '✨',
      colors: ['#5A9696', '#8FBC8F', '#D8BFD8', '#4682B4', '#2E8B57'],
      tips: [
        'Largo midi estructurado o corte vaporoso',
        'Joyería en tonos dorados o perlas naturales',
        'Chaqueta liviana o chal para la brisa de la tarde/noche',
      ],
    },
    {
      id: 'gala-blacktie',
      tag: 'BLACK TIE OPTIONAL',
      tagBg: '#D6E4BA',
      tagTextColor: '#0B272D',
      title: 'Esmoquin de Noche',
      quote: '“Distinción y presencia formal”',
      description: 'Smoking oscuro con solapa en satén brillante, camisa formal de gemelos y faja o chaleco.',
      backdropColor: '#102A30',
      bgGradient: 'from-[#051518] via-[#102A30] to-[#0B272D]',
      borderColor: '#5A969640',
      accentBtnBg: '#5A9696',
      accentBtnText: '#FFFFFF',
      icon: '🎩',
      colors: ['#051518', '#0B272D', '#FFFFFF', '#BBDB93', '#D6E4BA'],
      tips: [
        'Moño negro o en seda oscura',
        'Gemelos clásicos y reloj sobrio',
        'Puntas de cuello estructuradas para esmoquin',
      ],
    },
    {
      id: 'damas-jumpsuit',
      tag: 'ESTILO CONTEMPORÁNEO',
      tagBg: '#D6E4BA',
      tagTextColor: '#0B272D',
      title: 'Enterito / Mono de Fiesta',
      quote: '“Vanguardia y comodidad elegante”',
      description: 'Prenda entera en crepé o seda con pernera palazzo amplia, escote sofisticado y cinturón joya.',
      backdropColor: '#1A3338',
      bgGradient: 'from-[#13383F] via-[#1A3338] to-[#0B272D]',
      borderColor: '#5A969640',
      accentBtnBg: '#5A9696',
      accentBtnText: '#FFFFFF',
      icon: '💫',
      colors: ['#1D373C', '#5A9696', '#BBDB93', '#C5A059', '#D6E4BA'],
      tips: [
        'Telas estructuradas de fiesta con buena caída',
        'Tacones altos o plataformas elegantes',
        'Aros colgantes o collar protagonista',
      ],
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
      if (selectedModal) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedModal]);

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

  return (
    <section id="dress-code" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#E0E8E5] relative select-none">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Section Header (1:1 from casamiento.pen Frame 5) */}
        <div className="text-center mb-12 sm:mb-14">
          <span className="text-[#5A9696] font-semibold text-xs tracking-[0.25em] uppercase block mb-3 font-sans">
            DRESS CODE & STYLE GUIDE
          </span>
          <h2 className="font-serif-display text-4xl sm:text-5xl font-semibold text-[#0B272D] mb-4">
            Código de Vestimenta: Formal
          </h2>
          <p className="text-[#1D373C] text-sm sm:text-base max-w-3xl mx-auto leading-relaxed font-sans">
            Para celebrar juntos esta noche especial, sugerimos atuendos formales y elegantes (traje para caballeros y vestidos de fiesta para damas). Rogamos reservar el blanco para la novia.
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
              className="w-[320px] h-[520px] rounded-[20px] relative overflow-hidden shadow-xl border border-[#5A9696]/25 bg-[#13383F] flex flex-col justify-between p-0 transition-all duration-500 transform hover:scale-[1.02] cursor-pointer opacity-85 hover:opacity-100 shrink-0"
              title={`Ver ${prevItem.title}`}
            >
              {/* Image Backdrop */}
              <div
                className="absolute inset-0 flex items-center justify-center transition-colors duration-500"
                style={{ backgroundColor: prevItem.backdropColor }}
              >
                <div className="text-center opacity-25 select-none">
                  <span className="text-8xl">{prevItem.icon}</span>
                </div>
              </div>

              {/* Top Tags */}
              <div className="relative z-10 p-5 flex items-center justify-between">
                <span
                  className="text-[10px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full shadow-sm font-sans"
                  style={{ backgroundColor: prevItem.tagBg, color: prevItem.tagTextColor }}
                >
                  {prevItem.tag}
                </span>
                <button
                  onClick={(e) => toggleLike(prevItem.id, e)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    likedItems[prevItem.id]
                      ? 'bg-[#BBDB93] text-[#0B272D]'
                      : 'bg-white/70 text-[#0B272D] hover:bg-white'
                  }`}
                  aria-label="Guardar"
                >
                  <span className="text-base leading-none">♥</span>
                </button>
              </div>

              {/* Bottom Frosted Overlay */}
              <div className="relative z-10 p-6 rounded-b-[20px] bg-[#0B272D]/90 backdrop-blur-md border-t border-[#5A9696]/30 flex items-end justify-between">
                <div className="pr-3">
                  <h3 className="font-serif-display text-[22px] font-semibold text-white leading-snug mb-1">
                    {prevItem.title}
                  </h3>
                  <p className="text-xs text-[#E0E8E5] leading-relaxed font-sans line-clamp-2">
                    {prevItem.description}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedModal(prevItem);
                  }}
                  className="w-11 h-11 rounded-full bg-[#5A9696] hover:bg-[#477878] text-white flex items-center justify-center text-lg font-bold shrink-0 transition-all shadow-md hover:scale-110"
                  title="Expandir detalles"
                >
                  ⤢
                </button>
              </div>
            </div>

            {/* 2. CENTER CARD (Active Featured - 380px × 580px) */}
            <div
              onClick={() => setSelectedModal(activeItem)}
              className="w-[380px] h-[580px] rounded-[20px] relative overflow-hidden shadow-2xl border-2 border-[#BBDB93] bg-[#0B272D] flex flex-col justify-between p-0 transition-all duration-500 transform hover:scale-[1.02] cursor-pointer z-20 shrink-0"
            >
              {/* Image Backdrop + Sheen */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center transition-colors duration-500"
                style={{ backgroundColor: activeItem.backdropColor }}
              >
                <div className="absolute inset-0 bg-[#5A9696]/10" />
                <div className="text-center opacity-25 select-none my-auto">
                  <span className="text-9xl">{activeItem.icon}</span>
                </div>
              </div>

              {/* Top Tags */}
              <div className="relative z-10 p-6 flex items-center justify-between">
                <span
                  className="text-[11px] font-bold tracking-widest uppercase px-4 py-2 rounded-full shadow-md font-sans transition-all duration-300"
                  style={{ backgroundColor: activeItem.tagBg, color: activeItem.tagTextColor }}
                >
                  {activeItem.tag}
                </span>
                <button
                  onClick={(e) => toggleLike(activeItem.id, e)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    likedItems[activeItem.id]
                      ? 'bg-[#BBDB93] text-[#0B272D]'
                      : 'bg-white text-[#0B272D] hover:bg-[#D6E4BA]'
                  }`}
                  aria-label="Guardar"
                >
                  <span className="text-lg leading-none">♥</span>
                </button>
              </div>

              {/* Center Script Accent */}
              <div className="relative z-10 text-center px-6 py-4">
                <p className="font-script text-[28px] lg:text-[32px] text-[#D6E4BA] drop-shadow-md">
                  {activeItem.quote}
                </p>
              </div>

              {/* Bottom Frosted Overlay */}
              <div className="relative z-10 p-6 rounded-b-[20px] bg-[#0B272D]/95 backdrop-blur-md border-t border-[#BBDB93]/30 flex items-end justify-between">
                <div className="pr-4">
                  <h3 className="font-serif-display text-[24px] font-semibold text-white leading-snug mb-1.5">
                    {activeItem.title}
                  </h3>
                  <p className="text-xs text-[#E0E8E5] leading-relaxed font-sans">
                    {activeItem.description}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedModal(activeItem);
                  }}
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0 transition-all shadow-lg hover:scale-110"
                  style={{ backgroundColor: activeItem.accentBtnBg, color: activeItem.accentBtnText }}
                  title="Expandir detalles"
                >
                  ⤢
                </button>
              </div>
            </div>

            {/* 3. RIGHT CARD (Next) */}
            <div
              onClick={handleNext}
              className="w-[320px] h-[520px] rounded-[20px] relative overflow-hidden shadow-xl border border-[#5A9696]/25 bg-[#213B36] flex flex-col justify-between p-0 transition-all duration-500 transform hover:scale-[1.02] cursor-pointer opacity-85 hover:opacity-100 shrink-0"
              title={`Ver ${nextItem.title}`}
            >
              {/* Image Backdrop */}
              <div
                className="absolute inset-0 flex items-center justify-center transition-colors duration-500"
                style={{ backgroundColor: nextItem.backdropColor }}
              >
                <div className="text-center opacity-25 select-none">
                  <span className="text-8xl">{nextItem.icon}</span>
                </div>
              </div>

              {/* Top Tags */}
              <div className="relative z-10 p-5 flex items-center justify-between">
                <span
                  className="text-[10px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full shadow-sm font-sans"
                  style={{ backgroundColor: nextItem.tagBg, color: nextItem.tagTextColor }}
                >
                  {nextItem.tag}
                </span>
                <button
                  onClick={(e) => toggleLike(nextItem.id, e)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    likedItems[nextItem.id]
                      ? 'bg-[#BBDB93] text-[#0B272D]'
                      : 'bg-white/70 text-[#0B272D] hover:bg-white'
                  }`}
                  aria-label="Guardar"
                >
                  <span className="text-base leading-none">♥</span>
                </button>
              </div>

              {/* Bottom Frosted Overlay */}
              <div className="relative z-10 p-6 rounded-b-[20px] bg-[#0B272D]/90 backdrop-blur-md border-t border-[#5A9696]/30 flex items-end justify-between">
                <div className="pr-3">
                  <h3 className="font-serif-display text-[22px] font-semibold text-white leading-snug mb-1">
                    {nextItem.title}
                  </h3>
                  <p className="text-xs text-[#E0E8E5] leading-relaxed font-sans line-clamp-2">
                    {nextItem.description}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedModal(nextItem);
                  }}
                  className="w-11 h-11 rounded-full bg-[#5A9696] hover:bg-[#477878] text-white flex items-center justify-center text-lg font-bold shrink-0 transition-all shadow-md hover:scale-110"
                  title="Expandir detalles"
                >
                  ⤢
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ============================================================ */}
        {/* MOBILE CAROUSEL CARD (1:1 from casamiento.pen Frame 6) */}
        {/* ============================================================ */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="md:hidden flex flex-col items-center mb-8"
        >
          <div
            onClick={() => setSelectedModal(activeItem)}
            className="w-full max-w-[350px] h-[520px] rounded-[20px] relative overflow-hidden shadow-2xl border-2 border-[#BBDB93] bg-[#0B272D] flex flex-col justify-between p-0 transition-all duration-300"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ backgroundColor: activeItem.backdropColor }}
            >
              <div className="absolute inset-0 bg-[#5A9696]/10" />
              <div className="text-center opacity-30 select-none">
                <span className="text-8xl">{activeItem.icon}</span>
              </div>
            </div>

            {/* Top Tags */}
            <div className="relative z-10 p-5 flex items-center justify-between">
              <span
                className="text-[10px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full shadow-md font-sans"
                style={{ backgroundColor: activeItem.tagBg, color: activeItem.tagTextColor }}
              >
                {activeItem.tag}
              </span>
              <button
                onClick={(e) => toggleLike(activeItem.id, e)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  likedItems[activeItem.id]
                    ? 'bg-[#BBDB93] text-[#0B272D]'
                    : 'bg-white text-[#0B272D]'
                }`}
                aria-label="Guardar"
              >
                <span className="text-base leading-none">♥</span>
              </button>
            </div>

            {/* Center Script Accent */}
            <div className="relative z-10 text-center px-4 py-2">
              <p className="font-script text-[26px] text-[#D6E4BA] drop-shadow-md">
                {activeItem.quote}
              </p>
            </div>

            {/* Bottom Frosted Overlay */}
            <div className="relative z-10 p-5 rounded-b-[20px] bg-[#0B272D]/95 backdrop-blur-md border-t border-[#BBDB93]/30 flex items-end justify-between">
              <div className="pr-3">
                <h3 className="font-serif-display text-[22px] font-semibold text-white leading-snug mb-1">
                  {activeItem.title}
                </h3>
                <p className="text-[11px] text-[#E0E8E5] leading-relaxed font-sans line-clamp-2">
                  {activeItem.description}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedModal(activeItem);
                }}
                className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold shrink-0 transition-all shadow-lg"
                style={{ backgroundColor: activeItem.accentBtnBg, color: activeItem.accentBtnText }}
                title="Expandir detalles"
              >
                ⤢
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CAROUSEL CONTROLS (Desktop & Mobile 1:1 Frame 5 & 6) */}
        {/* ============================================================ */}
        <div className="flex items-center justify-center gap-5 sm:gap-6 mb-12">
          <button
            onClick={handlePrev}
            className="w-11 h-11 rounded-full bg-white text-[#0B272D] border-[1.5px] border-[#5A9696] flex items-center justify-center text-base font-semibold hover:bg-[#BBDB93] active:scale-95 transition-all shadow-sm"
            aria-label="Anterior atuendo"
          >
            ←
          </button>

          {/* Pagination Dots */}
          <div className="flex items-center gap-2.5 px-2">
            {dressItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? 'w-7 sm:w-8 h-3.5 bg-[#BBDB93] border border-[#0B272D] shadow-sm'
                    : 'w-2.5 h-2.5 bg-[#0B272D]/25 hover:bg-[#0B272D]/50'
                }`}
                aria-label={`Ir al atuendo ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-11 h-11 rounded-full bg-white text-[#0B272D] border-[1.5px] border-[#5A9696] flex items-center justify-center text-base font-semibold hover:bg-[#BBDB93] active:scale-95 transition-all shadow-sm"
            aria-label="Siguiente atuendo"
          >
            →
          </button>
        </div>

        {/* ============================================================ */}
        {/* FOOTWEAR ADVICE CARD (Desktop & Mobile) */}
        {/* ============================================================ */}
        {/* Desktop Pill (1:1 Frame 5) */}
        <div className="hidden sm:block max-w-[780px] mx-auto bg-white rounded-full py-4 px-8 border border-[#0B272D]/15 shadow-sm text-center">
          <h4 className="text-xs font-semibold text-[#5A9696] mb-1 font-sans">
            🌿 Consejo de Calzado & Ceremonia
          </h4>
          <p className="text-[11px] text-[#1D373C] font-normal leading-normal font-sans">
            La ceremonia civil se desarrollará en el césped. Sugerimos calzado con taco ancho o plataformas para su mayor comodidad.
          </p>
        </div>

        {/* Mobile Card (1:1 Frame 6) */}
        <div className="sm:hidden max-w-[350px] mx-auto bg-white rounded-2xl p-5 border border-[#0B272D]/15 shadow-sm space-y-3 text-left">
          <h4 className="font-serif-display text-lg font-semibold text-[#0B272D]">
            🌿 Consejo de Calzado & Ceremonia
          </h4>
          <p className="text-[11px] text-[#1D373C] font-normal leading-relaxed font-sans">
            La ceremonia civil se desarrollará en el césped. Sugerimos calzado con taco ancho o plataformas para mayor comodidad y estabilidad.
          </p>
          <button
            onClick={() => setSelectedModal(activeItem)}
            className="w-full h-11 rounded-full bg-[#0B272D] hover:bg-[#051518] text-white border border-[#BBDB93] text-[11px] font-semibold tracking-wider uppercase flex items-center justify-center font-sans transition-all"
          >
            VER TABLERO DE INSPIRACIÓN →
          </button>
        </div>

      </div>

      {/* ============================================================ */}
      {/* DETAILED STYLE TIPS MODAL */}
      {/* ============================================================ */}
      {selectedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[20px] max-w-lg w-full p-6 sm:p-8 relative shadow-2xl border border-[#0B272D]/15">
            <button
              onClick={() => setSelectedModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#E0E8E5] text-[#0B272D] flex items-center justify-center font-bold hover:bg-[#BBDB93] transition-colors"
            >
              ✕
            </button>

            <span
              className="inline-block text-[10px] font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full mb-3 font-sans"
              style={{ backgroundColor: selectedModal.tagBg, color: selectedModal.tagTextColor }}
            >
              {selectedModal.tag}
            </span>

            <h3 className="font-serif-display text-3xl font-bold text-[#0B272D] mb-1">
              {selectedModal.title}
            </h3>
            {selectedModal.quote && (
              <p className="font-script text-2xl text-[#5A9696] mb-3">
                {selectedModal.quote}
              </p>
            )}

            <p className="text-xs sm:text-sm text-[#1D373C] mb-5 leading-relaxed font-sans">
              {selectedModal.description}
            </p>

            {/* Suggested Palette */}
            <div className="mb-5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#5A9696] block mb-2 font-sans">
                Paleta de Colores Sugerida:
              </span>
              <div className="flex items-center gap-2.5">
                {selectedModal.colors.map((c, i) => (
                  <span
                    key={i}
                    className="w-7 h-7 rounded-full border border-black/15 shadow-sm"
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>

            {/* Recommendations list */}
            <div className="space-y-2 mb-6 bg-[#F7FAF9] p-4 rounded-xl border border-[#0B272D]/10">
              <h5 className="text-[11px] font-bold text-[#0B272D] uppercase tracking-wider font-sans">
                Recomendaciones Clave:
              </h5>
              <ul className="space-y-1.5">
                {selectedModal.tips.map((tip, idx) => (
                  <li key={idx} className="text-xs text-[#1D373C] flex items-start gap-2 font-sans">
                    <span className="text-[#5A9696] font-bold">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setSelectedModal(null)}
              className="w-full bg-[#0B272D] hover:bg-[#051518] text-white text-xs font-semibold py-3.5 rounded-full uppercase tracking-wider transition-colors font-sans"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
