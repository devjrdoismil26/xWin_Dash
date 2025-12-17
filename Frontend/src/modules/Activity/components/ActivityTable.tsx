import React from 'react';
import { Card } from '@/shared/components/ui';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Eye, RefreshCw } from 'lucide-react';
import { formatDate } from '@/shared/utils';

interface ActivityTableProps {
  logs: string[];
  loading?: boolean;
  onRefresh???: (e: any) => void;
  onView??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ActivityTable: React.FC<ActivityTableProps> = ({ logs,
  loading,
  onRefresh,
  onView,
   }) => {
  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      error: 'bg-red-100 text-red-800',
      security: 'bg-yellow-100 text-yellow-800',
      success: 'bg-green-100 text-green-800',
      info: 'bg-blue-100 text-blue-800',};

    return colors[type] || 'bg-gray-100 text-gray-800';};

  return (
        <>
      <Card
      title="Logs de Atividades"
      action={ <Button variant="ghost" size="sm" onClick={onRefresh } />
      <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''} `} / />
        </Button>
  }
  >
      <div className=" ">$2</div><table className="w-full" />
          <thead className="backdrop-blur-xl bg-white/10 border-white/20 border-b" />
            <tr />
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th></tr></thead>
          <tbody className="divide-y" />
            {loading ? (
              <tr />
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500" />
                  Carregando...
                </td>
      </tr>
    </>
  ) : logs.length === 0 ? (
              <tr />
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500" />
                  Nenhum log encontrado
                </td>
      </tr>
    </>
  ) : (
              logs.map((log: unknown) => (
                <tr key={log.id} className="hover:bg-gray-50" />
                  <td className="px-4 py-3" />
                    <Badge className={getTypeBadge(log.log_name) } />
                      {log.log_name}
                    </Badge></td><td className="px-4 py-3 text-sm">{log.description}</td>
                  <td className="px-4 py-3 text-sm">{log.causer_type || 'Sistema'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500" />
                    {formatDate(log.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={ () => onView?.(log.id)  }>
                      <Eye className="h-4 w-4" /></Button></td>
      </tr>
    </>
  ))
            )}
          </tbody></table></div>
    </Card>);};
