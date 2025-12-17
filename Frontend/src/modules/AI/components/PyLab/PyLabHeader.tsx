import React from 'react';
import { Play, Save } from 'lucide-react';
import Button from '@/shared/components/ui/Button';

interface PyLabHeaderProps {
  onRun??: (e: any) => void;
  onSave??: (e: any) => void;
  running?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const PyLabHeader: React.FC<PyLabHeaderProps> = ({ onRun, onSave, running    }) => {
  return (
            <div className=" ">$2</div><h2 className="text-xl font-bold">PyLab Integration</h2>
      <div className=" ">$2</div><Button onClick={onRun} disabled={ running } />
          <Play className="w-4 h-4 mr-2" />
          Run
        </Button>
        <Button variant="outline" onClick={ onSave } />
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>);};
