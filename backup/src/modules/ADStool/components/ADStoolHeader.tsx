/**
 * Componente de Header do ADStool
 * Exibe título, descrição e botões de ação principal
 */
import React from 'react';
import { Target, Play } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ADStoolHeaderProps {
  onAdvancedDashboard: () => void;
  onIntegrationTest: () => void;
}

const ADStoolHeader: React.FC<ADStoolHeaderProps> = ({
  onAdvancedDashboard,
  onIntegrationTest
}) => {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center mb-4">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
          <Target className="w-12 h-12 text-white" />
        </div>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        ADStool
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
        Gerencie suas campanhas de anúncios de forma inteligente. Conecte contas, 
        crie campanhas e analise performance com ferramentas avançadas.
      </p>
      <div className="flex justify-center gap-4">
        <Button 
          onClick={onAdvancedDashboard}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Target className="w-4 h-4 mr-2" />
          Dashboard Avançado
        </Button>
        <Button 
          onClick={onIntegrationTest}
          variant="outline"
          className="border-blue-500 text-blue-500 hover:bg-blue-50"
        >
          <Play className="w-4 h-4 mr-2" />
          Teste de Integração
        </Button>
      </div>
    </div>
  );
};

export default ADStoolHeader;
