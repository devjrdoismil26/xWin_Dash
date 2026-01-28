import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
const LandingPagesBuilder: React.FC<{ product?: any }> = ({ product }) => {
  const [tab, setTab] = useState('components');
  return (
    <AuthenticatedLayout>
      <Head title={`Builder - ${product?.name || 'Produto'}`} />
      <div className="h-screen flex flex-col">
        <div className="border-b bg-white">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">Builder</h1>
              <p className="text-sm text-gray-500">{product?.name || 'Produto'}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Preview</Button>
              <Button>Salvar</Button>
            </div>
          </div>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="w-80 border-r bg-white">
            <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col">
              <Tabs.List className="grid grid-cols-3">
                <Tabs.Trigger value="components">Componentes</Tabs.Trigger>
                <Tabs.Trigger value="styles">Estilos</Tabs.Trigger>
                <Tabs.Trigger value="seo">SEO</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="components" className="p-4">
                <p className="text-sm text-gray-600">Biblioteca de componentes (em construção).</p>
              </Tabs.Content>
              <Tabs.Content value="styles" className="p-4">
                <p className="text-sm text-gray-600">Painel de estilos (em construção).</p>
              </Tabs.Content>
              <Tabs.Content value="seo" className="p-4">
                <p className="text-sm text-gray-600">Configurações de SEO (em construção).</p>
              </Tabs.Content>
            </Tabs>
          </div>
          <div className="flex-1 p-6 overflow-auto">
            <Card>
              <Card.Content>
                <div className="h-[480px] border-2 border-dashed rounded grid place-items-center text-gray-500">
                  Canvas (em construção)
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};
export default LandingPagesBuilder;
