import React from 'react';
import { Button } from '@/shared/components/ui/Button';
import { BarChart3, PieChart, LineChart, TrendingUp } from 'lucide-react';

interface DashboardWidgetSelectorProps {
  onSelect?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const widgets = [
  { type: 'bar', label: 'Gráfico de Barras', icon: BarChart3 },
  { type: 'pie', label: 'Gráfico de Pizza', icon: PieChart },
  { type: 'line', label: 'Gráfico de Linha', icon: LineChart },
  { type: 'metric', label: 'Métrica', icon: TrendingUp }
];

export const DashboardWidgetSelector: React.FC<DashboardWidgetSelectorProps> = ({ onSelect    }) => {
  return (
            <div className="{widgets.map(({ type, label, icon: Icon }) => (">$2</div>
        <Button
          key={ type }
          onClick={ () => onSelect(type) }
          variant="outline"
          className="w-full justify-start backdrop-blur-sm bg-white/5 border-white/10 hover:bg-white/10"
        >
          <Icon className="h-4 w-4 mr-2" />
          {label}
        </Button>
      ))}
    </div>);};
