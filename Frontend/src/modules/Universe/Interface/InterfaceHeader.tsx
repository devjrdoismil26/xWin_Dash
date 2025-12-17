import React from 'react';
import { Save, Play } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';

export const InterfaceHeader: React.FC<{ projectId?: string; mode: string }> = ({ mode    }) => (
  <div className=" ">$2</div><h2 className="text-xl font-semibold">Universe Builder</h2>
    {mode === 'edit' && (
      <div className=" ">$2</div><Button><Save /> Salvar</Button>
        <Button variant="outline"><Play /> Testar</Button>
      </div>
    </>
  )}
  </div>);
