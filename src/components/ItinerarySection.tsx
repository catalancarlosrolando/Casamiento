import React, { useState } from 'react';

interface ItineraryItem {
  id: number;
  phase: string;
  time: string;
  period: string;
  title: string;
  category: string;
  tagBg: string;
  tagTextColor: string;
  location: string;
  quote: string;
  description: string;
  highlights: string[];
  cardTheme: string;
  railGradient: string;
  iconBg: string;
  icon: React.ReactNode;
  ambientElement: React.ReactNode;
  footerText: string;
}

export const ItinerarySection: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);

  const itineraryItems: ItineraryItem[] = [
    {
      id: 1,
      phase: '01',
      time: '21:00',
      period: 'HRS',
      title: 'Recepción & Noche',
      category: '🥂 BIENVENIDA ',
      tagBg: '#D6E4BA',
      tagTextColor: '#0B272D',
      location: 'Entrada al Salon',
      quote: '“El preludio fresco de una noche mágica”',
      description: 'Llegada de invitados al anochecer y música acorde.',
      highlights: ['Bebida', 'Bocados ', 'Musica'],
      cardTheme: 'bg-gradient-to-b from-white via-[#F5F9F8] to-[#EAF2F0] border-[#5A9696]/25 hover:border-[#5A9696]',
      railGradient: 'from-[#5A9696] to-[#BBDB93]',
      iconBg: 'bg-[#E0E8E5]/80 text-[#0B272D]',
      icon: (
        <span className="text-xl">🍸</span>
      ),
      ambientElement: (
        <div className="absolute top-2 right-3 flex items-center gap-1 text-xs opacity-40 select-none pointer-events-none">
          <span className="animate-pulse">♪</span>
          <span className="text-sm animate-bounce">✨</span>
        </div>
      ),
      footerText: 'Ambiente chill & bienvenida',
    },
    {
      id: 2,
      phase: '02',
      time: '21:30',
      period: 'HRS',
      title: 'Ceremonia de Amor',
      category: '💍 AMOR',
      tagBg: '#FFE4E6',
      tagTextColor: '#9F1239',
      location: 'Salon',
      quote: '“Dos almas, una promesa eterna”',
      description: 'El instante más emotivo: El sí más importante de nuestras vidas, intercambio de alianzas doradas rodeados de las personas que amamos',
      highlights: ['El sí de toda la vida', 'Firma que sellara nuestro amor', 'Intercambio de alianzas',],
      cardTheme: 'bg-gradient-to-b from-[#FFFDFC] via-[#FFF7F8] to-[#FDF1F3] border-[#F43F5E]/20 hover:border-[#E11D48]/50 shadow-rose-100',
      railGradient: 'from-[#FB7185] via-[#E29578] to-[#BBDB93]',
      iconBg: 'bg-[#FFE4E6] text-[#E11D48]',
      icon: (
        <span className="text-xl">💍</span>
      ),
      ambientElement: (
        <div className="absolute top-2 right-3 flex items-center gap-1.5 text-xs text-[#E11D48] opacity-60 select-none pointer-events-none">
          <span className="animate-pulse">🌸</span>
          <span className="text-[10px] animate-float">♥</span>
        </div>
      ),
      footerText: 'Momento cúspide de amor',
    },
    {
      id: 3,
      phase: '03',
      time: '22:30',
      period: 'HRS',
      title: 'Banquete & Cristal',
      category: '✨ CENA DE GALA',
      tagBg: '#D6E4BA',
      tagTextColor: '#0B272D',
      location: 'Gran Salón ',
      quote: 'Cena para disfrutar”',
      description: 'Experiencia gastronómica de dos pasos, bebida acorde y brindis.',
      highlights: ['Menú delicioso', 'Vinos ', 'Brindis'],
      cardTheme: 'bg-white/85 backdrop-blur-md border border-[#5A9696]/35 shadow-[0_8px_30px_rgba(11,39,45,0.08)] hover:border-[#5A9696]/70',
      railGradient: 'from-[#BBDB93] via-[#5A9696] to-[#0B272D]',
      iconBg: 'bg-[#E8F1EE] text-[#0B272D]',
      icon: (
        <span className="text-xl">🍷</span>
      ),
      ambientElement: (
        <div className="absolute top-2 right-3 flex items-center gap-1 text-xs opacity-50 select-none pointer-events-none">
          <span className="animate-pulse">🕯️</span>
          <span className="text-sm">✨</span>
        </div>
      ),
      footerText: 'Servicio formal de pasos',
    },
    {
      id: 4,
      phase: '04',
      time: '23:30',
      period: 'HRS',
      title: 'Postre & Brindis',
      category: '🍯 DULZURA & CHAMPAGNE',
      tagBg: '#FEF3C7',
      tagTextColor: '#92400E',
      location: 'Pérgola Central',
      quote: '“El bocado más dulce de la noche”',
      description: 'Corte de la torta nupcial y brindis.',
      highlights: ['Corte de la torta nupcial', 'Brindis'],
      cardTheme: 'bg-gradient-to-b from-[#FFFDF8] via-[#FFFBEB] to-[#FEF3C7]/40 border-[#FBBF24]/30 hover:border-[#F59E0B]/60 shadow-amber-50',
      railGradient: 'from-[#F59E0B] via-[#FBBF24] to-[#BBDB93]',
      iconBg: 'bg-[#FEF3C7] text-[#D97706]',
      icon: (
        <span className="text-xl">🎂</span>
      ),
      ambientElement: (
        <div className="absolute top-2 right-3 flex items-center gap-1 text-xs text-[#D97706] opacity-60 select-none pointer-events-none">
          <span className="animate-bounce">🍰</span>
          <span className="text-sm animate-pulse">✨</span>
        </div>
      ),
      footerText: 'Momento dulce & brindis',
    },
    {
      id: 5,
      phase: '05',
      time: '24:00',
      period: 'HRS',
      title: 'Fiesta & Luces',
      category: '🪩 FIESTA & BAILE',
      tagBg: '#BBDB93',
      tagTextColor: '#0B272D',
      location: 'Pista Principal',
      quote: '“¡Música, estrellas y pista libre!”',
      description: 'Apertura con vals de novios, show de luces, DJ en vivo, diversion asegurada, cotillón LED y barra.',
      highlights: ['Vals de novios ', 'DJ en vivo & show de luces', 'Barra & cotillón LED'],
      cardTheme: 'bg-gradient-to-br from-[#0B272D] via-[#103239] to-[#07191D] text-white border-2 border-[#BBDB93]/80 shadow-[0_0_25px_rgba(187,219,147,0.35)]',
      railGradient: 'from-[#BBDB93] via-[#D6E4BA] to-[#5A9696]',
      iconBg: 'bg-[#BBDB93] text-[#0B272D]',
      icon: (
        <span className="text-xl">🪩</span>
      ),
      ambientElement: (
        <div className="absolute top-2 right-3 flex items-center gap-1.5 text-xs text-[#BBDB93] select-none pointer-events-none">
          <span className="animate-pulse">🌟</span>
          <span className="text-sm animate-bounce">⚡</span>
          <span className="text-xs">✨</span>
        </div>
      ),
      footerText: '¡A bailar toda la noche!',
    },
  ];

  return (
    <section id="itinerary" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F4F8F4] border-t border-[#0B272D]/6 relative overflow-hidden">
      {/* Decorative Botanical Ambient Background Elements */}
      <div className="absolute top-10 left-[-100px] w-80 h-80 bg-[#BBDB93]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-[-100px] w-96 h-96 bg-[#5A9696]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#5A9696] font-semibold text-xs tracking-[0.25em] uppercase block mb-3 font-sans">
            CRONOGRAMA & ITINERARIO
          </span>
          <h2 className="font-serif-display text-4xl sm:text-5xl font-semibold text-[#0B272D] mb-4">
            El Itinerario de Nuestra Boda
          </h2>
          <p className="text-[#1D373C] text-sm sm:text-base max-w-2xl mx-auto font-sans leading-relaxed">
            Cada instante ha sido preparado con emoción y magia. Acompáñanos a través de cada fase de esta noche inolvidable.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="h-[1px] w-12 bg-[#5A9696]/30"></span>
            <span className="font-script text-3xl text-[#5A9696]">07 de Noviembre, 2026</span>
            <span className="h-[1px] w-12 bg-[#5A9696]/30"></span>
          </div>
        </div>

        {/* Timeline Visual Connector Bar on Desktop */}
        <div className="hidden lg:block relative mb-10 px-8">
          <div className="h-[3px] w-full bg-gradient-to-r from-[#5A9696]/40 via-[#BBDB93]/80 to-[#5A9696]/40 relative rounded-full">
            {/* Step markers on line */}
            <div className="absolute inset-0 flex justify-between items-center -top-[7px]">
              {itineraryItems.map((item) => (
                <div
                  key={`dot-${item.id}`}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${selectedPhase === item.id
                    ? 'bg-[#0B272D] border-[#BBDB93] scale-150 shadow-lg'
                    : 'bg-white border-[#5A9696]'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Chronological Itinerary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-stretch">
          {itineraryItems.map((item) => {
            const isSelected = selectedPhase === item.id;
            const isNightParty = item.id === 5;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedPhase(isSelected ? null : item.id)}
                className={`rounded-[22px] transition-all duration-500 flex flex-col justify-between overflow-hidden relative cursor-pointer group shadow-sm hover:shadow-2xl ${item.cardTheme} ${isSelected
                  ? 'ring-2 ring-[#BBDB93] scale-[1.03] -translate-y-2'
                  : 'hover:-translate-y-2'
                  }`}
              >
                {/* Visual Ambient Icon/Sparkle */}
                {item.ambientElement}

                {/* Left Vertical Glowing Accent Rail */}
                <div className={`absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-b ${item.railGradient}`} />

                <div className="p-6 pl-8 flex-grow flex flex-col justify-between space-y-4">
                  {/* Top Row: Phase Badge & Category Pill */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[11px] font-bold tracking-widest font-sans ${isNightParty ? 'text-[#BBDB93]' : 'text-[#5A9696]'}`}>
                      FASE {item.phase}
                    </span>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm"
                      style={{ backgroundColor: item.tagBg, color: item.tagTextColor }}
                    >
                      {item.category}
                    </span>
                  </div>

                  {/* Time Badge (Cormorant Garamond) */}
                  <div className={`pt-1 pb-2 border-b ${isNightParty ? 'border-white/15' : 'border-[#0B272D]/10'}`}>
                    <div className="flex items-baseline gap-1.5">
                      <span className={`font-serif-display text-4xl font-bold tracking-tight ${isNightParty ? 'text-white drop-shadow-[0_2px_8px_rgba(187,219,147,0.4)]' : 'text-[#0B272D]'}`}>
                        {item.time}
                      </span>
                      <span className={`text-xs font-semibold uppercase tracking-wider font-sans ${isNightParty ? 'text-[#BBDB93]' : 'text-[#5A9696]'}`}>
                        {item.period}
                      </span>
                    </div>
                    <div className={`flex items-center gap-1.5 text-xs mt-1 font-medium ${isNightParty ? 'text-[#D6E4BA]' : 'text-[#5A9696]'}`}>
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>

                  {/* Title, Icon & Script Quote */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-serif-display text-2xl font-semibold leading-tight ${isNightParty ? 'text-white group-hover:text-[#BBDB93]' : 'text-[#0B272D] group-hover:text-[#5A9696]'} transition-colors`}>
                        {item.title}
                      </h3>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-110 ${item.iconBg}`}>
                        {item.icon}
                      </div>
                    </div>

                    {/* Romantic / Sensory Script Quote */}
                    <p className={`font-script text-[22px] leading-tight ${isNightParty ? 'text-[#D6E4BA]' : item.id === 2 ? 'text-[#E11D48]' : item.id === 4 ? 'text-[#D97706]' : 'text-[#5A9696]'}`}>
                      {item.quote}
                    </p>

                    <p className={`text-xs leading-relaxed font-sans ${isNightParty ? 'text-[#E0E8E5]/90' : 'text-[#1D373C]'}`}>
                      {item.description}
                    </p>
                  </div>

                  {/* Highlights Bullets */}
                  <div className={`pt-3 border-t space-y-1.5 ${isNightParty ? 'border-white/15' : 'border-[#0B272D]/10'}`}>
                    {item.highlights.map((h, i) => (
                      <div key={i} className={`flex items-center gap-1.5 text-[11px] font-medium ${isNightParty ? 'text-[#E0E8E5]' : 'text-[#426B6B]'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isNightParty ? 'bg-[#BBDB93] shadow-[0_0_6px_#BBDB93]' : item.id === 2 ? 'bg-[#E11D48]' : item.id === 4 ? 'bg-[#F59E0B]' : 'bg-[#BBDB93]'}`} />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer Status Indicator */}
                <div className={`py-2.5 px-6 pl-8 border-t flex items-center justify-between text-[11px] font-semibold transition-colors ${isNightParty
                  ? 'bg-black/30 border-white/10 text-[#BBDB93]'
                  : 'bg-white/40 border-[#0B272D]/5 text-[#5A9696]'
                  }`}>
                  <span>{item.footerText}</span>
                  <span className="text-xs group-hover:translate-x-1.5 transition-transform">→</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note Callout Below Itinerary */}
        <div className="mt-14 bg-white/90 backdrop-blur-md rounded-2xl border border-[#0B272D]/10 p-6 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#D6E4BA] flex items-center justify-center flex-shrink-0 text-[#0B272D] shadow-sm">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#0B272D]">
                Agradecemos llegar con 15 minutos de anticipación
              </p>
              <p className="text-[11px] sm:text-xs text-[#5A9696] leading-normal">
                Para disfrutar del cóctel de bienvenida al atardecer y acomodarse antes del inicio de los votos.
              </p>
            </div>
          </div>
          <a
            href="#rsvp"
            className="bg-[#0B272D] hover:bg-[#051518] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md flex-shrink-0"
          >
            Confirmar Asistencia
          </a>
        </div>
      </div>
    </section>
  );
};
