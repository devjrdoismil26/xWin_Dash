import React from 'react';
import { Save, Eye, Code, Smartphone, Tablet, Monitor } from 'lucide-react';

interface FormBuilderToolbarProps {
  onSave??: (e: any) => void;
  onPreview??: (e: any) => void;
  onViewCode??: (e: any) => void;
  deviceMode: 'mobile' | 'tablet' | 'desktop';
  onDeviceModeChange?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const FormBuilderToolbar: React.FC<FormBuilderToolbarProps> = ({ onSave,
  onPreview,
  onViewCode,
  deviceMode,
  onDeviceModeChange
   }) => {
  return (
            <div className=" ">$2</div><h2 className="text-lg font-semibold">Form Builder</h2>
      
      <div className=" ">$2</div><div className=" ">$2</div><button
            onClick={ () => onDeviceModeChange('mobile') }
            className={`p-2 ${deviceMode === 'mobile' ? 'bg-blue-50 text-blue-600' : ''} `}
  >
            <Smartphone className="w-4 h-4" /></button><button
            onClick={ () => onDeviceModeChange('tablet') }
            className={`p-2 ${deviceMode === 'tablet' ? 'bg-blue-50 text-blue-600' : ''} `}
  >
            <Tablet className="w-4 h-4" /></button><button
            onClick={ () => onDeviceModeChange('desktop') }
            className={`p-2 ${deviceMode === 'desktop' ? 'bg-blue-50 text-blue-600' : ''} `}
  >
            <Monitor className="w-4 h-4" /></button></div>

        <button
          onClick={ onViewCode }
          className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50" />
          <Code className="w-4 h-4" />
          Ver Código
        </button>

        <button
          onClick={ onPreview }
          className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50" />
          <Eye className="w-4 h-4" />
          Eye
        </button>

        <button
          onClick={ onSave }
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" />
          <Save className="w-4 h-4" />
          Salvar
        </button>
      </div>);};
