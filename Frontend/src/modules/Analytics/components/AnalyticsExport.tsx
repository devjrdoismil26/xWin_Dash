import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';

export const AnalyticsExport: React.FC = () => {
  const exportFormats = [
    { type: 'pdf', label: 'PDF', icon: FileText },
    { type: 'csv', label: 'CSV', icon: FileSpreadsheet },
    { type: 'xlsx', label: 'Excel', icon: FileSpreadsheet }
  ];

  return (
        <>
      <Card className="backdrop-blur-xl bg-white/10 border-white/20" />
      <Card.Header />
        <Card.Title>Exportar Dados</Card.Title>
      </Card.Header>
      <Card.Content />
        <div className=" ">$2</div><p className="text-sm text-gray-400">Selecione o formato de exportação:</p>
          <div className="{exportFormats.map(({ type, label, icon: Icon }) => (">$2</div>
              <Button
                key={ type }
                variant="outline"
                className="flex-col h-24 backdrop-blur-sm bg-white/5 border-white/10 hover:bg-white/10" />
                <Icon className="h-8 w-8 mb-2" />
                {label}
              </Button>
            ))}
          </div>
          <Button className="w-full" />
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button></div></Card.Content>
    </Card>);};
