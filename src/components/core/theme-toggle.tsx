import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for OS preference
    const prefersDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const storedTheme = localStorage.getItem('darkMode');

    // Use stored theme if available, otherwise use OS preference
    const initialDarkMode =
      storedTheme !== null ? storedTheme === 'true' : prefersDarkMode;

    setDarkMode(initialDarkMode);
    document.documentElement.classList.toggle('dark', initialDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="darkMode"
        checked={darkMode}
        onCheckedChange={toggleDarkMode}
      />
      <Label htmlFor="darkMode">{darkMode ? 'Dark Mode' : 'Light Mode'}</Label>
      {darkMode ? (
        <Moon className="h-4 w-4 ml-2" />
      ) : (
        <Sun className="h-4 w-4 ml-2" />
      )}
    </div>
  );
};

export default ThemeToggle;
