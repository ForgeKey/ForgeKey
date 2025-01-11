import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getInitialTheme = () => {
  if (typeof window === 'undefined') return false;

  const storedTheme = localStorage.getItem('darkMode');
  if (storedTheme !== null) {
    return storedTheme === 'true';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(getInitialTheme());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newDarkMode = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('darkMode', newDarkMode.toString());
      }
      return newDarkMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
