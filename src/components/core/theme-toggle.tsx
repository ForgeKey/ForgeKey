import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/theme-context';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="darkMode"
        checked={darkMode}
        onCheckedChange={toggleDarkMode}
      />
      <Label htmlFor="darkMode">{darkMode ? 'Dark Mode' : 'Light Mode'}</Label>
      {darkMode ? (
        <Moon className="h-4 w-4 ml-2 dark:text-secondary" />
      ) : (
        <Sun className="h-4 w-4 ml-2" />
      )}
    </div>
  );
};

export default ThemeToggle;
