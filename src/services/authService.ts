import { 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut, 
  GoogleAuthProvider,
  onAuthStateChanged
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../firebase/firebase';

// Proveedor de Google
const googleProvider = new GoogleAuthProvider();

// Configurar el proveedor para que siempre solicite seleccionar cuenta
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Comprobar resultado si el usuario vuelve de una redirección de Google
export const checkRedirectResult = async (): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      return { success: true, user: result.user };
    }
    return { success: false };
  } catch (error: any) {
    console.error('Error al procesar redirección de Google:', error);
    return { success: false, error: error.message };
  }
};

// Iniciar sesión con redirección completa (ideal para móviles o navegadores que bloquean popups)
export const signInWithGoogleRedirect = async () => {
  return signInWithRedirect(auth, googleProvider);
};

// Iniciar sesión con Google (intenta Popup, si se bloquea o falla, ofrece fallback)
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return {
      success: true,
      user: result.user
    };
  } catch (error: any) {
    console.warn('Advertencia en signInWithPopup:', error);
    let errorMessage = error.message;

    if (error.code === 'auth/unauthorized-domain') {
      errorMessage = 'Dominio no autorizado. Agrega "casamiento-carlos.web.app" en Firebase Console > Authentication > Settings > Authorized domains.';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'El navegador bloqueó la ventana emergente. Redirigiendo para iniciar sesión...';
    } else if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'Se cerró la ventana de inicio de sesión antes de completar el proceso.';
    }

    return {
      success: false,
      error: errorMessage,
      code: error.code
    };
  }
};

// Cerrar sesión
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    console.error('Error al cerrar sesión:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Observador del estado de autenticación
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Obtener el usuario actual
export const getCurrentUser = () => {
  return auth.currentUser;
};