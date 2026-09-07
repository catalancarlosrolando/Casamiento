import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-1 via-blue-2 to-white dark:from-purple-1 dark:via-purple-2 dark:to-white px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Number */}
        <div className="relative">
          <h1 className="text-[150px] md:text-[200px] font-bold text-blue-9 dark:text-purple-9 opacity-20 leading-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-text">
                Página no encontrada
              </h2>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                Lo sentimos, la página que estás buscando no existe o ha sido movida.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Link
            to="/"
            className="px-8 py-3 bg-blue-9 dark:bg-purple-9 text-white rounded-lg font-semibold hover:bg-blue-10 dark:hover:bg-purple-10 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Volver al inicio
          </Link>
          <Link
            to="/noticias"
            className="px-8 py-3 bg-white text-blue-9 dark:text-purple-9 border-2 border-blue-9 dark:border-purple-9 rounded-lg font-semibold hover:bg-blue-1 dark:hover:bg-purple-1 transition-colors duration-300"
          >
            Ver noticias
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="pt-12 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">
            También puedes visitar:
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/doctorado"
              className="text-blue-9 dark:text-purple-9 hover:underline font-medium"
            >
              Doctorado
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              to="/cursos"
              className="text-blue-9 dark:text-purple-9 hover:underline font-medium"
            >
              Cursos
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              to="/contacto"
              className="text-blue-9 dark:text-purple-9 hover:underline font-medium"
            >
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;