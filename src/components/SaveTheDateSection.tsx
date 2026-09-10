import React from 'react';

export const SaveTheDateSection: React.FC = () => {
  // November 2026 calendar data (starts on Sunday Nov 1)
  // Grid layout starting Mon (Col 1) to Sun (Col 7)
  const calendarDays = [
    { day: '', empty: true },
    { day: '', empty: true },
    { day: '', empty: true },
    { day: '', empty: true },
    { day: '', empty: true },
    { day: '', empty: true },
    { day: 1, isWedding: false },
    { day: 2, isWedding: false },
    { day: 3, isWedding: false },
    { day: 4, isWedding: false },
    { day: 5, isWedding: false },
    { day: 6, isWedding: false },
    { day: 7, isWedding: true }, // Highlighted wedding date in casamiento.pen
    { day: 8, isWedding: false },
    { day: 9, isWedding: false },
    { day: 10, isWedding: false },
    { day: 11, isWedding: false },
    { day: 12, isWedding: false },
    { day: 13, isWedding: false },
    { day: 14, isWedding: false },
    { day: 15, isWedding: false },
    { day: 16, isWedding: false },
    { day: 17, isWedding: false },
    { day: 18, isWedding: false },
    { day: 19, isWedding: false },
    { day: 20, isWedding: false },
    { day: 21, isWedding: false },
    { day: 22, isWedding: false },
    { day: 23, isWedding: false },
    { day: 24, isWedding: false },
    { day: 25, isWedding: false },
    { day: 26, isWedding: false },
    { day: 27, isWedding: false },
    { day: 28, isWedding: false },
    { day: 29, isWedding: false },
    { day: 30, isWedding: false },
  ];

  const handleAddToCalendar = () => {
    const title = encodeURIComponent("Casamiento de Mariana & Carlos");
    const details = encodeURIComponent("¡Reserva la fecha! Te invitamos a celebrar el casamiento de Mariana y Carlos.");
    const location = encodeURIComponent("Salon Complejo Nautico Ullum, San Juan");
    // 21:00 hs (7 Nov) a 05:00 hs (8 Nov) en Hora Argentina (UTC-3) -> 00:00Z a 08:00Z (8 Nov)
    const dates = "20261108T000000Z/20261108T080000Z";
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}&ctz=America/Argentina/Buenos_Aires`;
    window.open(url, '_blank');
  };

  return (
    <section id="save-the-date" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#E0E8E5] relative">
      <div className="max-w-[1080px] mx-auto">

        {/* Section Header (1:1 from casamiento.pen Frame 3) */}
        <div className="text-center mb-12 sm:mb-14">
          <span className="text-[#5A9696] font-semibold text-xs tracking-[0.25em] uppercase block mb-3 font-sans">
            RESERVA LA FECHA
          </span>
          <h2 className="font-serif-display text-4xl sm:text-5xl font-semibold text-[#0B272D] mb-4">
            Agenda Nuestro Gran Día
          </h2>

        </div>

        {/* Save the Date Stationery Card (Clean 2-Column Desktop Layout 1:1 Frame 3) */}
        <div className="bg-white rounded-[20px] shadow-xl border border-[#0B272D]/15 p-6 sm:p-10 max-w-[1040px] mx-auto">
          <div className="flex flex-col md:flex-row items-stretch gap-8 lg:gap-10">

            {/* Vertical Hairline Divider for Desktop */}


            {/* ============================================================ */}
            {/* Right Column: Calendar & Announcement */}
            {/* ============================================================ */}
            <div className="w-full md:flex-1 flex flex-col justify-between space-y-4 sm:space-y-5">

              {/* Couple Header */}
              <div className="text-center pt-2">
                <h3 className="font-script text-4xl sm:text-5xl text-[#0B272D] mb-1">
                  Mariana & Carlos
                </h3>
                <span className="text-[11px] text-[#5A9696] font-semibold tracking-[0.3em] uppercase block font-sans">
                  ¡NOS CASAMOS!
                </span>
                <div className="w-full h-[1px] bg-[#0B272D]/10 mt-3" />
              </div>

              {/* Month Header */}
              <div className="hidden md:block text-center font-sans font-bold text-sm sm:text-base text-[#0B272D] tracking-wider">
                NOVIEMBRE 2026
              </div>

              {/* Calendar Grid Frame */}
              <div className="bg-[#FAFBF9] rounded-xl p-3.5 sm:p-5 border border-[#0B272D]/10 shadow-inner">
                {/* Day Headers */}
                <div className="grid grid-cols-7 text-center text-xs font-semibold text-[#5A9696] mb-2 font-sans">
                  <span>LUN</span>
                  <span>MAR</span>
                  <span>MIÉ</span>
                  <span>JUE</span>
                  <span>VIE</span>
                  <span className="text-[#0B272D] font-bold">SÁB</span>
                  <span>DOM</span>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center font-sans text-xs sm:text-sm">
                  {calendarDays.map((item, index) => (
                    <div
                      key={index}
                      className={`h-8 sm:h-9 flex items-center justify-center rounded-lg transition-all ${item.empty
                        ? 'opacity-0'
                        : item.isWedding
                          ? 'bg-[#BBDB93] text-[#0B272D] font-bold border border-[#0B272D] rounded-full shadow-md scale-105 animate-pulse-subtle'
                          : 'text-[#1D373C] hover:bg-[#E0E8E5]'
                        }`}
                    >
                      {item.isWedding ? (
                        <span className="flex items-center gap-0.5 font-bold">
                          {item.day} <span className="text-[10px]">♥</span>
                        </span>
                      ) : (
                        item.day
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Location & Footnote Line */}
              <div className="text-center space-y-1 font-sans">
                <p className="text-xs sm:text-sm font-bold text-[#0B272D] tracking-wider">
                  📍 Ullum, San Juan
                </p>
                <p className="text-[11px] text-[#5A9696] font-medium tracking-widest uppercase">
                  INVITACIÓN FORMAL A CONTINUACIÓN
                </p>
              </div>

              {/* Add to Google Calendar Button */}
              <div className="pt-1">
                <button
                  onClick={handleAddToCalendar}
                  className="w-full max-w-[360px] mx-auto bg-[#0B272D] hover:bg-[#051518] text-white border-[1.5px] border-[#BBDB93] text-xs font-semibold tracking-[0.1em] uppercase py-3.5 px-6 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 font-sans"
                >
                  <span>📅</span>
                  <span>AGREGAR A GOOGLE CALENDAR</span>
                </button>
              </div>


            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
