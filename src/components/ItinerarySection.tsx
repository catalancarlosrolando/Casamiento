import React, { useState } from 'react';

interface ItineraryItem {
  id: number;
  phase: string;
  time: string;
  period: string;
  title: string;
  category: string;
  location: string;
  description: string;
  highlights: string[];
  icon: React.ReactNode;
}

export const ItinerarySection: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);

  const itineraryItems: ItineraryItem[] = [
    {
      id: 1,
      phase: '01',
      time: '17:00',
      period: 'HRS',
      title: 'Recepción & Cóctel',
      category: 'BIENVENIDA',
      location: 'Terraza & Jardines',
      description: 'Recepción de invitados con aperitivos frescos, barra de espumantes y música acústica en vivo al atardecer.',
      highlights: ['Cóctel de autor', 'Bocadillos gourmet', 'Música acústica'],
      icon: (
        <svg className="w-6 h-6 text-[#0B272D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 2,
      phase: '02',
      time: '18:00',
      period: 'HRS',
      title: 'Ceremonia Civil',
      category: 'CEREMONIA',
      location: 'Jardín de los Arcos',
      description: 'Intercambio de votos matrimoniales, firma de actas civiles y bendición rodeados de naturaleza y seres queridos.',
      highlights: ['Intercambio de votos', 'Firma de actas', 'Lluvia de pétalos'],
      icon: (
        <svg className="w-6 h-6 text-[#0B272D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      id: 3,
      phase: '03',
      time: '20:00',
      period: 'HRS',
      title: 'Cena Principal',
      category: 'BANQUETE',
      location: 'Salón Paraíso',
      description: 'Exquisito banquete de pasos con maridaje de vinos selectos, platos principales y opciones especiales.',
      highlights: ['Menú de autor', 'Maridaje exclusivo', 'Discursos de honor'],
      icon: (
        <svg className="w-6 h-6 text-[#0B272D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      id: 4,
      phase: '04',
      time: '22:00',
      period: 'HRS',
      title: 'Postre & Brindis',
      category: 'DULCE & BRINDIS',
      location: 'Pérgola Central',
      description: 'Corte del pastel nupcial, mesa de postres artesanales, café de especialidad y emotivo brindis con champagne.',
      highlights: ['Corte de pastel', 'Mesa dulce artesanal', 'Brindis con champagne'],
      icon: (
        <svg className="w-6 h-6 text-[#0B272D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M3 21h18M3 10h18M3 7l9-4 9 4v11a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
        </svg>
      ),
    },
    {
      id: 5,
      phase: '05',
      time: '23:00',
      period: 'HRS',
      title: 'Fiesta & Baile',
      category: 'FESTEJO',
      location: 'Pista Principal',
      description: 'Apertura de pista de baile con el primer vals de los novios, show de luces, DJ en vivo y barra libre de cócteles.',
      highlights: ['Vals nupcial', 'DJ & Show en vivo', 'Barra libre premium'],
      icon: (
        <svg className="w-6 h-6 text-[#0B272D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
    },
  ];

  return (
    <section id="itinerary" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#E0E8E5] relative overflow-hidden">
      {/* Decorative Botanical Ambient Background Elements */}
      <div className="absolute top-10 left-[-100px] w-80 h-80 bg-[#BBDB93]/15 rounded-full blur-3xl pointer-events-none" />
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
            Cada momento ha sido preparado con dedicación y amor. Acompáñanos a través de cada fase de esta inolvidable celebración.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="h-[1px] w-12 bg-[#5A9696]/30"></span>
            <span className="font-script text-2xl text-[#5A9696]">07 de Noviembre, 2026</span>
            <span className="h-[1px] w-12 bg-[#5A9696]/30"></span>
          </div>
        </div>

        {/* Timeline Visual Connector Bar on Desktop */}
        <div className="hidden lg:block relative mb-8 px-8">
          <div className="h-[2px] w-full bg-gradient-to-r from-[#BBDB93]/40 via-[#5A9696]/50 to-[#BBDB93]/40 relative">
            {/* Step markers on line */}
            <div className="absolute inset-0 flex justify-between items-center -top-[7px]">
              {itineraryItems.map((item) => (
                <div
                  key={`dot-${item.id}`}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                    selectedPhase === item.id
                      ? 'bg-[#0B272D] border-[#BBDB93] scale-125 shadow-md'
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
            return (
              <div
                key={item.id}
                onClick={() => setSelectedPhase(isSelected ? null : item.id)}
                className={`bg-white rounded-[20px] border transition-all duration-300 flex flex-col justify-between overflow-hidden relative cursor-pointer group shadow-sm hover:shadow-xl ${
                  isSelected
                    ? 'border-[#5A9696] ring-2 ring-[#BBDB93]/60 -translate-y-2'
                    : 'border-[#0B272D]/12 hover:border-[#5A9696]/50 hover:-translate-y-1'
                }`}
              >
                {/* 3px Left Vertical Botanical Rail */}
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#BBDB93] group-hover:bg-[#5A9696] transition-colors" />

                <div className="p-6 pl-7 flex-grow flex flex-col justify-between space-y-4">
                  {/* Top Row: Phase badge & Category Pill */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold tracking-widest text-[#5A9696] font-sans">
                      FASE {item.phase}
                    </span>
                    <span className="bg-[#D6E4BA] text-[#0B272D] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>

                  {/* Time Badge (Cormorant Garamond) */}
                  <div className="pt-1 pb-2 border-b border-[#0B272D]/8">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-serif-display text-4xl font-bold text-[#0B272D] tracking-tight">
                        {item.time}
                      </span>
                      <span className="text-xs font-semibold text-[#5A9696] uppercase tracking-wider font-sans">
                        {item.period}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#5A9696] mt-1 font-medium">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>

                  {/* Title & Icon */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-serif-display text-2xl font-semibold text-[#0B272D] leading-snug group-hover:text-[#5A9696] transition-colors">
                        {item.title}
                      </h3>
                      <div className="p-2 bg-[#E0E8E5]/70 rounded-full group-hover:bg-[#D6E4BA] transition-colors flex-shrink-0">
                        {item.icon}
                      </div>
                    </div>
                    <p className="text-xs text-[#1D373C] leading-relaxed font-sans">
                      {item.description}
                    </p>
                  </div>

                  {/* Highlight Bullets */}
                  <div className="pt-3 border-t border-[#0B272D]/8 space-y-1.5">
                    {item.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#426B6B] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#BBDB93] flex-shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer Status Indicator */}
                <div className="bg-[#E0E8E5]/40 py-2.5 px-6 pl-7 border-t border-[#0B272D]/5 flex items-center justify-between text-[11px] font-semibold text-[#5A9696]">
                  <span>Puntualidad recomendada</span>
                  <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note Callout Below Itinerary */}
        <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl border border-[#0B272D]/10 p-6 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D6E4BA] flex items-center justify-center flex-shrink-0 text-[#0B272D]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[#0B272D]">
                Agradecemos llegar con 15 minutos de anticipación
              </p>
              <p className="text-[11px] sm:text-xs text-[#5A9696]">
                Para disfrutar del cóctel de bienvenida y acomodarse antes del inicio de la ceremonia civil.
              </p>
            </div>
          </div>
          <a
            href="#rsvp"
            className="bg-[#0B272D] hover:bg-[#051518] text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-full transition-all duration-300 flex-shrink-0 shadow-sm"
          >
            Confirmar Asistencia
          </a>
        </div>
      </div>
    </section>
  );
};
