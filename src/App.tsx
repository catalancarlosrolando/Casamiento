import { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { Outlet } from 'react-router-dom';

export const App: React.FC = () => {
  useEffect(() => {
    // Si la URL viene con hash (ej: #rsvp)
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1); // Quita el '#'

      // Damos un breve respiro para que el DOM termine de montarse
      const timer = setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);

      return () => clearTimeout(timer);
    }
  }, []);
  return (
    <div className="min-h-screen bg-[#E0E8E5] text-[#1D373C] flex flex-col selection:bg-[#BBDB93] selection:text-[#0B272D]">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default App;
