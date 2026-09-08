import {
  collection,
  doc,
  addDoc,
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

export type EstadoPago = 'pendiente' | 'en_revision' | 'aprobado' | 'rechazado' | 'no_aplica';
export type OpcionPago = 'ahora' | 'tarde' | 'fraccionado' | 'no_aplica';
export type Asistencia = 'attending' | 'declined';

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
}

export type InvitadoInput = Omit<Invitado, 'id' | 'comprobanteUrl' | 'comprobanteNombre' | 'fechaRegistro' | 'fechaPago'>;

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

    console.log(`[Storage] Subiendo archivo a comprobantes/${invitadoId}/${fileName}...`);
    const snapshot = await uploadBytes(fileRef, processedFile);
    console.log('[Storage] Archivo subido con éxito. Obteniendo downloadURL...');

    const downloadUrl = await getDownloadURL(snapshot.ref);
    console.log('[Storage] downloadURL obtenida:', downloadUrl);

    return { downloadUrl, fileName };
  } catch (error: any) {
    console.error('[Storage Error] Falló la subida u obtención de URL del comprobante:', error);
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
  const estadoPago: EstadoPago = !isAttending
    ? 'no_aplica'
    : (file ? 'en_revision' : 'pendiente');
  const opcionPago: OpcionPago = isAttending ? data.opcionPago : 'no_aplica';

  // Inicializar documento en Firestore
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
    montoPagado: data.montoPagado || 0,
    estadoPago,
    comprobanteUrl: null as string | null,
    comprobanteNombre: null as string | null,
    fechaRegistro: serverTimestamp(),
    fechaPago: null as any,
  };

  const docRef = await addDoc(collection(db, 'invitados'), docData);
  const invitadoId = docRef.id;

  let comprobanteUrl: string | null = null;
  let comprobanteNombre: string | null = null;
  let fechaPago: any = null;

  // Si adjuntó archivo de inmediato
  if (isAttending && file) {
    const uploadResult = await uploadComprobanteStorage(file, invitadoId);
    console.log(uploadResult);
    comprobanteUrl = uploadResult.downloadUrl;
    comprobanteNombre = uploadResult.fileName;
    fechaPago = serverTimestamp();

    await updateDoc(doc(db, 'invitados', invitadoId), {
      comprobanteUrl,
      comprobanteNombre,
      estadoPago: 'en_revision',
      fechaPago,
    });
  }

  return {
    id: invitadoId,
    ...docData,
    comprobanteUrl,
    comprobanteNombre,
    fechaPago,
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
 * Actualiza el comprobante de un invitado existente (Carga diferida)
 */
export const updateComprobanteInvitado = async (
  invitadoId: string,
  file: File
): Promise<{ downloadUrl: string; fileName: string }> => {
  const { downloadUrl, fileName } = await uploadComprobanteStorage(file, invitadoId);

  await updateDoc(doc(db, 'invitados', invitadoId), {
    comprobanteUrl: downloadUrl,
    comprobanteNombre: fileName,
    estadoPago: 'en_revision',
    opcionPago: 'ahora',
    fechaPago: serverTimestamp(),
  });

  return { downloadUrl, fileName };
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
  nuevoEstado: 'pendiente' | 'en_revision' | 'aprobado' | 'rechazado'
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


