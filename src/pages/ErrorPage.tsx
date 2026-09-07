import { useRouteError, useNavigate, Link } from 'react-router-dom';

/**
 * Página de error para rutas no encontradas o errores de navegación
 * Se usa como errorElement en React Router
 */
const ErrorPage = () => {
  const error = useRouteError() as any;
  const navigate = useNavigate();

  const is404 = error?.status === 404 || error?.statusText === 'Not Found';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900 px-4">

      <div className="max-w-lg w-full text-center">
        {/* Icono de error */}
        <div className="mb-8">
          {is404 ? (
            // 404 Icon
            <div className="w-32 h-32 mx-auto bg-blue-1 dark:bg-purple-1 rounded-full flex items-center justify-center mb-6">
              <span className="text-6xl font-bold text-blue-9 dark:text-purple-9">404</span>
            </div>
          ) : (
            // Error Icon
            <div className="w-24 h-24 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-12 h-12 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          )}

          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {is404 ? '¡Página no encontrada!' : '¡Ups! Algo salió mal'}
          </h1>

          {/* Descripción */}
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            {is404
              ? 'La página que buscas no existe o ha sido movida.'
              : 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.'}
          </p>

          {/* Detalles técnicos (solo en desarrollo) */}
          {import.meta.env.DEV && error && (
            <details className="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Detalles técnicos (solo en desarrollo)
              </summary>
              <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto whitespace-pre-wrap">
                {error.statusText || error.message || JSON.stringify(error, null, 2)}
              </pre>
            </details>
          )}

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 border-2 border-blue-9 dark:border-purple-9 text-blue-9 dark:text-purple-9 rounded-lg hover:bg-blue-9 hover:text-white dark:hover:bg-purple-9 dark:hover:text-white transition-colors"
            >
              ← Volver atrás
            </button>
            <Link
              to="/"
              className="px-6 py-3 bg-blue-9 dark:bg-purple-9 text-white rounded-lg hover:bg-blue-10 dark:hover:bg-purple-10 transition-colors"
            >
              🏠 Ir al inicio
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
