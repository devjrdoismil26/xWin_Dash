import React from 'react';
import { Sun, Moon, Monitor, Palette, Settings } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useAdvancedTheme } from './ui/AdvancedThemeProvider';
import Button from './ui/Button';

interface ThemeToggleProps {
  className?: string;
  showAdvanced?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showAdvanced = false }) => {
  const { theme, setTheme } = useTheme();
  const advancedTheme = useAdvancedTheme();

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Modo claro';
      case 'dark':
        return 'Modo escuro';
      default:
        return 'Modo sistema';
    }
  };

  if (showAdvanced) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleTheme} 
          aria-label={`Alternar tema - ${getLabel()}`}
        >
          {getIcon()}
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => advancedTheme.setColor(
            advancedTheme.preferences.color === 'blue' ? 'purple' : 
            advancedTheme.preferences.color === 'purple' ? 'green' : 
            advancedTheme.preferences.color === 'green' ? 'orange' : 
            advancedTheme.preferences.color === 'orange' ? 'red' : 
            advancedTheme.preferences.color === 'red' ? 'pink' : 'blue'
          )}
          aria-label="Alternar cor do tema"
        >
          <Palette className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleTheme} 
      className={className} 
      aria-label={`Alternar tema - ${getLabel()}`}
    >
      {getIcon()}
    </Button>
  );
};

export default ThemeToggle;
