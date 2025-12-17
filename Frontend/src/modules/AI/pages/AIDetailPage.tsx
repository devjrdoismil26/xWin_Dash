import React from 'react';
import { useParams } from 'react-router-dom';
import { ModuleLayout, PageHeader, Card } from '@/shared/components/ui';
import { useAIRefactored } from '../hooks/useAI';
import { Badge } from '@/shared/components/ui/Badge';
import { Sparkles, Clock, DollarSign, Zap } from 'lucide-react';

export const AIDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { getGeneration } = useAIRefactored();

  const [generation, setGeneration] = React.useState<any>(null);

  React.useEffect(() => {
    if (id) {
      getGeneration(id).then(setGeneration);

    } , [id]);

  if (!generation) return <div>Carregando...</div>;

  return (
        <>
      <ModuleLayout />
      <PageHeader
        title={`Geração #${generation.id}`}
        description={ generation.type }
        backButton
      / />
      <div className=" ">$2</div><div className=" ">$2</div><Card title="Prompt" icon={ Sparkles } />
            <div className=" ">$2</div><p className="text-sm">{generation.prompt}</p></div></Card>

          <Card title="Resultado" />
            <div className=" ">$2</div><pre className="text-sm whitespace-pre-wrap">{generation.result}</pre></div></Card></div><div className=" ">$2</div><Card title="Detalhes" />
            <div className=" ">$2</div><div>
           
        </div><label className="text-sm text-gray-500">Tipo</label>
                <Badge>{generation.type}</Badge></div><div>
           
        </div><label className="text-sm text-gray-500">Provider</label>
                <Badge variant="outline">{generation.provider}</Badge></div><div>
           
        </div><label className="text-sm text-gray-500">Modelo</label>
                <p className="font-medium">{generation.model}</p></div></Card>

          <Card title="Métricas" />
            <div className=" ">$2</div><div className=" ">$2</div><Clock className="h-4 w-4 text-gray-400" />
                <div>
           
        </div><p className="text-xs text-gray-500">Tempo</p>
                  <p className="font-medium">{generation.duration}ms</p></div><div className=" ">$2</div><DollarSign className="h-4 w-4 text-gray-400" />
                <div>
           
        </div><p className="text-xs text-gray-500">Custo</p>
                  <p className="font-medium">R$ {generation.cost}</p></div><div className=" ">$2</div><Zap className="h-4 w-4 text-gray-400" />
                <div>
           
        </div><p className="text-xs text-gray-500">Tokens</p>
                  <p className="font-medium">{generation.tokens}</p></div></div></Card></div></ModuleLayout>);};

export default AIDetailPage;
