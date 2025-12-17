import React from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Plus } from 'lucide-react';

interface ReportsHeaderProps {
  onCreateNew??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ReportsHeader: React.FC<ReportsHeaderProps> = ({ onCreateNew    }) => { return (
            <div className=" ">$2</div><h1 className="text-2xl font-bold text-white">Relatórios Analytics</h1>
      <Button onClick={onCreateNew } />
        <Plus className="h-4 w-4 mr-2" />
        Novo Relatório
      </Button>
    </div>);};
