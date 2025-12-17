/**
 * Componente de Ações Rápidas do ADStool
 * Exibe botões para ações principais
 */
import React from 'react';
import { Plus, Users, TrendingUp } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';

const ADStoolQuickActions: React.FC = () => {
  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Ações Rápidas</Card.Title>
      </Card.Header>
      <Card.Content />
        <div className=" ">$2</div><Button className="h-20 flex flex-col items-center justify-center gap-2" />
            <Plus className="w-6 h-6" />
            <span>Nova Campanha</span></Button><Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2" />
            <Users className="w-6 h-6" />
            <span>Conectar Conta</span></Button><Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2" />
            <TrendingUp className="w-6 h-6" />
            <span>Ver Analytics</span></Button></div>
      </Card.Content>
    </Card>);};

export default ADStoolQuickActions;
