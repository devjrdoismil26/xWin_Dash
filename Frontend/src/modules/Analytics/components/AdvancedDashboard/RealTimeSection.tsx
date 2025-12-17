import React from 'react';
import { Activity } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';

interface RealTimeSectionProps {
  projectId?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const RealTimeSection: React.FC<RealTimeSectionProps> = () => {
  return (
        <>
      <Card className="p-6" />
      <div className=" ">$2</div><Activity className="w-5 h-5 text-green-600 animate-pulse" />
        <h3 className="text-lg font-semibold">Atividade em Tempo Real</h3></div><div className=" ">$2</div><div className=" ">$2</div><span className="text-sm">Usuários ativos agora</span>
          <span className="font-bold text-green-600">127</span></div><div className=" ">$2</div><span className="text-sm">Páginas vistas (último minuto)</span>
          <span className="font-bold">43</span></div></Card>);};
