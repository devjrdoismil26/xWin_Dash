import React from 'react';
import { Card } from '@/shared/components/ui/Card';

interface ChartsSectionProps {
  filters: Record<string, any>;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ChartsSection: React.FC<ChartsSectionProps> = () => {
  return (
            <div className=" ">$2</div><Card className="p-6" />
        <h3 className="text-lg font-semibold mb-4">Tráfego por Fonte</h3>
        <div className="Gráfico de Tráfego">$2</div>
        </div></Card><Card className="p-6" />
        <h3 className="text-lg font-semibold mb-4">Conversões</h3>
        <div className="Gráfico de Conversões">$2</div>
        </div></Card></div>);};
