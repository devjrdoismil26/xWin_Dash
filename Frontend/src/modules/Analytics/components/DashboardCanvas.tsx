import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { X } from 'lucide-react';

interface DashboardCanvasProps {
  widgets: string[];
  selectedWidget: string | null;
  onSelectWidget?: (e: any) => void;
  onRemoveWidget?: (e: any) => void;
  onUpdateWidget?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const DashboardCanvas: React.FC<DashboardCanvasProps> = ({ widgets,
  selectedWidget,
  onSelectWidget,
  onRemoveWidget
   }) => {
  if (widgets.length === 0) {
    return (
        <>
      <Card className="backdrop-blur-xl bg-white/10 border-white/20" />
      <Card.Content className="p-12 text-center text-gray-400" />
          Selecione widgets para adicionar ao dashboard
        </Card.Content>
      </Card>);

  }

  return (
            <div className="{widgets.map((widget: unknown) => (">$2</div>
        <Card
          key={ widget.id }
          className={`backdrop-blur-xl border-white/20 cursor-pointer transition-all ${
            selectedWidget === widget.id ? 'bg-blue-500/20 border-blue-500/30' : 'bg-white/10'
          } `}
          onClick={ () => onSelectWidget(widget.id)  }>
          <Card.Content className="p-4 relative" />
            <Button
              onClick={(e: unknown) => { e.stopPropagation(); onRemoveWidget(widget.id); } variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" /></Button><div className="Widget: {widget.type}">$2</div>
            </div>
          </Card.Content>
      </Card>
    </>
  ))}
    </div>);};
