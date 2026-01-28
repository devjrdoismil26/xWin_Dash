import React from 'react';
import { PageTransition } from '@/components/ui/AdvancedAnimations';
import { useSettings } from './hooks/useSettings';
import { useSettingsOptimization } from './hooks/useSettingsOptimization';
import SettingsDashboard from './components/SettingsDashboard';

// =========================================
// INTERFACES
// =========================================

export interface SettingsModuleProps {
  className?: string;
  onSettingsChange?: (settings: any) => void;
  onError?: (error: string) => void;
}

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

const SettingsModule: React.FC<SettingsModuleProps> = ({
  className = '',
  onSettingsChange,
  onError
}) => {
  // ===== HOOKS =====
  const settings = useSettings();
  const optimization = useSettingsOptimization();

  // ===== HANDLERS =====

  const handleSettingsChange = (newSettings: any) => {
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  const handleError = (error: string) => {
    if (onError) {
      onError(error);
    }
  };

  // ===== RENDERIZAÇÃO =====

  return (
    <PageTransition type="fade" duration={500}>
      <div className={className}>
        <SettingsDashboard
          onSettingsChange={handleSettingsChange}
          onError={handleError}
        />
      </div>
    </PageTransition>
  );
};

// =========================================
// EXPORTS
// =========================================

export default SettingsModule;
