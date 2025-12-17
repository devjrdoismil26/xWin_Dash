import React from 'react';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';

export const SettingsGeneral: React.FC = () => {
  return (
        <>
      <Card className="p-6" />
      <h3 className="text-lg font-semibold mb-4">Configurações Gerais</h3>
      <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium mb-1">Nome da Empresa</label>
          <Input placeholder="Digite o nome" / /></div><div>
           
        </div><label className="block text-sm font-medium mb-1">Email</label>
          <Input type="email" placeholder="email@empresa.com" / /></div></Card>);};
