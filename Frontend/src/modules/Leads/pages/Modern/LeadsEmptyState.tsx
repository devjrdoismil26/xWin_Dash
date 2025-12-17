import React from 'react';
import { Users, Plus } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';

interface LeadsEmptyStateProps {
  onCreateLead??: (e: any) => void;
  hasFilters?: boolean;
  onClearFilters???: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const LeadsEmptyState: React.FC<LeadsEmptyStateProps> = ({ onCreateLead,
  hasFilters = false,
  onClearFilters
   }) => {
  return (
        <>
      <Card className="p-12 text-center" />
      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2" />
        {hasFilters ? 'Nenhum lead encontrado' : 'Nenhum lead cadastrado'}
      </h3>
      <p className="text-gray-600 mb-6" />
        {hasFilters
          ? 'Tente ajustar os filtros ou limpar a busca'
          : 'Comece criando seu primeiro lead'}
      </p>
      <div className="{ hasFilters && onClearFilters ? (">$2</div>
          <Button variant="outline" onClick={onClearFilters } />
            Limpar Filtros
          </Button>
        ) : null}
        <Button onClick={ onCreateLead } />
          <Plus className="w-4 h-4 mr-2" />
          Criar Lead
        </Button></div></Card>);};
