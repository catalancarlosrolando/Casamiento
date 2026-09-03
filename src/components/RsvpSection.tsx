import React, { useState, useRef } from 'react';

interface AttachedFile {
  file: File;
  name: string;
  sizeFormatted: string;
  previewUrl?: string;
}

export const RsvpSection: React.FC = () => {
  // Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [attendance, setAttendance] = useState<'attending' | 'declined' | ''>('attending');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [dietary, setDietary] = useState<string>('ninguno');
  const [dietaryNotes, setDietaryNotes] = useState<string>('');
  const [songRequest, setSongRequest] = useState<string>('');
  
  // File Upload State
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Copy Feedback States
  const [copiedCbu, setCopiedCbu] = useState(false);
  const [copiedAlias, setCopiedAlias] = useState(false);

  // Submit & Validation States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Price per person
  const pricePerPerson = 35000;
  const totalAmount = guestCount * pricePerPerson;

  // File size formatter
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Process selected file
  const handleFileSelect = (file: File) => {
    setFileError(null);

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setFileError('Formato no permitido. Solo se aceptan archivos JPG, PNG, WEBP o PDF.');
      return;
    }

    // Validate size (5MB max = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError('El archivo supera el tamaño máximo permitido de 5 MB.');
      return;
    }

    let previewUrl: string | undefined;
    if (file.type.startsWith('image/')) {
      previewUrl = URL.createObjectURL(file);
    }

    setAttachedFile({
      file,
      name: file.name,
      sizeFormatted: formatFileSize(file.size),
      previewUrl,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (attachedFile?.previewUrl) {
      URL.revokeObjectURL(attachedFile.previewUrl);
    }
    setAttachedFile(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyToClipboard = (text: string, type: 'cbu' | 'alias') => {
    navigator.clipboard.writeText(text);
    if (type === 'cbu') {
      setCopiedCbu(true);
      setTimeout(() => setCopiedCbu(false), 2000);
    } else {
      setCopiedAlias(true);
      setTimeout(() => setCopiedAlias(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Basic validation
    if (!firstName.trim() || !lastName.trim()) {
      setFormError('Por favor ingresa tu Nombre y Apellido.');
      return;
    }

    if (!attendance) {
      setFormError('Por favor selecciona si asistirás a la boda.');
      return;
    }

    if (attendance === 'attending' && (!guestCount || guestCount < 1)) {
      setFormError('La cantidad de personas que confirman debe ser al menos 1.');
      return;
    }

    // Submit Simulation
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setFirstName('');
    setLastName('');
    setEmail('');
    setAttendance('attending');
    setGuestCount(2);
    setAttachedFile(null);
    setFormError(null);
  };

  return (
    <section id="rsvp" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#E0E8E5] relative">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[#5A9696] font-semibold text-xs tracking-[0.25em] uppercase block mb-3">
            CONFIRMACIÓN & ASISTENCIA
          </span>
          <h2 className="font-serif-display text-4xl sm:text-5xl font-semibold text-[#0B272D] mb-4">
            Confirma tu Asistencia
          </h2>
          <p className="text-[#1D373C] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Nos encantaría contar con tu presencia. Por favor completa el formulario antes del <strong>1 de Octubre de 2026</strong>.
          </p>
        </div>

        {/* Centerpiece Elevated Stationery Card (max-width: 640px) */}
        <div className="max-w-[640px] mx-auto bg-white rounded-3xl shadow-2xl border border-[#0B272D]/15 overflow-hidden transition-all duration-300">
          
          {/* Card Top Decorative Accent Bar */}
          <div className="h-2 bg-gradient-to-r from-[#5A9696] via-[#BBDB93] to-[#5A9696]" />

          <div className="p-6 sm:p-10">

            {/* SUCCESS CONFIRMATION VIEW */}
            {isSubmitted ? (
              <div className="text-center py-8 space-y-6 animate-fade-in">
                <div className="w-20 h-20 mx-auto rounded-full bg-[#BBDB93] flex items-center justify-center text-4xl text-[#0B272D] font-bold shadow-lg animate-bounce">
                  ✓
                </div>

                <div>
                  <span className="bg-[#D6E4BA] text-[#0B272D] text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full">
                    {attendance === 'attending' ? 'ASISTENCIA CONFIRMADA' : 'RESPUESTA REGISTRADA'}
                  </span>
                  <h3 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#0B272D] mt-4 mb-2">
                    {attendance === 'attending'
                      ? `¡Gracias ${firstName}! Nos vemos pronto`
                      : `Gracias por avisarnos, ${firstName}`}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#1D373C] max-w-md mx-auto leading-relaxed">
                    {attendance === 'attending'
                      ? `Hemos registrado tu asistencia para ${guestCount} persona${guestCount > 1 ? 's' : ''}${
                          attachedFile ? ' y adjuntado tu comprobante de reserva' : ''
                        }. ¡Estamos muy felices de compartir este día con ustedes!`
                      : 'Lamentamos que no puedas acompañarnos físicamente, pero sabemos que estarás presente con el corazón.'}
                  </p>
                </div>

                {attendance === 'attending' && (
                  <div className="bg-[#F7FAF9] rounded-2xl p-4 sm:p-6 border border-[#0B272D]/10 text-left space-y-3 max-w-md mx-auto text-xs">
                    <div className="flex justify-between pb-2 border-b border-[#0B272D]/10">
                      <span className="text-[#5A9696] font-semibold">Titular:</span>
                      <span className="font-bold text-[#0B272D]">{firstName} {lastName}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-[#0B272D]/10">
                      <span className="text-[#5A9696] font-semibold">Lugares Confirmados:</span>
                      <span className="font-bold text-[#0B272D]">{guestCount} Persona{guestCount > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-[#0B272D]/10">
                      <span className="text-[#5A9696] font-semibold">Fecha:</span>
                      <span className="font-bold text-[#0B272D]">14 Noviembre 2026 · 16:30 hs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5A9696] font-semibold">Comprobante:</span>
                      <span className="font-bold text-[#0B272D]">{attachedFile ? attachedFile.name : 'Pendiente / No adjuntado'}</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <button
                    onClick={() => {
                      const title = encodeURIComponent("Boda Valentina & Mateo");
                      const details = encodeURIComponent("Casamiento en Villa Huapi, Bariloche");
                      const dates = "20261114T193000Z/20261115T080000Z";
                      window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}`, '_blank');
                    }}
                    className="bg-[#0B272D] hover:bg-[#051518] text-white text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded-full transition-all"
                  >
                    📅 Agregar al Calendario
                  </button>
                  <button
                    onClick={handleResetForm}
                    className="bg-[#E0E8E5] hover:bg-[#d6e4ba] text-[#0B272D] text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded-full transition-all"
                  >
                    Editar Respuesta
                  </button>
                </div>
              </div>
            ) : (

              /* MAIN RSVP FORM */
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Header Tag inside card */}
                <div className="flex items-center justify-between pb-4 border-b border-[#0B272D]/10">
                  <div>
                    <span className="bg-[#D6E4BA] text-[#0B272D] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                      RSVP · RESERVA
                    </span>
                    <h3 className="font-serif-display text-2xl font-bold text-[#0B272D] mt-2">
                      Formulario de Confirmación
                    </h3>
                  </div>
                  <span className="text-3xl">🌿</span>
                </div>

                {/* Error Banner */}
                {formError && (
                  <div className="bg-[#FAF0F0] border border-[#E5BABA] text-[#8C1C00] p-4 rounded-xl text-xs font-medium flex items-center gap-3 animate-shake">
                    <span className="text-lg">⚠️</span>
                    <span>{formError}</span>
                  </div>
                )}

                {/* FIELD 1 & 2: First Name & Last Name (2 columns Desktop, stacked Mobile) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0B272D] tracking-wide uppercase mb-1.5">
                      Nombre <span className="text-[#5A9696]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Valentina"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full h-12 px-4 rounded-lg bg-white border border-[#0B272D]/20 text-sm text-[#0B272D] placeholder-[#426B6B]/70 focus:outline-none focus:ring-2 focus:ring-[#5A9696] focus:border-[#5A9696] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B272D] tracking-wide uppercase mb-1.5">
                      Apellido <span className="text-[#5A9696]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Rossi"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full h-12 px-4 rounded-lg bg-white border border-[#0B272D]/20 text-sm text-[#0B272D] placeholder-[#426B6B]/70 focus:outline-none focus:ring-2 focus:ring-[#5A9696] focus:border-[#5A9696] transition-all"
                    />
                  </div>
                </div>

                {/* Optional Email */}
                <div>
                  <label className="block text-xs font-bold text-[#0B272D] tracking-wide uppercase mb-1.5">
                    Email de Contacto <span className="text-gray-400 text-[10px] font-normal">(opcional, para recordatorios)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="tu.email@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg bg-white border border-[#0B272D]/20 text-sm text-[#0B272D] placeholder-[#426B6B]/70 focus:outline-none focus:ring-2 focus:ring-[#5A9696] focus:border-[#5A9696] transition-all"
                  />
                </div>

                {/* FIELD 3: Attendance Selector */}
                <div>
                  <label className="block text-xs font-bold text-[#0B272D] tracking-wide uppercase mb-1.5">
                    ¿Asistirás a la celebración? <span className="text-[#5A9696]">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAttendance('attending')}
                      className={`h-12 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all ${
                        attendance === 'attending'
                          ? 'bg-[#BBDB93] border-[#0B272D] text-[#0B272D] shadow-md ring-2 ring-[#0B272D]/20'
                          : 'bg-white border-[#0B272D]/15 text-[#426B6B] hover:bg-[#E0E8E5]/50'
                      }`}
                    >
                      <span>🌿</span>
                      <span>Sí, asistiré con gusto</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAttendance('declined')}
                      className={`h-12 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all ${
                        attendance === 'declined'
                          ? 'bg-[#E0E8E5] border-[#0B272D] text-[#0B272D] shadow-md ring-2 ring-[#0B272D]/20'
                          : 'bg-white border-[#0B272D]/15 text-[#426B6B] hover:bg-[#E0E8E5]/50'
                      }`}
                    >
                      <span>✕</span>
                      <span>No podré asistir</span>
                    </button>
                  </div>
                </div>

                {/* ATTENDING ONLY FIELDS */}
                {attendance === 'attending' && (
                  <div className="space-y-6 pt-2 animate-fade-in">
                    
                    {/* FIELD 4: Guest Count Numeric Stepper */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-bold text-[#0B272D] tracking-wide uppercase">
                          Cantidad de personas que confirman <span className="text-[#5A9696]">*</span>
                        </label>
                        <span className="text-[11px] text-[#5A9696] font-semibold">
                          ${pricePerPerson.toLocaleString('es-AR')} por cubierto
                        </span>
                      </div>

                      <div className="flex items-center rounded-xl border border-[#0B272D]/20 bg-white p-1 shadow-sm">
                        <button
                          type="button"
                          disabled={guestCount <= 1}
                          onClick={() => setGuestCount((prev) => Math.max(1, prev - 1))}
                          className="w-12 h-10 rounded-lg bg-[#E0E8E5] hover:bg-[#d6e4ba] disabled:opacity-40 disabled:hover:bg-[#E0E8E5] text-[#0B272D] font-bold text-lg flex items-center justify-center transition-colors"
                        >
                          −
                        </button>

                        <div className="flex-1 text-center">
                          <span className="text-sm sm:text-base font-bold text-[#0B272D]">
                            {guestCount} Persona{guestCount > 1 ? 's' : ''}
                          </span>
                          <span className="text-[11px] text-[#5A9696] block font-medium">
                            Total: ${totalAmount.toLocaleString('es-AR')} ARS
                          </span>
                        </div>

                        <button
                          type="button"
                          disabled={guestCount >= 10}
                          onClick={() => setGuestCount((prev) => Math.min(10, prev + 1))}
                          className="w-12 h-10 rounded-lg bg-[#E0E8E5] hover:bg-[#d6e4ba] disabled:opacity-40 disabled:hover:bg-[#E0E8E5] text-[#0B272D] font-bold text-lg flex items-center justify-center transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* FIELD 5: CONDITIONAL PAYMENT VOUCHER SECTION */}
                    <div className="bg-[#F5F9F8] rounded-2xl p-5 sm:p-6 border border-[#5A9696]/30 space-y-5">
                      
                      {/* Bank Tag */}
                      <div className="flex items-center justify-between">
                        <span className="bg-[#D6E4BA] text-[#0B272D] text-[9px] font-bold tracking-wider uppercase px-3 py-1 rounded-full">
                          🌿 DATOS PARA LA TRANSFERENCIA / APORTE
                        </span>
                        <span className="text-xs font-bold text-[#0B272D]">
                          ${totalAmount.toLocaleString('es-AR')} ARS
                        </span>
                      </div>

                      {/* Bank Details Box */}
                      <div className="bg-white rounded-xl p-4 border border-[#0B272D]/10 space-y-2.5 text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-[#0B272D]/5">
                          <span className="text-[#5A9696] font-semibold">Banco:</span>
                          <span className="font-bold text-[#0B272D]">Banco Santander Río</span>
                        </div>
                        
                        <div className="flex items-center justify-between pb-2 border-b border-[#0B272D]/5">
                          <span className="text-[#5A9696] font-semibold">Titular:</span>
                          <span className="font-bold text-[#0B272D]">Valentina Rossi & Mateo Benítez</span>
                        </div>

                        <div className="flex items-center justify-between pb-2 border-b border-[#0B272D]/5">
                          <div>
                            <span className="text-[#5A9696] font-semibold block">CBU:</span>
                            <span className="font-mono font-bold text-[#0B272D]">0720123488000034567891</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard('0720123488000034567891', 'cbu')}
                            className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 bg-[#E0E8E5] hover:bg-[#BBDB93] text-[#0B272D] rounded-full transition-colors"
                          >
                            {copiedCbu ? '✓ Copiado' : 'Copiar CBU'}
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[#5A9696] font-semibold block">Alias:</span>
                            <span className="font-bold text-[#0B272D]">BODA.VALEN.MATEO</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard('BODA.VALEN.MATEO', 'alias')}
                            className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 bg-[#E0E8E5] hover:bg-[#BBDB93] text-[#0B272D] rounded-full transition-colors"
                          >
                            {copiedAlias ? '✓ Copiado' : 'Copiar Alias'}
                          </button>
                        </div>
                      </div>

                      {/* File Upload Dropzone */}
                      <div>
                        <label className="block text-xs font-bold text-[#0B272D] tracking-wide uppercase mb-1.5">
                          Adjuntar Comprobante de Pago <span className="text-gray-400 font-normal">(Opcional / Recomendado)</span>
                        </label>

                        {/* Hidden File Input */}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              handleFileSelect(e.target.files[0]);
                            }
                          }}
                          accept=".jpg,.jpeg,.png,.webp,.pdf"
                          className="hidden"
                        />

                        {/* Dropzone Box */}
                        {!attachedFile ? (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all bg-white ${
                              isDragging
                                ? 'border-[#0B272D] bg-[#D6E4BA]/30 scale-[1.02]'
                                : 'border-[#5A9696] hover:border-[#0B272D] hover:bg-[#F9FBFA]'
                            }`}
                          >
                            <span className="text-3xl block mb-2 text-[#5A9696]">☁</span>
                            <p className="text-xs sm:text-sm font-bold text-[#0B272D] mb-1">
                              Arrastra tu archivo aquí o haz clic para explorar
                            </p>
                            <p className="text-[11px] text-[#5A9696]">
                              Formatos permitidos: JPG, PNG, WEBP, PDF · Máximo 5 MB
                            </p>
                            
                            <button
                              type="button"
                              className="mt-3 inline-block text-[11px] font-semibold text-[#5A9696] bg-white border border-[#5A9696] px-4 py-1.5 rounded-full hover:bg-[#5A9696] hover:text-white transition-colors"
                            >
                              Seleccionar archivo
                            </button>
                          </div>
                        ) : (
                          /* Live Preview Chip */
                          <div className="bg-white rounded-xl p-3.5 border border-[#5A9696]/40 flex items-center justify-between shadow-sm animate-fade-in">
                            <div className="flex items-center gap-3 overflow-hidden">
                              {attachedFile.previewUrl ? (
                                <img
                                  src={attachedFile.previewUrl}
                                  alt="Preview"
                                  className="w-10 h-10 object-cover rounded-lg border border-[#0B272D]/10 shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-[#E0E8E5] flex items-center justify-center text-xl shrink-0">
                                  📄
                                </div>
                              )}
                              <div className="truncate">
                                <p className="text-xs font-bold text-[#0B272D] truncate">
                                  {attachedFile.name}
                                </p>
                                <p className="text-[10px] text-[#5A9696]">
                                  {attachedFile.sizeFormatted} · <span className="text-[#426B6B] font-semibold">Listo para enviar</span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="bg-[#BBDB93] text-[#0B272D] text-[9px] font-bold px-2.5 py-1 rounded-full">
                                ✓ Adjuntado
                              </span>
                              <button
                                type="button"
                                onClick={handleClearFile}
                                className="w-7 h-7 rounded-full bg-[#FAF0F0] text-[#8C1C00] hover:bg-[#8C1C00] hover:text-white flex items-center justify-center text-xs font-bold transition-colors"
                                title="Eliminar archivo"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        )}

                        {fileError && (
                          <p className="text-xs text-[#8C1C00] font-semibold mt-2">
                            ⚠️ {fileError}
                          </p>
                        )}
                      </div>

                    </div>

                    {/* Dietary Restrictions & Preferences */}
                    <div className="pt-2">
                      <label className="block text-xs font-bold text-[#0B272D] tracking-wide uppercase mb-1.5">
                        Restricciones Alimentarias
                      </label>
                      <select
                        value={dietary}
                        onChange={(e) => setDietary(e.target.value)}
                        className="w-full h-12 px-4 rounded-lg bg-white border border-[#0B272D]/20 text-sm text-[#0B272D] focus:outline-none focus:ring-2 focus:ring-[#5A9696] focus:border-[#5A9696] transition-all mb-2"
                      >
                        <option value="ninguno">Ninguna restricción (Menú tradicional)</option>
                        <option value="vegetariano">Menú Vegetariano</option>
                        <option value="vegano">Menú Vegano</option>
                        <option value="celiaco">Menú Celíaco / Sin TACC</option>
                        <option value="otro">Otras alergias o requerimientos</option>
                      </select>

                      {dietary === 'otro' && (
                        <input
                          type="text"
                          placeholder="Especifica tus alergias (ej: mariscos, frutos secos, lactosa)..."
                          value={dietaryNotes}
                          onChange={(e) => setDietaryNotes(e.target.value)}
                          className="w-full h-10 px-4 rounded-lg bg-white border border-[#0B272D]/20 text-xs text-[#0B272D] focus:outline-none focus:ring-2 focus:ring-[#5A9696] transition-all"
                        />
                      )}
                    </div>

                    {/* Song Request */}
                    <div>
                      <label className="block text-xs font-bold text-[#0B272D] tracking-wide uppercase mb-1.5">
                        ¿Qué canción no puede faltar en la fiesta? 🎵
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Bohemian Rhapsody - Queen"
                        value={songRequest}
                        onChange={(e) => setSongRequest(e.target.value)}
                        className="w-full h-12 px-4 rounded-lg bg-white border border-[#0B272D]/20 text-sm text-[#0B272D] placeholder-[#426B6B]/70 focus:outline-none focus:ring-2 focus:ring-[#5A9696] transition-all"
                      />
                    </div>

                  </div>
                )}

                {/* ACTION TRIGGER: Primary Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-[#0B272D] hover:bg-[#051518] disabled:bg-[#0B272D]/60 text-white font-bold text-xs sm:text-sm tracking-[0.15em] uppercase rounded-full shadow-xl transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        <span>ENVIANDO CONFIRMACIÓN...</span>
                      </>
                    ) : (
                      <>
                        <span>ENVIAR CONFIRMACIÓN</span>
                        <span className="text-base">→</span>
                      </>
                    )}
                  </button>
                  
                  <p className="text-center text-[11px] text-[#426B6B] mt-3">
                    🔒 Tus datos están cifrados y solo serán visibles para los anfitriones.
                  </p>
                </div>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
