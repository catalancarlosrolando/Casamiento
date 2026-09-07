import { 
  signInWithPopup, 
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

// Iniciar sesión con Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return {
      success: true,
      user: result.user
    };
  } catch (error: any) {
    console.error('Error al iniciar sesión con Google:', error);
    return {
      success: false,
      error: error.message
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