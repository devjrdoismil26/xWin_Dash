import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Eye, Trash2, FileText } from 'lucide-react';

interface ReportsListProps {
  reports: string[];
  onView?: (e: any) => void;
  onDelete?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ReportsList: React.FC<ReportsListProps> = ({ reports, onView, onDelete    }) => {
  if (reports.length === 0) {
    return (
        <>
      <Card className="backdrop-blur-xl bg-white/10 border-white/20" />
      <Card.Content className="p-12 text-center" />
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Nenhum relatório encontrado</p>
        </Card.Content>
      </Card>);

  }

  return (
            <div className="{reports.map((report: unknown) => (">$2</div>
        <Card key={report.id} className="backdrop-blur-xl bg-white/10 border-white/20" />
          <Card.Content className="p-4" />
            <h3 className="text-lg font-semibold text-white mb-2">{report.name}</h3>
            <p className="text-sm text-gray-400 mb-4">{report.description}</p>
            <div className=" ">$2</div><Button onClick={() => onView(report.id)} size="sm" className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                Ver
              </Button>
              <Button onClick={() => onDelete(report.id)} variant="outline" size="sm">
                <Trash2 className="h-4 w-4" /></Button></div>
          </Card.Content>
      </Card>
    </>
  ))}
    </div>);};
