import React from 'react';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useAdvancedTheme } from '@/components/ui/AdvancedThemeProvider';
import Button from '@/components/ui/Button';
import Dropdown from '@/components/ui/Dropdown';

interface ThemeToggleProps {
  className?: string;
  showColorPicker?: boolean;
  compact?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  showColorPicker = false,
  compact = true 
}) => {
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

  if (compact) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={toggleTheme} 
        className={`p-2 ${className}`}
        title={`Alternar tema - ${getLabel()}`}
      >
        {getIcon()}
      </Button>
    );
  }

  if (showColorPicker) {
    return (
      <Dropdown>
        <Dropdown.Trigger asChild>
          <Button variant="ghost" size="sm" className={className}>
            {getIcon()}
            <span className="ml-2 hidden sm:inline">{getLabel()}</span>
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Content align="right" className="w-48">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-600">
            Tema
          </div>
          
          {/* Mode Selection */}
          <div className="px-3 py-2">
            <div className="space-y-1">
              {(['light', 'dark', 'system'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTheme(mode)}
                  className={`w-full text-left px-2 py-1 text-sm rounded transition-colors ${
                    theme === mode
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {mode === 'light' && '☀️ Modo claro'}
                  {mode === 'dark' && '🌙 Modo escuro'}
                  {mode === 'system' && '💻 Modo sistema'}
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-600">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Cor do tema</div>
            <div className="flex space-x-2">
              {(['blue', 'purple', 'green', 'orange', 'red', 'pink'] as const).map((color) => (
                <button
                  key={color}
                  onClick={() => advancedTheme.setColor(color)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                    advancedTheme.preferences.color === color ? 'border-gray-900 dark:border-white' : 'border-gray-300'
                  }`}
                  style={{
                    backgroundColor:
                      color === 'blue' ? '#3b82f6' :
                      color === 'purple' ? '#8b5cf6' :
                      color === 'green' ? '#10b981' :
                      color === 'orange' ? '#f59e0b' :
                      color === 'red' ? '#ef4444' :
                      '#ec4899'
                  }}
                  title={`Tema ${color}`}
                />
              ))}
            </div>
          </div>
        </Dropdown.Content>
      </Dropdown>
    );
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleTheme} 
      className={className}
      title={`Alternar tema - ${getLabel()}`}
    >
      {getIcon()}
      <span className="ml-2 hidden sm:inline">{getLabel()}</span>
    </Button>
  );
};

export default ThemeToggle;