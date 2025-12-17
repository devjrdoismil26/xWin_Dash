import React from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Save, RotateCcw } from 'lucide-react';

interface DashboardToolbarProps {
  onSave??: (e: any) => void;
  onReset??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const DashboardToolbar: React.FC<DashboardToolbarProps> = ({ onSave, onReset    }) => {
  return (
            <div className=" ">$2</div><h2 className="text-xl font-bold text-white">Dashboard Builder</h2>
      <div className=" ">$2</div><Button onClick={onReset} variant="outline" size="sm" />
          <RotateCcw className="h-4 w-4 mr-2" />
          Resetar
        </Button>
        <Button onClick={onSave} size="sm" />
          <Save className="h-4 w-4 mr-2" />
          Salvar
        </Button>
      </div>);};
