import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAuthorizedUser } from '../services/AuthorizedUser';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-1 to-white dark:from-purple-1 dark:to-white">
        <div className="text-center space-y-4">
          <svg 
            className="animate-spin h-12 w-12 text-blue-9 dark:text-purple-9 mx-auto" 
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
          <p className="text-text font-medium">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

    // Si está autenticado pero NO es un usuario autorizado
   if (!isAuthorizedUser(user.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-1 to-white dark:from-purple-1 dark:to-white px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-text">
            Acceso Denegado
          </h2>

          {/* Message */}
          <p className="text-gray-600">
            No tienes permisos para acceder al panel de administración. Solo usuarios autorizados pueden acceder a esta sección.
          </p>

          {/* User Info */}
          <div className="bg-gray-50 rounded-lg p-4 text-left">
            <p className="text-sm text-gray-600 mb-1">Usuario actual:</p>
            <div className="flex items-center gap-3">
              {user.photoURL && (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'Usuario'} 
                  className="w-10 h-10 rounded-full"
                  referrerPolicy="no-referrer"
                />
              )}
              <div>
                <p className="font-medium text-text">{user.displayName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-6 py-3 bg-blue-9 dark:bg-purple-9 text-white rounded-lg font-semibold hover:bg-blue-10 dark:hover:bg-purple-10 transition-colors"
            >
              Volver al inicio
            </button>
            <button
              onClick={async () => {
                const { logout } = await import('../services/authService');
                await logout();
                window.location.href = '/login';
              }}
              className="w-full px-6 py-3 bg-white text-text border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>

          {/* Help Text */}
          <p className="text-xs text-gray-500">
            Si crees que deberías tener acceso, contacta al administrador del sistema.
          </p>
        </div>
      </div>
    );
  }

  // Si está autenticado, mostrar el contenido
  return <>{children}</>;
};

export default ProtectedRoute;