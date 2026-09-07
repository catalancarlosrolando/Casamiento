

/**
 * Lista de emails autorizados para acceder al dashboard
 * Solo estos usuarios pueden crear y editar contenido
 */
export const AUTHORIZED_EMAILS = [
  import.meta.env.VITE_AUTH_USER, // Reemplaza con tu email real
  // Agrega más emails si es necesario
];

/**
 * Verifica si un email está autorizado
 */
export const isAuthorizedUser = (email: string | null): boolean => {
  if (!email) return false;
  return AUTHORIZED_EMAILS.includes(email.toLowerCase());
};