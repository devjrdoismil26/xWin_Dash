import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Tabs from '@/shared/components/ui/Tabs';
const LandingPagesBuilder: React.FC<{ product?: Record<string, any> }> = ({ product }) => {
  const [tab, setTab] = useState('components');

  return (
        <>
      <AuthenticatedLayout />
      <Head title={`Builder - ${product?.name || 'Produto'}`} / />
      <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><h1 className="text-lg font-semibold">Builder</h1>
              <p className="text-sm text-gray-500">{product?.name || 'Produto'}</p></div><div className=" ">$2</div><Button variant="outline">Eye</Button>
              <Button>Salvar</Button></div></div>
        <div className=" ">$2</div><div className=" ">$2</div><Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col" />
              <Tabs.List className="grid grid-cols-3" />
                <Tabs.Trigger value="components">Componentes</Tabs.Trigger>
                <Tabs.Trigger value="styles">Estilos</Tabs.Trigger>
                <Tabs.Trigger value="seo">SEO</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="components" className="p-4" />
                <p className="text-sm text-gray-600">Biblioteca de componentes (em construção).</p>
              </Tabs.Content>
              <Tabs.Content value="styles" className="p-4" />
                <p className="text-sm text-gray-600">Painel de estilos (em construção).</p>
              </Tabs.Content>
              <Tabs.Content value="seo" className="p-4" />
                <p className="text-sm text-gray-600">Configurações de SEO (em construção).</p>
              </Tabs.Content></Tabs></div>
          <div className=" ">$2</div><Card />
              <Card.Content />
                <div className="Canvas (em construção)">$2</div>
                </div>
              </Card.Content></Card></div></div></AuthenticatedLayout>);};

export default LandingPagesBuilder;
