import React from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Save, RotateCcw } from 'lucide-react';

export const FlowToolbar: React.FC<{ onSave??: (e: any) => void; onReset??: (e: any) => void }> = ({ onSave, onReset }) => (
  <div className=" ">$2</div><h2 className="text-xl font-bold text-white">Flow Builder</h2>
    <div className=" ">$2</div><Button onClick={onReset} variant="outline" size="sm"><RotateCcw className="h-4 w-4 mr-2" />Resetar</Button>
      <Button onClick={onSave} size="sm"><Save className="h-4 w-4 mr-2" />Salvar</Button>
    </div>);
