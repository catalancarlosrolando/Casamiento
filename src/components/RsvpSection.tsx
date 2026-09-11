import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  createInvitado,
  TelefonoDuplicadoError,
  isArgentinaPhoneValid,
  type Invitado
} from '../services/rsvpService';

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
  const [phone, setPhone] = useState('');
  const [attendance, setAttendance] = useState<'attending' | 'declined' | ''>('attending');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [dietary, setDietary] = useState<string>('ninguno');
  const [songRequest, setSongRequest] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [otherDietary, setOtherDietary] = useState<string>('');
  const [amountPartial, setAmountPartial] = useState<number>(0);

  // Payment Option State: 'ahora' (Pay now & attach) vs 'tarde' (Pay later) vs 'fraccionado' (Pay in installments)
  const [paymentOption, setPaymentOption] = useState<'ahora' | 'tarde' | 'fraccionado' | ''>('');

  // File Upload State
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submit & Validation States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [duplicateGuest, setDuplicateGuest] = useState<Invitado | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [savedInvitado, setSavedInvitado] = useState<Invitado | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showBankDetails, setShowBankDetails] = useState<boolean>(false);
  const formCardRef = useRef<HTMLDivElement>(null);

  const scrollToFormTop = () => {
    if (formCardRef.current) {
      formCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Auto-scroll to top of form card when submitted or on error
  useEffect(() => {
    if (isSubmitted || formError) {
      scrollToFormTop();
    }
  }, [isSubmitted, formError]);

  // Price per person
  const pricePerPerson = 75000;
  const totalAmount = guestCount * pricePerPerson;

  // Bank Data
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };


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

    // Validate size (5MB max)
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

  // Listen for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && duplicateGuest) {
        setDuplicateGuest(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [duplicateGuest]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setDuplicateGuest(null);

    // Basic validation
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      setFormError('Por favor ingresa tu Nombre, Apellido y Teléfono.');
      scrollToFormTop();
      return;
    }

    // Validate Argentine Phone
    if (!isArgentinaPhoneValid(phone)) {
      setFormError('Por favor ingresa un número de teléfono válido de Argentina con código de área (ej: 264 123 4567 o 11 1234 5678).');
      scrollToFormTop();
      return;
    }

    if (!attendance) {
      setFormError('Por favor selecciona si asistirás a la boda.');
      scrollToFormTop();
      return;
    }

    if (attendance === 'attending' && (!guestCount || guestCount < 1)) {
      setFormError('La cantidad de personas que confirman debe ser al menos 1.');
      scrollToFormTop();
      return;
    }

    if (attendance === 'attending' && !paymentOption) {
      setFormError('Por favor elija una opción de pago.');
      scrollToFormTop();
      return;
    }

    setIsSubmitting(true);
    try {
      const fileToUpload = (attendance === 'attending' && (paymentOption === 'ahora' || paymentOption === 'fraccionado'))
        ? attachedFile?.file
        : null;

      const result = await createInvitado(
        {
          nombre: firstName,
          apellido: lastName,
          telefono: phone,
          asistencia: attendance,
          invitados: guestCount,
          restriccionAlimentaria: dietary,
          otros: otherDietary,
          observacion: comment,
          cancion: songRequest,
          opcionPago: attendance === 'attending' ? (paymentOption as 'ahora' | 'tarde' | 'fraccionado') : 'no_aplica',
          montoTotal: totalAmount,
          montoPagado: attendance === 'attending'
            ? (paymentOption === 'fraccionado' ? amountPartial : (paymentOption === 'ahora' && fileToUpload ? totalAmount : 0))
            : 0,
          estadoPago: attendance !== 'attending'
            ? 'no_aplica'
            : (fileToUpload ? 'en_revision' : (paymentOption === 'fraccionado' && amountPartial > 0 ? 'parcialmente_pagado' : 'pendiente')),
        },
        fileToUpload
      );

      setSavedInvitado(result);
      setIsSubmitted(true);
      scrollToFormTop();
    } catch (err: any) {
      if (err instanceof TelefonoDuplicadoError) {
        setDuplicateGuest(err.invitadoExistente);
      } else {
        console.error('Error al guardar confirmación:', err);
        setFormError(err?.message || 'Ocurrió un problema al enviar tu confirmación. Por favor intenta nuevamente.');
      }
      scrollToFormTop();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setSavedInvitado(null);
    setDuplicateGuest(null);
    setFirstName('');
    setLastName('');
    setPhone('');
    setAttendance('attending');
    setGuestCount(1);
    setPaymentOption('');
    setAttachedFile(null);
    setFormError(null);
    setCopiedLink(false);
    setDietary('ninguno');
    setOtherDietary('');
    setSongRequest('');
    setComment('');
    setAmountPartial(0);
    scrollToFormTop();
  };

  const handleCopyLink = () => {
    if (!savedInvitado) return;
    const url = `${window.location.origin}/pago?id=${savedInvitado.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    if (!savedInvitado) return;
    const url = `${window.location.origin}/pago?id=${savedInvitado.id}`;
    const text = encodeURIComponent(
      `¡Hola ${firstName}! Acá tienes el enlace exclusivo para subir el comprobante de pago de la boda de Mariana y Carlos (${guestCount} lugares reservados - Total: $${totalAmount.toLocaleString('es-AR')} ARS):\n${url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };


  const paymentLink = savedInvitado ? `${window.location.origin}/pago?id=${savedInvitado.id}` : '';

  return (
    <section id="rsvp" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#EDF4E7] border-t border-[#0B272D]/6 relative overflow-hidden">
      {/* Decorative Botanical Ambient Background Elements */}
      <div className="absolute top-12 left-[-80px] w-96 h-96 bg-[#BBDB93]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-[-80px] w-96 h-96 bg-[#5A9696]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Section Header */}
        <div className="text-center mb-10">

          <h2 className="font-serif-display text-4xl sm:text-5xl font-semibold text-[#0B272D] mb-4">
            Confirma tu Asistencia
          </h2>
          <p className="text-[#1D373C] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Por favor completa el formulario antes del <strong>5 de Octubre de 2026</strong>.
          </p>


          {/* Quick link for guests who already RSVP'd */}
          <div className="mt-4">
            <Link
              to="/pago"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5A9696] hover:text-[#0B272D] underline tracking-wide transition-colors"
            >
              <span>¿Ya confirmaste? Subí o consulta tu comprobante → Hacé clic acá</span>
            </Link>
          </div>
        </div>

        {/* Centerpiece Elevated Stationery Card (max-width: 640px) */}
        <div
          ref={formCardRef}
          className="max-w-[640px] mx-auto bg-white rounded-3xl shadow-2xl border border-[#0B272D]/15 overflow-hidden transition-all duration-300 scroll-mt-24"
        >

          {/* Card Top Decorative Accent Bar */}
          <div className="h-2 bg-gradient-to-r from-[#5A9696] via-[#BBDB93] to-[#5A9696]" />

          <div className="p-6 sm:p-10">

            {/* SUCCESS CONFIRMATION VIEW */}
            {isSubmitted && savedInvitado ? (
              <div className="text-center py-6 space-y-6 animate-fade-in">
                <div className="w-20 h-20 mx-auto rounded-full bg-[#BBDB93] flex items-center justify-center text-4xl text-[#0B272D] font-bold shadow-lg animate-bounce">
                  ✓
                </div>

                <div>
                  <span className="bg-[#D6E4BA] text-[#0B272D] text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full">
                    {attendance === 'attending' ? 'ASISTENCIA REGISTRADA' : 'RESPUESTA REGISTRADA'}
                  </span>
                  <h3 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#0B272D] mt-4 mb-2">
                    {attendance === 'attending'
                      ? `¡Gracias ${firstName}! Tu lugar está reservado`
                      : `Gracias por avisarnos, ${firstName}`}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#1D373C] max-w-md mx-auto leading-relaxed">
                    {attendance === 'attending'
                      ? (savedInvitado.comprobanteUrl
                        ? `Hemos registrado tu asistencia para ${guestCount} persona${guestCount > 1 ? 's' : ''} y recibido tu comprobante. ¡Los novios lo revisarán a la brevedad!`
                        : `Hemos registrado tu asistencia para ${guestCount} persona${guestCount > 1 ? 's' : ''}. Recuerda que puedes subir tu comprobante de transferencia en cualquier momento con tu enlace único o teléfono.`
                      )
                      : 'Lamentamos que no puedas acompañarnos físicamente, pero sabemos que estarás presente con el corazón.'}
                  </p>
                </div>

                {attendance === 'attending' && (
                  <div className="space-y-4">
                    {/* Summary Info */}
                    <div className="bg-[#F7FAF9] rounded-2xl p-4 sm:p-5 border border-[#0B272D]/10 text-left space-y-2.5 max-w-md mx-auto text-xs">
                      <div className="flex justify-between pb-2 border-b border-[#0B272D]/10">
                        <span className="text-[#5A9696] font-semibold">Titular:</span>
                        <span className="font-bold text-[#0B272D]">{firstName} {lastName}</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-[#0B272D]/10">
                        <span className="text-[#5A9696] font-semibold">Lugares Confirmados:</span>
                        <span className="font-bold text-[#0B272D]">{guestCount} Persona{guestCount > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-[#0B272D]/10">
                        <span className="text-[#5A9696] font-semibold">Monto Total:</span>
                        <span className="font-bold text-[#0B272D]">${totalAmount.toLocaleString('es-AR')} ARS</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#5A9696] font-semibold">Estado de Pago:</span>
                        {savedInvitado.estadoPago === 'en_revision' ? (
                          <span className="bg-[#BBDB93] text-[#0B272D] font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                            ✓ Comprobante en Revisión
                          </span>
                        ) : (
                          <span className="bg-[#FAF0E6] text-[#8C5A00] font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                            ⏳ Pendiente de Pago
                          </span>
                        )}
                      </div>
                    </div>

                    {/* UNIQUE PAYMENT LINK BOX */}
                    <div className="bg-[#F5F9F8] border border-[#5A9696]/40 rounded-2xl p-4 sm:p-5 text-left max-w-md mx-auto space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🔗</span>
                        <h4 className="font-bold text-xs uppercase tracking-wider text-[#0B272D]">
                          Tu Enlace Único de Gestión / Pago
                        </h4>
                      </div>
                      <p className="text-[11px] text-gray-600">
                        Guarda este enlace para subir tu comprobante más tarde o consultar el estado de tu confirmación:
                      </p>

                      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-[#0B272D]/15">
                        <input
                          type="text"
                          readOnly
                          value={paymentLink}
                          className="w-full text-xs font-mono bg-transparent text-[#0B272D] focus:outline-none truncate"
                        />
                        <button
                          type="button"
                          onClick={handleCopyLink}
                          className="shrink-0 px-3 py-1.5 rounded-lg bg-[#E0E8E5] hover:bg-[#BBDB93] text-[#0B272D] text-xs font-bold transition-colors"
                        >
                          {copiedLink ? '✓ Copiado' : 'Copiar'}
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleShareWhatsApp}
                          className="flex-1 py-2 px-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <span>💬</span>
                          <span>Abrir en WhatsApp</span>
                        </button>

                        <Link
                          to={`/pago?id=${savedInvitado.id}`}
                          className="flex-1 py-2 px-3 bg-[#0B272D] hover:bg-[#051518] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 text-center"
                        >
                          <span>Subir comprobante →</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <button
                    onClick={() => {
                      const title = encodeURIComponent("Casamiento de Mariana & Carlos");
                      const details = encodeURIComponent("¡Reserva la fecha! Te invitamos a celebrar el casamiento de Mariana y Carlos.");
                      const location = encodeURIComponent("Complejo UNSJ, Ullum, San Juan, Argentina");
                      // 21:00 hs (7 Nov) a 05:00 hs (8 Nov) en Hora Argentina (UTC-3) -> 00:00Z a 08:00Z (8 Nov)
                      const dates = "20261108T000000Z/20261108T080000Z";
                      window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}&ctz=America/Argentina/Buenos_Aires`, '_blank');
                    }}
                    className="bg-[#0B272D] hover:bg-[#051518] text-white text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded-full transition-all"
                  >
                    📅 Agregar al Calendario
                  </button>
                  <button
                    onClick={handleResetForm}
                    className="bg-[#E0E8E5] hover:bg-[#d6e4ba] text-[#0B272D] text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded-full transition-all"
                  >
                    Nueva Confirmación
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
                    <p className="text-[#1D373C] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                      Tu presencia es nuestro mayor regalo.
                    </p>
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

                {/* FIELD 3: Phone (Argentina only) */}
                <div>
                  <label className="block text-xs font-bold text-[#0B272D] tracking-wide uppercase mb-1.5">
                    Teléfono de Contacto (Argentina) <span className="text-[#5A9696]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-xs font-bold text-gray-500">
                      🇦🇷 +54
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder="264 123 4567 o 11 1234 5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-12 pl-18 pr-4 rounded-lg bg-white border border-[#0B272D]/20 text-sm text-[#0B272D] placeholder-[#426B6B]/70 focus:outline-none focus:ring-2 focus:ring-[#5A9696] focus:border-[#5A9696] transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Ingresa los 10 dígitos (código de área + número, sin 0 ni 15). Ej: <strong>2645123456</strong>
                  </p>
                </div>

                {/* FIELD 4: Attendance Selector */}
                <div>
                  <label className="block text-xs font-bold text-[#0B272D] tracking-wide uppercase mb-1.5">
                    ¿Asistirás a la celebración? <span className="text-[#5A9696]">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAttendance('attending')}
                      className={`h-12 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all ${attendance === 'attending'
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
                      className={`h-12 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all ${attendance === 'declined'
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

                    {/* Guest Count Numeric Stepper */}
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

                    {/* Dietary Restrictions & Preferences */}
                    <div>
                      <label className="block text-xs font-bold text-[#0B272D] tracking-wide uppercase mb-1.5">
                        Restricciones Alimentarias
                      </label>
                      <select
                        value={dietary}
                        onChange={(e) => setDietary(e.target.value)}
                        className="w-full h-12 px-4 rounded-xl bg-white border border-[#0B272D]/20 text-sm text-[#0B272D] focus:outline-none focus:ring-2 focus:ring-[#5A9696] focus:border-[#5A9696] transition-all mb-2"
                      >
                        <option value="ninguno">Ninguna restricción (Menú tradicional)</option>
                        <option value="vegetariano">Menú Vegetariano</option>
                        <option value="celiaco">Menú Celíaco / Sin TACC</option>
                        <option value="otros">Otros</option>
                      </select>
                    </div>

                    {dietary === 'otros' && (
                      <div className="animate-fade-in">
                        <label className="block text-xs font-bold text-[#0B272D] tracking-wide uppercase mb-1.5">
                          Especifique sus restricciones alimentarias
                        </label>
                        <input
                          type="text"
                          value={otherDietary}
                          placeholder="Ej: Intolerante a la lactosa, etc."
                          onChange={(e) => setOtherDietary(e.target.value)}
                          className="w-full h-12 px-4 rounded-xl bg-white border border-[#0B272D]/20 text-sm text-[#0B272D] placeholder-[#426B6B]/70 focus:outline-none focus:ring-2 focus:ring-[#5A9696] transition-all"
                        />
                      </div>
                    )}

                    {/* Comment / Observaciones */}
                    <div>
                      <label className="block text-xs font-bold text-[#0B272D] tracking-wide uppercase mb-1.5">
                        Observaciones
                      </label>
                      <textarea
                        rows={2}
                        value={comment}
                        placeholder="Agrega nombres de acompañantes o comentarios adicionales..."
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full p-3.5 rounded-xl bg-white border border-[#0B272D]/20 text-sm text-[#0B272D] placeholder-[#426B6B]/70 focus:outline-none focus:ring-2 focus:ring-[#5A9696] transition-all"
                      />
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
                        className="w-full h-12 px-4 rounded-xl bg-white border border-[#0B272D]/20 text-sm text-[#0B272D] placeholder-[#426B6B]/70 focus:outline-none focus:ring-2 focus:ring-[#5A9696] transition-all"
                      />
                    </div>

                    {/* PAYMENT METHOD SELECTION (DESPLEGABLE SENCILLO) */}
                    <div className="bg-[#F5F9F8] rounded-2xl p-5 sm:p-6 border border-[#5A9696]/30 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="bg-[#D6E4BA] text-[#0B272D] text-[9px] font-bold tracking-wider uppercase px-3 py-1 rounded-full">
                          🌿 FORMA DE PAGO
                        </span>
                        <span className="text-xs font-bold text-[#0B272D]">
                          Total: ${totalAmount.toLocaleString('es-AR')} ARS
                        </span>
                      </div>

                      {/* Dropdown Select */}
                      <div>
                        <label htmlFor="paymentOptionSelect" className="block text-xs font-bold text-[#0B272D] tracking-wide uppercase mb-1.5">
                          Elija la opción de pago o pague despues <span className="text-[#5A9696]">*</span>
                        </label>
                        <select
                          id="paymentOptionSelect"
                          value={paymentOption}
                          onChange={(e) => setPaymentOption(e.target.value as 'ahora' | 'tarde' | 'fraccionado' | '')}
                          className="w-full h-12 px-4 rounded-xl bg-white border border-[#0B272D]/20 text-sm font-semibold text-[#0B272D] focus:outline-none focus:ring-2 focus:ring-[#5A9696] focus:border-[#5A9696] transition-all cursor-pointer shadow-sm"
                        >
                          <option value="">
                            -- Elija la opción de pago --
                          </option>
                          <option value="ahora">💳 Pagar Ahora</option>
                          <option value="fraccionado">💰 Pagar en Cuotas</option>
                          <option value="tarde">⏳ Pagar más Tarde</option>
                        </select>
                      </div>

                      {/* PARTIAL / CUOTAS AMOUNT INPUT */}
                      {paymentOption === 'fraccionado' && (
                        <div className="space-y-1.5 pt-1 animate-fade-in">
                          <label className="block text-xs font-bold text-[#0B272D] tracking-wide uppercase">
                            Monto a transferir ahora ($) <span className="text-[#5A9696]">*</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            placeholder="Ingrese el monto que abona en esta cuota"
                            value={amountPartial === 0 ? '' : amountPartial}
                            onChange={(e) => setAmountPartial(e.target.value ? Number(e.target.value) : 0)}
                            className="w-full h-12 px-4 rounded-xl bg-white border border-[#0B272D]/20 text-sm text-[#0B272D] placeholder-[#426B6B]/70 focus:outline-none focus:ring-2 focus:ring-[#5A9696] focus:border-[#5A9696] transition-all"
                          />
                          <p className="text-[11px] text-gray-500">
                            Podrás abonar las siguientes cuotas en cualquier momento con tu enlace de reserva.
                          </p>
                        </div>
                      )}

                      {/* BANK DETAILS & DROPZONE FOR 'ahora' OR 'fraccionado' */}
                      {(paymentOption === 'ahora' || paymentOption === 'fraccionado') && (
                        <div className="space-y-4 pt-2 animate-fade-in">
                          {/* Bank Details Collapsible Card */}
                          <div className="bg-[#FAFDF9] rounded-2xl p-4 sm:p-5 border border-[#BBDB93]/60 text-xs">
                            <button
                              type="button"
                              onClick={() => setShowBankDetails((prev) => !prev)}
                              className="w-full flex items-center justify-between text-left cursor-pointer transition-colors"
                            >
                              <h3 className="font-bold text-[#0B272D] uppercase tracking-wider text-[11px] sm:text-xs flex items-center gap-1.5">
                                <span>🏦</span>
                                <span>Datos Bancarios para Transferencia</span>
                              </h3>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-[#5A9696] font-semibold">
                                  {showBankDetails ? 'Ocultar' : 'Ver cuentas'}
                                </span>
                                <span className={`text-xs text-[#5A9696] font-bold transition-transform duration-200 inline-block ${showBankDetails ? 'rotate-180' : ''}`}>
                                  ▼
                                </span>
                              </div>
                            </button>

                            {showBankDetails && (
                              <div className="space-y-2.5 pt-3 mt-2 border-t border-[#0B272D]/10 animate-fade-in">
                                {/* Cuenta 1: Banco Nación */}
                                <div className="bg-white p-3 rounded-xl border border-[#0B272D]/10 shadow-xs space-y-2">
                                  {/* Linea 1: Banco y Titular en la misma línea */}
                                  <div className="flex flex-wrap items-center justify-between gap-1 text-xs text-[#0B272D]">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm">🏛️</span>
                                      <span className="font-bold">Banco Nación</span>
                                    </div>
                                    <span className="text-gray-600 text-[11px]">
                                      Titular: <strong className="text-[#0B272D]">Mariana Pickenhayn</strong>
                                    </span>
                                  </div>

                                  {/* Linea 2: Alias con botón copiar */}
                                  <div className="flex items-center justify-between bg-[#F9FBFA] p-2 rounded-lg border border-[#0B272D]/5">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] text-gray-500 uppercase font-bold">Alias:</span>
                                      <span className="font-mono font-bold text-[#0B272D] text-xs sm:text-sm">mariana.pick</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleCopy('mariana.pick', 'alias1')}
                                      className="text-[10px] sm:text-xs font-bold text-[#5A9696] hover:text-[#0B272D] px-2.5 py-1 bg-[#E0E8E5] hover:bg-[#D6E4BA] rounded-lg transition-colors cursor-pointer"
                                    >
                                      {copiedField === 'alias1' ? '✓ ¡Copiado!' : 'Copiar Alias'}
                                    </button>
                                  </div>
                                </div>

                                {/* Cuenta 2: Banco Santander */}
                                <div className="bg-white p-3 rounded-xl border border-[#0B272D]/10 shadow-xs space-y-2">
                                  {/* Linea 1: Banco y Titular en la misma línea */}
                                  <div className="flex flex-wrap items-center justify-between gap-1 text-xs text-[#0B272D]">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm">🏛️</span>
                                      <span className="font-bold">Banco Santander</span>
                                    </div>
                                    <span className="text-gray-600 text-[11px]">
                                      Titular: <strong className="text-[#0B272D]">Camila Peroni Pickenhayn</strong>
                                    </span>
                                  </div>

                                  {/* Linea 2: Alias con botón copiar */}
                                  <div className="flex items-center justify-between bg-[#F9FBFA] p-2 rounded-lg border border-[#0B272D]/5">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] text-gray-500 uppercase font-bold">Alias:</span>
                                      <span className="font-mono font-bold text-[#0B272D] text-xs sm:text-sm">camilapickenhayn</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleCopy('camilapickenhayn', 'alias2')}
                                      className="text-[10px] sm:text-xs font-bold text-[#5A9696] hover:text-[#0B272D] px-2.5 py-1 bg-[#E0E8E5] hover:bg-[#D6E4BA] rounded-lg transition-colors cursor-pointer"
                                    >
                                      {copiedField === 'alias2' ? '✓ ¡Copiado!' : 'Copiar Alias'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
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
                                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all bg-white ${isDragging
                                  ? 'border-[#0B272D] bg-[#D6E4BA]/30 scale-[1.02]'
                                  : 'border-[#5A9696] hover:border-[#0B272D] hover:bg-[#F9FBFA]'
                                  }`}
                              >
                                <span className="text-3xl block mb-2 text-[#5A9696]">☁</span>
                                <p className="text-xs sm:text-sm font-bold text-[#0B272D] mb-1">
                                  Arrastra tu comprobante aquí o haz clic para seleccionarlo
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
                      )}

                      {/* OPTION: PAY LATER -> HELPFUL NOTICE */}
                      {paymentOption === 'tarde' && (
                        <div className="bg-[#E0E8E5]/50 rounded-xl p-4 border border-[#0B272D]/10 text-xs text-[#0B272D] space-y-1 animate-fade-in">
                          <p className="font-bold flex items-center gap-1.5">
                            <span>ℹ️</span> Tu lugar quedará reservado inmediatamente
                          </p>
                          <p className="text-gray-600 text-[11px]">
                            Al enviar el formulario, recibirás tu <strong>enlace exclusivo de pago</strong> y también podrás subir el comprobante cuando quieras desde la sección de comprobantes buscando por tu número de teléfono.
                          </p>
                        </div>
                      )}
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
                        <span>GUARDANDO CONFIRMACIÓN...</span>
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

      {/* POPUP MODAL: DUPLICATE PHONE DETECTED */}
      {
        duplicateGuest && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={() => setDuplicateGuest(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#0B272D]/15 text-center relative space-y-6 transform transition-all animate-scaleUp"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button top right */}
              <button
                type="button"
                onClick={() => setDuplicateGuest(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-base font-bold transition-colors"
                aria-label="Cerrar ventana"
              >
                ✕
              </button>

              {/* Icon badge */}
              <div className="w-16 h-16 rounded-full bg-[#FAF0E6] border-2 border-[#D4A373]/50 text-[#8C5A00] text-3xl flex items-center justify-center mx-auto shadow-sm">
                📋
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#5A9696]">
                  Confirmación Ya Registrada
                </span>
                <h3 className="text-2xl font-serif-display font-bold text-[#0B272D]">
                  ¡Este teléfono ya confirmó asistencia!
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
                  Ya encontramos un registro en el sistema con el número{' '}
                  <strong className="font-mono text-[#0B272D] font-bold bg-[#E0E8E5]/70 px-1.5 py-0.5 rounded">
                    {duplicateGuest.telefono}
                  </strong>. No es necesario volver a completar el formulario.
                </p>
              </div>

              {/* Summary card */}
              <div className="bg-[#F5F9F8] border border-[#5A9696]/30 rounded-2xl p-4 text-left space-y-2.5">
                <div className="flex justify-between items-center pb-2 border-b border-[#0B272D]/10">
                  <span className="text-xs text-gray-500 font-medium">Titular:</span>
                  <span className="text-sm font-bold text-[#0B272D]">
                    {duplicateGuest.nombre} {duplicateGuest.apellido}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#0B272D]/10">
                  <span className="text-xs text-gray-500 font-medium">Asistencia:</span>
                  <span className="text-xs font-semibold text-[#0B272D]">
                    {duplicateGuest.asistencia === 'attending'
                      ? `✓ Sí asiste (${duplicateGuest.invitados} ${duplicateGuest.invitados > 1 ? 'personas' : 'persona'})`
                      : '✗ No asiste'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium">Estado del Pago:</span>
                  <div>
                    {duplicateGuest.estadoPago === 'aprobado' ? (
                      <span className="bg-[#EBF7EE] text-[#1B6E32] font-bold px-2.5 py-0.5 rounded-full text-xs">
                        ✓ Pago Aprobado
                      </span>
                    ) : duplicateGuest.estadoPago === 'en_revision' ? (
                      <span className="bg-[#EBF5FB] text-[#1D6F93] font-bold px-2.5 py-0.5 rounded-full text-xs">
                        🔍 En Revisión
                      </span>
                    ) : duplicateGuest.estadoPago === 'no_aplica' ? (
                      <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-0.5 rounded-full text-xs">
                        No aplica
                      </span>
                    ) : (
                      <span className="bg-[#FAF0E6] text-[#8C5A00] font-bold px-2.5 py-0.5 rounded-full text-xs">
                        ⏳ Pendiente de Pago
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  to={`/pago?id=${duplicateGuest.id}`}
                  className="flex-1 py-3.5 px-4 bg-[#0B272D] hover:bg-[#051518] text-white text-xs sm:text-sm font-bold rounded-xl transition-all text-center flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  onClick={() => setDuplicateGuest(null)}
                >
                  <span>💳</span>
                  <span>Ver mi reserva o subir comprobante →</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setDuplicateGuest(null)}
                  className="py-3.5 px-5 bg-[#E0E8E5] hover:bg-[#D6E4BA] text-[#0B272D] text-xs sm:text-sm font-bold rounded-xl transition-all"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )
      }
    </section >
  );
};
