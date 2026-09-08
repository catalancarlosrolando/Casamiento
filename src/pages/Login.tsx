import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithGoogle, 
  signInWithGoogleRedirect, 
  checkRedirectResult 
} from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Comprobar redirección al cargar la página
  useEffect(() => {
    const processRedirect = async () => {
      setLoading(true);
      try {
        const res = await checkRedirectResult();
        if (res.success && res.user) {
          navigate('/dashboard');
        } else if (res.error) {
          setError(res.error);
        }
      } catch (err) {
        console.error('Error procesando redirección:', err);
      } finally {
        setLoading(false);
      }
    };

    processRedirect();
  }, [navigate]);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithGoogle();

      if (result.success) {
        navigate('/dashboard');
      } else {
        // Si el popup fue cerrado o bloqueado, intentamos redirección directa
        if (result.code === 'auth/popup-blocked' || result.code === 'auth/popup-closed-by-user') {
          console.log('Popup no completado, intentando autenticación por redirección...');
          await signInWithGoogleRedirect();
          return;
        }
        setError(result.error || 'Error al iniciar sesión. Por favor, intenta nuevamente.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error inesperado. Por favor, intenta nuevamente.');
      console.error('Error en login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-1 via-blue-2 to-white dark:from-purple-1 dark:via-purple-2 dark:to-white px-4 py-12">

      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Logo o Header */}
          <div className="text-center space-y-2">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-9 to-blue-11 dark:from-purple-9 dark:to-purple-11 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-text">
              Bienvenido
            </h1>
            <p className="text-gray-600">
              Inicia sesión para acceder al panel de administración
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-300 rounded-lg font-semibold text-text hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-blue-9 dark:text-purple-9"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continuar con Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Acceso exclusivo para administradores
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 dark:bg-purple-50 rounded-lg p-4">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-9 dark:text-purple-9 mt-0.5 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-blue-11 dark:text-purple-11">
                Solo los usuarios autorizados pueden acceder al panel de administración.
                Si no tienes permisos, contacta al administrador del sistema.
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <button
              onClick={() => navigate('/')}
              className="text-blue-9 dark:text-purple-9 hover:text-blue-11 dark:hover:text-purple-11 font-medium transition-colors duration-200"
            >
              ← Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;