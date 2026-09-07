import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  getInvitadoById, 
  getInvitadosByTelefono, 
  updateComprobanteInvitado, 
  type Invitado 
} from '../services/rsvpService';

interface AttachedFile {
  file: File;
  name: string;
  sizeFormatted: string;
  previewUrl?: string;
}

export const Pago: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const idFromUrl = searchParams.get('id');

  // Query & Lookup States
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [invitado, setInvitado] = useState<Invitado | null>(null);
  const [searchPhone, setSearchPhone] = useState('');
  const [searchingPhone, setSearchingPhone] = useState(false);
  const [phoneSearchError, setPhoneSearchError] = useState<string | null>(null);
  const [phoneSearchResults, setPhoneSearchResults] = useState<Invitado[] | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // File Upload States
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Bank Info
  const bankData = {
    cbu: '0000003100012345678901',
    alias: 'BODA.VALEN.MATEO',
    bank: 'Banco Santander',
    owner: 'Valentina Rossi & Mateo Fernández',
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Load invitation if ID in URL
  useEffect(() => {
    if (idFromUrl) {
      loadInvitadoById(idFromUrl);
    } else {
      setInvitado(null);
    }
  }, [idFromUrl]);

  const loadInvitadoById = async (id: string) => {
    setLoadingInitial(true);
    setGeneralError(null);
    setPhoneSearchError(null);
    try {
      const data = await getInvitadoById(id);
      if (data) {
        setInvitado(data);
      } else {
        setGeneralError('No encontramos ninguna reserva con ese identificador. Puedes buscarla con tu número de teléfono.');
        setInvitado(null);
      }
    } catch (err) {
      console.error('Error al consultar invitación:', err);
      setGeneralError('Ocurrió un error al cargar la información. Intenta nuevamente.');
    } finally {
      setLoadingInitial(false);
    }
  };

  const handleSearchByPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPhone.trim()) {
      setPhoneSearchError('Por favor ingresa tu número de teléfono.');
      return;
    }

    setSearchingPhone(true);
    setPhoneSearchError(null);
    setGeneralError(null);
    setPhoneSearchResults(null);

    try {
      const results = await getInvitadosByTelefono(searchPhone);
      if (results.length === 0) {
        setPhoneSearchError(
          'No encontramos ninguna confirmación con este número. Verifica los dígitos o completa el formulario de asistencia inicial.'
        );
      } else if (results.length === 1) {
        setInvitado(results[0]);
        setSearchParams({ id: results[0].id });
      } else {
        setPhoneSearchResults(results);
      }
    } catch (err) {
      console.error('Error buscando por teléfono:', err);
      setPhoneSearchError('Ocurrió un problema en la búsqueda. Intenta nuevamente.');
    } finally {
      setSearchingPhone(false);
    }
  };

  const handleSelectFromResult = (selected: Invitado) => {
    setInvitado(selected);
    setPhoneSearchResults(null);
    setSearchParams({ id: selected.id });
  };

  // Process selected file
  const handleFileSelect = (file: File) => {
    setFileError(null);

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setFileError('Formato no permitido. Solo se aceptan archivos JPG, PNG, WEBP o PDF.');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5 MB
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

  const handleClearFile = () => {
    if (attachedFile?.previewUrl) {
      URL.revokeObjectURL(attachedFile.previewUrl);
    }
    setAttachedFile(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitado || !attachedFile) {
      setFileError('Por favor selecciona tu comprobante para enviar.');
      return;
    }

    setIsSubmitting(true);
    setFileError(null);

    try {
      const { downloadUrl, fileName } = await updateComprobanteInvitado(invitado.id, attachedFile.file);
      setInvitado({
        ...invitado,
        comprobanteUrl: downloadUrl,
        comprobanteNombre: fileName,
        estadoPago: 'en_revision',
        fechaPago: new Date(),
      });
      setUploadSuccess(true);
    } catch (err) {
      console.error('Error al subir comprobante:', err);
      setFileError('Error al subir el archivo. Verifica tu conexión e inténtalo nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!invitado) return;
    const url = `${window.location.origin}/pago?id=${invitado.id}`;
    const text = encodeURIComponent(
      `¡Hola! Acá tengo el enlace para subir el comprobante de pago de la boda de Mariana y Carlos:\n${url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#EDF4E7] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans text-[#1D373C]">
      {/* Decorative Botanical Glows */}
      <div className="absolute top-10 left-[-80px] w-96 h-96 bg-[#BBDB93]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-[-80px] w-96 h-96 bg-[#5A9696]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Top Header */}
        <div className="text-center mb-8">
          <Link
            to="/#rsvp"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#5A9696] hover:text-[#0B272D] transition-colors mb-4"
          >
            ← Volver a la Invitación
          </Link>
          <span className="text-[#5A9696] font-semibold text-xs tracking-[0.25em] uppercase block mb-2">
            GESTIÓN DE COMPROBANTES
          </span>
          <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B272D]">
            Comprobante de Pago
          </h1>
          <p className="text-sm sm:text-base text-[#1D373C]/80 max-w-xl mx-auto mt-2">
            Adjunta tu comprobante de transferencia para que podamos registrar y confirmar tu lugar en la fiesta.
          </p>
        </div>

        {/* LOADING SKELETON */}
        {loadingInitial && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-[#0B272D]/10 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#BBDB93] border-t-[#0B272D] rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-[#0B272D]">Buscando tu confirmación...</p>
          </div>
        )}

        {/* STATE: NO INVITADO LOADED -> PHONE SEARCH FORM */}
        {!loadingInitial && !invitado && (
          <div className="bg-white rounded-3xl shadow-xl border border-[#0B272D]/15 overflow-hidden transition-all duration-300 max-w-xl mx-auto">
            <div className="h-2 bg-gradient-to-r from-[#5A9696] via-[#BBDB93] to-[#5A9696]" />

            <div className="p-6 sm:p-10 space-y-6">
              
              {generalError && (
                <div className="bg-[#FAF0F0] border border-[#E5BABA] text-[#8C1C00] p-4 rounded-xl text-xs font-medium flex items-start gap-3">
                  <span className="text-base mt-0.5">⚠️</span>
                  <div>{generalError}</div>
                </div>
              )}

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#E0E8E5] text-2xl flex items-center justify-center mx-auto mb-3">
                  🔍
                </div>
                <h2 className="font-serif-display text-2xl font-bold text-[#0B272D]">
                  Buscar mi Confirmación
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Ingresa el número de teléfono con el que confirmaste asistencia para cargar tu comprobante.
                </p>
              </div>

              <form onSubmit={handleSearchByPhone} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0B272D] tracking-wide uppercase mb-1.5">
                    Número de Teléfono
                  </label>
                  <input
                    type="tel"
                    placeholder="Ej: 2641234567"
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                    required
                    className="w-full h-12 px-4 rounded-xl bg-[#F7FAF9] border border-[#0B272D]/20 text-sm text-[#0B272D] placeholder-[#426B6B]/60 focus:outline-none focus:ring-2 focus:ring-[#5A9696] transition-all"
                  />
                </div>

                {phoneSearchError && (
                  <div className="bg-[#FAF0F0] border border-[#E5BABA] text-[#8C1C00] p-4 rounded-xl text-xs font-medium space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-base">⚠️</span>
                      <p>{phoneSearchError}</p>
                    </div>
                    <div className="pt-2 border-t border-[#E5BABA]/60 text-right">
                      <Link
                        to="/#rsvp"
                        className="inline-block font-bold text-[#0B272D] underline hover:text-[#5A9696]"
                      >
                        Ir al formulario de confirmación inicial →
                      </Link>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={searchingPhone}
                  className="w-full h-12 bg-[#0B272D] hover:bg-[#051518] disabled:bg-[#0B272D]/60 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  {searchingPhone ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Buscando...</span>
                    </>
                  ) : (
                    <span>Buscar mi invitación</span>
                  )}
                </button>
              </form>

              {/* Multiple results found */}
              {phoneSearchResults && phoneSearchResults.length > 0 && (
                <div className="pt-4 border-t border-[#0B272D]/10 space-y-3">
                  <p className="text-xs font-bold text-[#0B272D] uppercase tracking-wider">
                    Selecciona tu confirmación:
                  </p>
                  <div className="space-y-2">
                    {phoneSearchResults.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectFromResult(item)}
                        className="p-3.5 bg-[#F7FAF9] hover:bg-[#D6E4BA]/40 border border-[#0B272D]/10 rounded-xl cursor-pointer flex items-center justify-between transition-all"
                      >
                        <div>
                          <p className="font-bold text-sm text-[#0B272D]">
                            {item.nombre} {item.apellido}
                          </p>
                          <p className="text-xs text-[#5A9696]">
                            {item.invitados} Persona{item.invitados > 1 ? 's' : ''} · Estado: {item.estadoPago}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-[#0B272D] bg-white px-3 py-1 rounded-full border border-[#0B272D]/15">
                          Seleccionar →
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STATE: INVITADO LOADED */}
        {!loadingInitial && invitado && (
          <div className="bg-white rounded-3xl shadow-xl border border-[#0B272D]/15 overflow-hidden transition-all duration-300">
            <div className="h-2 bg-gradient-to-r from-[#5A9696] via-[#BBDB93] to-[#5A9696]" />

            <div className="p-6 sm:p-10 space-y-8">
              
              {/* Header inside Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#0B272D]/10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#D6E4BA] text-[#0B272D] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                      INVITACIÓN CONFIRMADA
                    </span>
                    {invitado.estadoPago === 'aprobado' && (
                      <span className="bg-[#BBDB93] text-[#0B272D] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                        ✓ PAGO APROBADO
                      </span>
                    )}
                    {invitado.estadoPago === 'en_revision' && (
                      <span className="bg-[#E0E8E5] text-[#0B272D] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                        ⏳ EN REVISIÓN
                      </span>
                    )}
                    {invitado.estadoPago === 'pendiente' && (
                      <span className="bg-[#FAF0E6] text-[#8C5A00] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                        ⚠️ PAGO PENDIENTE
                      </span>
                    )}
                  </div>
                  <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#0B272D]">
                    Hola {invitado.nombre} {invitado.apellido}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5A9696] font-medium">
                    {invitado.invitados} Lugar{invitado.invitados > 1 ? 'es' : ''} reservado{invitado.invitados > 1 ? 's' : ''} · Tel: {invitado.telefono}
                  </p>
                </div>

                {/* Change Invitation / Search button */}
                <button
                  onClick={() => {
                    setInvitado(null);
                    setSearchParams({});
                    setUploadSuccess(false);
                  }}
                  className="text-xs font-semibold text-[#5A9696] hover:text-[#0B272D] transition-colors self-start sm:self-auto underline"
                >
                  Buscar otro teléfono
                </button>
              </div>

              {/* UPLOAD SUCCESS BANNER */}
              {uploadSuccess && (
                <div className="bg-[#EAF5DF] border-2 border-[#BBDB93] rounded-2xl p-6 text-center space-y-3 animate-fade-in">
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#BBDB93] text-[#0B272D] flex items-center justify-center text-2xl font-bold shadow-md">
                    ✓
                  </div>
                  <h3 className="font-serif-display text-2xl font-bold text-[#0B272D]">
                    ¡Comprobante Recibido con Éxito!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#1D373C] max-w-md mx-auto">
                    Tu comprobante ha sido subido correctamente y está en proceso de verificación por los novios.
                  </p>
                </div>
              )}

              {/* SUMMARY GRID & BANK DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left: Summary Details Card */}
                <div className="bg-[#F7FAF9] rounded-2xl p-5 border border-[#0B272D]/10 space-y-3 text-xs">
                  <h3 className="font-bold text-[#0B272D] uppercase tracking-wider text-[11px] pb-2 border-b border-[#0B272D]/10 flex items-center justify-between">
                    <span>Resumen de Reserva</span>
                    <span>🌿</span>
                  </h3>

                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Titular:</span>
                    <span className="font-bold text-[#0B272D]">{invitado.nombre} {invitado.apellido}</span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Cantidad de Invitados:</span>
                    <span className="font-bold text-[#0B272D]">{invitado.invitados} Persona{invitado.invitados > 1 ? 's' : ''}</span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Monto por Cubierto:</span>
                    <span className="font-bold text-[#0B272D]">$75.000 ARS</span>
                  </div>

                  <div className="flex justify-between py-2 border-t border-[#0B272D]/10 text-sm">
                    <span className="font-bold text-[#0B272D]">Total a Transferir:</span>
                    <span className="font-bold text-[#0B272D] text-base">${invitado.montoTotal.toLocaleString('es-AR')} ARS</span>
                  </div>

                  {invitado.comprobanteUrl && (
                    <div className="pt-2 border-t border-[#0B272D]/10">
                      <span className="text-gray-500 block mb-1">Comprobante actual:</span>
                      <a
                        href={invitado.comprobanteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-bold text-[#5A9696] hover:text-[#0B272D] underline text-[11px]"
                      >
                        📄 Ver archivo adjunto ({invitado.comprobanteNombre || 'Comprobante'})
                      </a>
                    </div>
                  )}
                </div>

                {/* Right: Bank Transfer Details Card */}
                <div className="bg-[#F5F9F8] rounded-2xl p-5 border border-[#5A9696]/30 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#5A9696]/20">
                    <span className="bg-[#D6E4BA] text-[#0B272D] text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full">
                      DATOS BANCARIOS
                    </span>
                    <span className="text-[#5A9696] font-bold text-[11px]">{bankData.bank}</span>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <span className="text-gray-500 block text-[10px] uppercase">Titulares de la cuenta</span>
                      <p className="font-bold text-[#0B272D]">{bankData.owner}</p>
                    </div>

                    <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-[#0B272D]/10">
                      <div>
                        <span className="text-gray-500 block text-[9px] uppercase font-bold">Alias</span>
                        <span className="font-mono font-bold text-[#0B272D]">{bankData.alias}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(bankData.alias, 'alias')}
                        className="text-[10px] font-bold px-2.5 py-1 rounded bg-[#E0E8E5] hover:bg-[#BBDB93] text-[#0B272D] transition-colors"
                      >
                        {copiedField === 'alias' ? '✓ Copiado' : 'Copiar'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-[#0B272D]/10">
                      <div>
                        <span className="text-gray-500 block text-[9px] uppercase font-bold">CBU</span>
                        <span className="font-mono font-bold text-xs text-[#0B272D]">{bankData.cbu}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(bankData.cbu, 'cbu')}
                        className="text-[10px] font-bold px-2.5 py-1 rounded bg-[#E0E8E5] hover:bg-[#BBDB93] text-[#0B272D] transition-colors"
                      >
                        {copiedField === 'cbu' ? '✓ Copiado' : 'Copiar'}
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* UPLOAD FORM SECTION */}
              <div className="pt-4 border-t border-[#0B272D]/10">
                <h3 className="font-serif-display text-xl font-bold text-[#0B272D] mb-1">
                  {invitado.comprobanteUrl ? '¿Deseas reemplazar el comprobante?' : 'Adjuntar Comprobante de Transferencia'}
                </h3>
                <p className="text-xs text-gray-600 mb-4">
                  Sube una foto clara de la transferencia bancaria o el archivo PDF emitido por tu banco.
                </p>

                <form onSubmit={handleUploadSubmit} className="space-y-4">
                  {/* Hidden input */}
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
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                          handleFileSelect(e.dataTransfer.files[0]);
                        }
                      }}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all bg-[#F9FBFA] ${
                        isDragging
                          ? 'border-[#0B272D] bg-[#D6E4BA]/40 scale-[1.01]'
                          : 'border-[#5A9696]/60 hover:border-[#0B272D] hover:bg-white'
                      }`}
                    >
                      <span className="text-3xl block mb-2 text-[#5A9696]">☁</span>
                      <p className="text-xs sm:text-sm font-bold text-[#0B272D] mb-1">
                        Arrastra tu comprobante aquí o haz clic para seleccionarlo
                      </p>
                      <p className="text-[11px] text-[#5A9696]">
                        Formatos aceptados: JPG, PNG, WEBP, PDF · Máximo 5 MB
                      </p>
                      <button
                        type="button"
                        className="mt-3 inline-block text-[11px] font-semibold text-[#0B272D] bg-white border border-[#0B272D]/30 px-4 py-1.5 rounded-full hover:bg-[#BBDB93] transition-colors shadow-sm"
                      >
                        Seleccionar Archivo
                      </button>
                    </div>
                  ) : (
                    /* Selected Preview Chip */
                    <div className="bg-[#F7FAF9] rounded-2xl p-4 border border-[#5A9696]/40 flex items-center justify-between shadow-sm animate-fade-in">
                      <div className="flex items-center gap-3 overflow-hidden">
                        {attachedFile.previewUrl ? (
                          <img
                            src={attachedFile.previewUrl}
                            alt="Vista previa"
                            className="w-12 h-12 object-cover rounded-xl border border-[#0B272D]/10 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-[#E0E8E5] flex items-center justify-center text-2xl shrink-0">
                            📄
                          </div>
                        )}
                        <div className="truncate">
                          <p className="text-xs font-bold text-[#0B272D] truncate">
                            {attachedFile.name}
                          </p>
                          <p className="text-[11px] text-[#5A9696]">
                            {attachedFile.sizeFormatted} · <span className="font-semibold text-[#0B272D]">Listo para subir</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={handleClearFile}
                          className="w-8 h-8 rounded-full bg-[#FAF0F0] text-[#8C1C00] hover:bg-[#8C1C00] hover:text-white flex items-center justify-center text-xs font-bold transition-colors"
                          title="Quitar archivo"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}

                  {fileError && (
                    <p className="text-xs text-[#8C1C00] font-semibold">
                      ⚠️ {fileError}
                    </p>
                  )}

                  {attachedFile && (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-[#0B272D] hover:bg-[#051518] disabled:bg-[#0B272D]/60 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Subiendo comprobante...</span>
                        </>
                      ) : (
                        <span>Subir y Guardar Comprobante</span>
                      )}
                    </button>
                  )}
                </form>
              </div>

              {/* ACTION LINKS / SHARE VIA WHATSAPP */}
              <div className="pt-4 border-t border-[#0B272D]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold rounded-full transition-colors shadow-sm"
                >
                  <span>💬</span>
                  <span>Guardar enlace en WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const url = `${window.location.origin}/pago?id=${invitado.id}`;
                    handleCopy(url, 'link');
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#E0E8E5] hover:bg-[#D6E4BA] text-[#0B272D] font-bold rounded-full transition-colors"
                >
                  <span>🔗</span>
                  <span>{copiedField === 'link' ? '✓ ¡Enlace copiado!' : 'Copiar enlace único'}</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Pago;
