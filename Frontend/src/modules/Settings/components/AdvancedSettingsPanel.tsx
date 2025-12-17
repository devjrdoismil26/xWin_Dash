import React, { useState } from 'react';
import { SettingsGeneral } from './Advanced/SettingsGeneral';

export const AdvancedSettingsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
            <div className=" ">$2</div><h1 className="text-2xl font-bold mb-6">Configurações Avançadas</h1>
      <SettingsGeneral / />
    </div>);};

export default AdvancedSettingsPanel;
