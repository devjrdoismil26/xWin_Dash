import React from 'react';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
const ReportsIndex: React.FC<{ reports?: Array<{ id: string | number; name: string; created_at?: string }> }> = ({ reports = [] as unknown[] }) => {
  return (
        <>
      <PageLayout title="Relatórios" />
      <Card />
        <Card.Content className="p-6 space-y-3" />
          {reports.length === 0 ? (
            <div className="text-sm text-gray-500">Nenhum relatório disponível.</div>
          ) : (
            (reports || []).map((r: unknown) => (
              <div key={r.id} className="flex items-center justify-between">
           
        </div><div>
           
        </div><p className="font-medium">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.created_at ? new Date(r.created_at).toLocaleString('pt-BR') : '-'}</p></div><Button size="sm" variant="outline">Download</Button>
      </div>
    </>
  ))
          )}
        </Card.Content></Card></PageLayout>);};

export default ReportsIndex;
