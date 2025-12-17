import React from 'react';
import { Card } from '@/shared/components/ui';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Eye, RefreshCw, Copy } from 'lucide-react';
import { formatDate } from '@/shared/utils';

interface AITableProps {
  generations: string[];
  loading?: boolean;
  onRefresh???: (e: any) => void;
  onView??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const AITable: React.FC<AITableProps> = ({ generations,
  loading,
  onRefresh,
  onView,
   }) => {
  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      text: 'bg-blue-100 text-blue-800',
      image: 'bg-purple-100 text-purple-800',
      chat: 'bg-green-100 text-green-800',
      analysis: 'bg-yellow-100 text-yellow-800',};

    return colors[type] || 'bg-gray-100 text-gray-800';};

  return (
        <>
      <Card
      title="Gerações"
      action={ <Button variant="ghost" size="sm" onClick={onRefresh } />
      <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''} `} / />
        </Button>
  }
  >
      <div className=" ">$2</div><table className="w-full" />
          <thead className="bg-gray-50 border-b" />
            <tr />
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prompt</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modelo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Custo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th></tr></thead>
          <tbody className="divide-y" />
            {loading ? (
              <tr />
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500" />
                  Carregando...
                </td>
      </tr>
    </>
  ) : generations.length === 0 ? (
              <tr />
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500" />
                  Nenhuma geração encontrada
                </td>
      </tr>
    </>
  ) : (
              generations.map((gen: unknown) => (
                <tr key={gen.id} className="hover:bg-gray-50" />
                  <td className="px-4 py-3" />
                    <Badge className={getTypeBadge(gen.type) } />
                      {gen.type}
                    </Badge></td><td className="px-4 py-3 text-sm max-w-xs truncate">{gen.prompt}</td>
                  <td className="px-4 py-3 text-sm">{gen.provider}</td>
                  <td className="px-4 py-3 text-sm">{gen.model}</td>
                  <td className="px-4 py-3 text-sm">R$ {gen.cost}</td>
                  <td className="px-4 py-3 text-sm text-gray-500" />
                    {formatDate(gen.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right" />
                    <div className=" ">$2</div><Button variant="ghost" size="sm" />
                        <Copy className="h-4 w-4" /></Button><Button
                        variant="ghost"
                        size="sm"
                        onClick={ () => onView?.(gen.id)  }>
                        <Eye className="h-4 w-4" /></Button></div></td></tr>
              ))
            )}
          </tbody></table></div>
    </Card>);};
