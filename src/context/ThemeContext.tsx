import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type ThemeType = 'blue' | 'purple';

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    // Cargar tema guardado del localStorage
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    return savedTheme || 'blue';
  });

  useEffect(() => {
    // Guardar tema en localStorage
    localStorage.setItem('theme', theme);
    
    // Aplicar data-theme para Tailwind darkMode
    const html = document.documentElement;
    
    if (theme === 'purple') {
      html.setAttribute('data-theme', 'purple');
    } else {
      html.removeAttribute('data-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'blue' ? 'purple' : 'blue');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

