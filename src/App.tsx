import React from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { Outlet } from 'react-router-dom';

export const App: React.FC = () => {
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
