import React from 'react';
import { useParams } from 'react-router-dom';
import { ModuleLayout, PageHeader, Card } from '@/shared/components/ui';
import { useActivityRefactored } from '../hooks/useActivity';
import { Badge } from '@/shared/components/ui/Badge';
import { Clock, User, FileText, Tag } from 'lucide-react';

export const ActivityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { getLog } = useActivityRefactored();

  const [log, setLog] = React.useState<any>(null);

  React.useEffect(() => {
    if (id) {
      getLog(id).then(setLog);

    } , [id]);

  if (!log) return <div>Carregando...</div>;

  return (
        <>
      <ModuleLayout />
      <PageHeader
        title={`Atividade #${log.id}`}
        description={ log.description }
        backButton
      / />
      <div className=" ">$2</div><div className=" ">$2</div><Card title="Informações" icon={ FileText } />
            <div className=" ">$2</div><div>
           
        </div><label className="text-sm text-gray-500">Descrição</label>
                <p className="font-medium">{log.description}</p></div><div>
           
        </div><label className="text-sm text-gray-500">Tipo</label>
                <Badge>{log.log_name}</Badge></div><div>
           
        </div><label className="text-sm text-gray-500">Usuário</label>
                <p className="font-medium">{log.causer_type || 'Sistema'}</p></div></Card>

          <Card title="Propriedades" icon={ Tag } />
            <pre className="text-sm bg-gray-50 p-4 rounded overflow-auto" />
              {JSON.stringify(log.properties, null, 2)}
            </pre></Card></div>

        <div className=" ">$2</div><Card title="Detalhes" icon={ Clock } />
            <div className=" ">$2</div><div>
           
        </div><label className="text-sm text-gray-500">Criado em</label>
                <p className="font-medium">{new Date(log.created_at).toLocaleString('pt-BR')}</p></div><div>
           
        </div><label className="text-sm text-gray-500">Atualizado em</label>
                <p className="font-medium">{new Date(log.updated_at).toLocaleString('pt-BR')}</p></div></Card>

          <Card title="Usuário" icon={ User } />
            <div className=" ">$2</div><div>
           
        </div><label className="text-sm text-gray-500">ID</label>
                <p className="font-medium">{log.causer_id || 'N/A'}</p></div><div>
           
        </div><label className="text-sm text-gray-500">Tipo</label>
                <p className="font-medium">{log.causer_type || 'Sistema'}</p></div></Card></div></ModuleLayout>);};

export default ActivityDetailPage;
