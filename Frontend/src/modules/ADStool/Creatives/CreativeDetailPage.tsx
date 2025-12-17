import React, { useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import CreativePreview from './components/CreativePreview';
import { AdsCreative } from '../types/adsCreativeTypes';

interface ShowProps {
  creative: AdsCreative | {
id: number | string;
  name: string;
  type?: string;
  campaign?: { id: number | string;
  name: string
children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; } | null;
    created_at?: string;};

}
const Show: React.FC<ShowProps> = ({ creative    }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const pageTitle = `Criativo: ${creative?.name || ''}`;
  const handleDelete = useCallback(() => {
    setIsDeleting(true);

    // API integration will be implemented in future iteration
    setTimeout(() => setIsDeleting(false), 500);

  }, []);

  return (
        <>
      <AuthenticatedLayout />
      <Head title={pageTitle} / />
      <PageLayout title={pageTitle} actions={<Button onClick={handleDelete} variant="destructive" loading={ isDeleting }>Excluir</Button>}>
        <div className=" ">$2</div><Card />
            <Card.Header />
              <Card.Title>Detalhes</Card.Title>
            </Card.Header>
            <Card.Content className="grid grid-cols-1 md:grid-cols-2 gap-4" />
              <div>
           
        </div><p className="text-sm text-gray-500">Nome</p>
                <p className="font-medium text-gray-900">{creative.name}</p></div><div>
           
        </div><p className="text-sm text-gray-500">Tipo</p>
                <p className="font-medium text-gray-900">{creative.type}</p></div><div>
           
        </div><p className="text-sm text-gray-500">Campanha</p>
                <p className="font-medium text-gray-900" />
                  {'campaign' in creative && creative.campaign ? creative.campaign.name : 'Nenhuma'}
                </p></div><div>
           
        </div><p className="text-sm text-gray-500">Criado em</p>
                <p className="font-medium text-gray-900">{creative.created_at ? new Date(creative.created_at).toLocaleDateString('pt-BR') : '-'}</p></div></Card.Content></Card><Card />
            <Card.Header />
              <Card.Title>Pré-visualização</Card.Title>
            </Card.Header>
            <Card.Content />
              <CreativePreview creative={creative as AdsCreative} / />
            </Card.Content></Card></div></PageLayout></AuthenticatedLayout>);};

export default Show;
