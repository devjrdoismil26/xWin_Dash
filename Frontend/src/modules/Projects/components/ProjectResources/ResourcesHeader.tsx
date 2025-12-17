import React from 'react';
import { Plus, Download } from 'lucide-react';

interface ResourcesHeaderProps {
  onAdd??: (e: any) => void;
  onExport??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ResourcesHeader: React.FC<ResourcesHeaderProps> = ({ onAdd, onExport    }) => (
  <div className=" ">$2</div><div>
           
        </div><h2 className="text-2xl font-bold">Recursos do Projeto</h2>
      <p className="text-gray-600">Gerencie alocação de recursos e equipe</p></div><div className=" ">$2</div><button onClick={onExport} className="btn btn-secondary" />
        <Download className="w-4 h-4 mr-2" />
        Exportar
      </button>
      <button onClick={onAdd} className="btn btn-primary" />
        <Plus className="w-4 h-4 mr-2" />
        Adicionar Recurso
      </button>
    </div>);
