/**
 * Componente de Getting Started do ADStool
 * Exibe guia de início para novos usuários
 */
import React from 'react';
import { Link } from '@inertiajs/react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface ADStoolGettingStartedProps {
  show: boolean;
}

const ADStoolGettingStarted: React.FC<ADStoolGettingStartedProps> = ({
  show
}) => {
  if (!show) {
    return null;
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Começando com ADStool</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h3 className="font-semibold mb-2">Conecte suas Contas</h3>
            <p className="text-sm text-gray-600 mb-4">
              Conecte suas contas do Google Ads, Facebook Ads e outras plataformas.
            </p>
            <Button variant="outline" size="sm">
              <Link href="/adstool/accounts">Conectar Contas</Link>
            </Button>
          </div>
          <div className="text-center">
            <div className="p-3 bg-green-100 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <span className="text-green-600 font-bold">2</span>
            </div>
            <h3 className="font-semibold mb-2">Crie sua Primeira Campanha</h3>
            <p className="text-sm text-gray-600 mb-4">
              Use nossos templates para criar campanhas otimizadas rapidamente.
            </p>
            <Button variant="outline" size="sm">
              <Link href="/adstool/campaigns">Criar Campanha</Link>
            </Button>
          </div>
          <div className="text-center">
            <div className="p-3 bg-purple-100 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <span className="text-purple-600 font-bold">3</span>
            </div>
            <h3 className="font-semibold mb-2">Analise o Desempenho</h3>
            <p className="text-sm text-gray-600 mb-4">
              Acompanhe métricas e otimize suas campanhas para melhor ROI.
            </p>
            <Button variant="outline" size="sm">
              <Link href="/adstool/analytics">Ver Analytics</Link>
            </Button>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default ADStoolGettingStarted;
