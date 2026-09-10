import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { db, storage } from '../firebase/firebase';

export type EstadoPago = 'pendiente' | 'parcialmente_pagado' | 'en_revision' | 'aprobado' | 'rechazado' | 'no_aplica';
export type OpcionPago = 'ahora' | 'tarde' | 'fraccionado' | 'no_aplica';
export type Asistencia = 'attending' | 'declined';

export interface PagoItem {
  id: string;
  monto: number;
  comprobanteUrl?: string | null;
  comprobanteNombre?: string | null;
  fecha: any;
}

export interface Invitado {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  asistencia: Asistencia;
  invitados: number;
  restriccionAlimentaria: string;
  otros: string;
  observacion?: string;
  cancion?: string;
  opcionPago: OpcionPago;
  montoTotal: number;
  montoPagado: number;
  estadoPago: EstadoPago;
  comprobanteUrl: string | null;
  comprobanteNombre: string | null;
  fechaRegistro: any;
  fechaPago: any | null;
  pagos?: PagoItem[];
}

export type InvitadoInput = Omit<Invitado, 'id' | 'comprobanteUrl' | 'comprobanteNombre' | 'fechaRegistro' | 'fechaPago' | 'pagos'>;

export class TelefonoDuplicadoError extends Error {
  invitadoExistente: Invitado;
  constructor(invitado: Invitado) {
    super(`Ya existe una confirmación registrada con el teléfono ${invitado.telefono}`);
    this.name = 'TelefonoDuplicadoError';
    this.invitadoExistente = invitado;
  }
}

/**
 * Normaliza un número de teléfono de Argentina a un estándar de 10 dígitos
 * (código de área + número local sin 0 ni 15).
 * Ejemplos:
 * - "+54 9 264 512-3456" -> "2645123456"
 * - "0264 15 5123456"    -> "2645123456"
 * - "011 15 4567 8901"   -> "1145678901"
 * - "2645123456"         -> "2645123456"
 */
export const normalizeArgentinaPhone = (phone: string): string => {
  let digits = phone.replace(/[^0-9]/g, '');

  // Quitar prefijo internacional si empieza con 0054, 549 o 54 (si tiene más de 10 dígitos)
  if (digits.startsWith('0054')) {
    digits = digits.slice(4);
  } else if (digits.startsWith('549')) {
    digits = digits.slice(3);
  } else if (digits.startsWith('54') && digits.length > 10) {
    digits = digits.slice(2);
  }

  // Quitar el '0' inicial del código de área si está presente
  if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  // Si tiene 12 dígitos, remover el '15' de telefonía móvil según el código de área:
  // Área de 2 dígitos (AMBA / BsAs: 11) -> 11 15 xxxxxxxx
  if (digits.length === 12 && digits.startsWith('11') && digits.slice(2, 4) === '15') {
    digits = digits.slice(0, 2) + digits.slice(4);
  }
  // Área de 3 dígitos (ej: 264, 261, 351, 341, 221, etc.) -> 264 15 xxxxxxx
  else if (digits.length === 12 && ['2', '3'].includes(digits[0]) && digits.slice(3, 5) === '15') {
    digits = digits.slice(0, 3) + digits.slice(5);
  }
  // Área de 4 dígitos (ej: 2648, 2966, etc.) -> 2648 15 xxxxxx
  else if (digits.length === 12 && digits.slice(4, 6) === '15') {
    digits = digits.slice(0, 4) + digits.slice(6);
  }

  return digits;
};

/**
 * Valida si un número es un teléfono argentino válido (debe tener 10 dígitos con código de área válido).
 */
export const isArgentinaPhoneValid = (phone: string): boolean => {
  const normalized = normalizeArgentinaPhone(phone);
  // En Argentina, los teléfonos tienen 10 dígitos y el código de área inicia con 1, 2, 3 o 4
  return /^[1-4][0-9]{9}$/.test(normalized) && normalized.length === 10;
};

// Mantiene compatibilidad con llamadas existentes
export const normalizePhone = (phone: string): string => {
  return normalizeArgentinaPhone(phone);
};

/**
 * Comprime una imagen si es JPG/PNG/WEBP. Si es PDF, lo devuelve intacto.
 */
export const compressFileIfNeeded = async (file: File): Promise<File> => {
  if (file.type === 'application/pdf') {
    return file;
  }

  const options = {
    maxSizeMB: 1, // Tamaño objetivo máx 1MB
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    return new File([compressedBlob], file.name, { type: file.type });
  } catch (error) {
    console.warn('No se pudo comprimir la imagen, se subirá original:', error);
    return file;
  }
};

/**
 * Sube el comprobante a Firebase Storage en la carpeta `comprobantes/{invitadoId}/`
 */
export const uploadComprobanteStorage = async (
  file: File,
  invitadoId: string
): Promise<{ downloadUrl: string; fileName: string }> => {
  try {
    const processedFile = await compressFileIfNeeded(file);
    const fileExt = processedFile.name.split('.').pop() || 'jpg';
    const fileName = `comprobante_${Date.now()}.${fileExt}`;
    const fileRef = ref(storage, `comprobantes/${invitadoId}/${fileName}`);

    //console.log(`[Storage] Subiendo archivo a comprobantes/${invitadoId}/${fileName}...`);
    const snapshot = await uploadBytes(fileRef, processedFile);
    //console.log('[Storage] Archivo subido con éxito. Obteniendo downloadURL...');

    const downloadUrl = await getDownloadURL(snapshot.ref);
    //console.log('[Storage] downloadURL obtenida:', downloadUrl);

    return { downloadUrl, fileName };
  } catch (error: any) {
    //console.error('[Storage Error] Falló la subida u obtención de URL del comprobante:', error);
    throw error;
  }
};

/**
 * Crea un nuevo registro de confirmación de asistencia en Firestore
 * Valida que el teléfono sea de Argentina y no esté previamente registrado.
 */
export const createInvitado = async (
  data: InvitadoInput,
  file?: File | null
): Promise<Invitado> => {
  if (!isArgentinaPhoneValid(data.telefono)) {
    throw new Error('Solo se permiten números de teléfono válidos de Argentina (ej: 264 123 4567 o 11 1234 5678).');
  }

  const cleanPhone = normalizeArgentinaPhone(data.telefono);

  // Validar si ya existe una confirmación registrada con este teléfono
  const existentes = await getInvitadosByTelefono(cleanPhone);
  if (existentes.length > 0) {
    throw new TelefonoDuplicadoError(existentes[0]);
  }

  const isAttending = data.asistencia === 'attending';
  const opcionPago: OpcionPago = isAttending ? data.opcionPago : 'no_aplica';

  let montoInicialPagado = 0;
  if (isAttending) {
    if (opcionPago === 'ahora') {
      montoInicialPagado = data.montoPagado || data.montoTotal;
    } else if (opcionPago === 'fraccionado') {
      montoInicialPagado = data.montoPagado || 0;
    } else {
      montoInicialPagado = 0;
    }
  }

  const estadoPago: EstadoPago = !isAttending
    ? 'no_aplica'
    : (file ? 'en_revision' : (montoInicialPagado > 0 ? 'parcialmente_pagado' : 'pendiente'));

  // Generar ID de documento de antemano
  const docRef = doc(collection(db, 'invitados'));
  const invitadoId = docRef.id;

  let comprobanteUrl: string | null = null;
  let comprobanteNombre: string | null = null;
  let fechaPago: any = null;
  let pagosList: PagoItem[] = [];

  // Si adjuntó comprobante o registró pago inicial, subirlo primero
  if (isAttending && (file || montoInicialPagado > 0)) {
    if (file) {
      const uploadResult = await uploadComprobanteStorage(file, invitadoId);
      comprobanteUrl = uploadResult.downloadUrl;
      comprobanteNombre = uploadResult.fileName;
      fechaPago = serverTimestamp();
    }

    const initialPago: PagoItem = {
      id: `pago_${Date.now()}`,
      monto: montoInicialPagado,
      comprobanteUrl: comprobanteUrl || null,
      comprobanteNombre: comprobanteNombre || null,
      fecha: new Date().toISOString(),
    };
    pagosList = [initialPago];
  }

  // Guardar documento completo en Firestore de una sola vez (atómico)
  const docData = {
    nombre: data.nombre.trim(),
    apellido: data.apellido.trim(),
    telefono: cleanPhone,
    asistencia: data.asistencia,
    invitados: isAttending ? data.invitados : 0,
    restriccionAlimentaria: data.restriccionAlimentaria || 'ninguno',
    otros: data.otros?.trim() || '',
    observacion: data.observacion?.trim() || '',
    cancion: data.cancion?.trim() || '',
    opcionPago,
    montoTotal: isAttending ? data.montoTotal : 0,
    montoPagado: montoInicialPagado,
    estadoPago,
    comprobanteUrl,
    comprobanteNombre,
    fechaRegistro: serverTimestamp(),
    fechaPago,
    pagos: pagosList,
  };

  await setDoc(docRef, docData);

  return {
    id: invitadoId,
    ...docData,
    comprobanteUrl,
    comprobanteNombre,
    fechaPago,
    pagos: pagosList,
  };
};

/**
 * Consulta un invitado por su ID único
 */
export const getInvitadoById = async (id: string): Promise<Invitado | null> => {
  if (!id) return null;
  const docSnap = await getDoc(doc(db, 'invitados', id));
  if (!docSnap.exists()) {
    return null;
  }
  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Invitado;
};

/**
 * Consulta invitados por teléfono
 */
export const getInvitadosByTelefono = async (telefono: string): Promise<Invitado[]> => {
  const cleanPhone = normalizePhone(telefono);
  if (!cleanPhone) return [];

  const q = query(
    collection(db, 'invitados'),
    where('telefono', '==', cleanPhone)
  );

  const querySnapshot = await getDocs(q);
  const results: Invitado[] = [];

  querySnapshot.forEach((doc) => {
    results.push({
      id: doc.id,
      ...doc.data(),
    } as Invitado);
  });

  return results;
};

/**
 * Agrega un nuevo pago / comprobante a un invitado existente de forma histórica y acumulativa
 */
export const addPagoInvitado = async (
  invitadoId: string,
  monto: number,
  file?: File | null
): Promise<{ invitadoActualizado: Invitado; nuevoPago: PagoItem }> => {
  const invitadoDoc = await getInvitadoById(invitadoId);
  if (!invitadoDoc) {
    throw new Error('No se encontró el invitado.');
  }

  let downloadUrl: string | null = null;
  let fileName: string | null = null;

  if (file) {
    const uploadResult = await uploadComprobanteStorage(file, invitadoId);
    downloadUrl = uploadResult.downloadUrl;
    fileName = uploadResult.fileName;
  }

  const existingPagos: PagoItem[] = Array.isArray(invitadoDoc.pagos) ? [...invitadoDoc.pagos] : [];

  // Si tiene un comprobante anterior que no estaba en el array pagos, migrarlo
  if (existingPagos.length === 0 && (invitadoDoc.comprobanteUrl || (invitadoDoc.montoPagado && invitadoDoc.montoPagado > 0))) {
    existingPagos.push({
      id: `pago_legacy_${Date.now()}`,
      monto: invitadoDoc.montoPagado || 0,
      comprobanteUrl: invitadoDoc.comprobanteUrl || null,
      comprobanteNombre: invitadoDoc.comprobanteNombre || null,
      fecha: invitadoDoc.fechaPago || invitadoDoc.fechaRegistro || new Date().toISOString(),
    });
  }

  const nuevoPago: PagoItem = {
    id: `pago_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    monto: Number(monto) || 0,
    comprobanteUrl: downloadUrl || null,
    comprobanteNombre: fileName || null,
    fecha: new Date().toISOString(),
  };

  existingPagos.push(nuevoPago);

  const nuevoMontoPagado = (invitadoDoc.montoPagado || 0) + (Number(monto) || 0);
  const nuevoEstado: EstadoPago = file
    ? 'en_revision'
    : (nuevoMontoPagado >= invitadoDoc.montoTotal && invitadoDoc.montoTotal > 0
      ? (invitadoDoc.estadoPago === 'aprobado' ? 'aprobado' : 'en_revision')
      : (nuevoMontoPagado > 0 ? 'parcialmente_pagado' : invitadoDoc.estadoPago));

  await updateDoc(doc(db, 'invitados', invitadoId), {
    pagos: existingPagos,
    montoPagado: nuevoMontoPagado,
    estadoPago: nuevoEstado,
    comprobanteUrl: downloadUrl || invitadoDoc.comprobanteUrl,
    comprobanteNombre: fileName || invitadoDoc.comprobanteNombre,
    fechaPago: serverTimestamp(),
  });

  const invitadoActualizado: Invitado = {
    ...invitadoDoc,
    pagos: existingPagos,
    montoPagado: nuevoMontoPagado,
    estadoPago: nuevoEstado,
    comprobanteUrl: downloadUrl || invitadoDoc.comprobanteUrl,
    comprobanteNombre: fileName || invitadoDoc.comprobanteNombre,
    fechaPago: new Date(),
  };

  return { invitadoActualizado, nuevoPago };
};

/**
 * Actualiza el comprobante de un invitado existente (Compatible con llamadas anteriores)
 */
export const updateComprobanteInvitado = async (
  invitadoId: string,
  file: File,
  monto?: number
): Promise<{ downloadUrl: string; fileName: string }> => {
  const invitado = await getInvitadoById(invitadoId);
  const montoAbono = monto !== undefined ? monto : (invitado ? Math.max(0, invitado.montoTotal - (invitado.montoPagado || 0)) : 0);
  const { nuevoPago } = await addPagoInvitado(invitadoId, montoAbono, file);
  return {
    downloadUrl: nuevoPago.comprobanteUrl || '',
    fileName: nuevoPago.comprobanteNombre || '',
  };
};

/**
 * Obtiene la lista completa de invitados para el Dashboard
 */
export const getAllInvitados = async (): Promise<Invitado[]> => {
  const q = query(collection(db, 'invitados'));
  const querySnapshot = await getDocs(q);
  const results: Invitado[] = [];

  querySnapshot.forEach((doc) => {
    results.push({
      id: doc.id,
      ...doc.data(),
    } as Invitado);
  });

  return results;
};

/**
 * Actualiza el estado de pago de un invitado (Admin)
 */
export const updateEstadoPago = async (
  invitadoId: string,
  nuevoEstado: EstadoPago
): Promise<void> => {
  await updateDoc(doc(db, 'invitados', invitadoId), {
    estadoPago: nuevoEstado,
  });
};

/**
 * Elimina un registro de invitado (Admin)
 */
export const deleteInvitado = async (invitadoId: string): Promise<void> => {
  const { deleteDoc } = await import('firebase/firestore');
  await deleteDoc(doc(db, 'invitados', invitadoId));
};


