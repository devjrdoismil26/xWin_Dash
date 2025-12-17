import React from 'react';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import { AnimatedCounter } from '@/shared/components/ui/AdvancedAnimations';

interface UserStatsGridProps {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  growthRate: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const UserStatsGrid: React.FC<UserStatsGridProps> = ({ totalUsers,
  activeUsers,
  inactiveUsers,
  growthRate
   }) => (
  <div className=" ">$2</div><Card />
      <Card.Content className="p-6" />
        <div className=" ">$2</div><div>
           
        </div><p className="text-sm text-gray-600">Total de Usuários</p>
            <p className="text-2xl font-bold mt-1" />
              <AnimatedCounter value={totalUsers} / /></p></div>
          <div className=" ">$2</div><Users className="h-6 w-6 text-blue-600" /></div></Card.Content></Card><Card />
      <Card.Content className="p-6" />
        <div className=" ">$2</div><div>
           
        </div><p className="text-sm text-gray-600">Usuários Ativos</p>
            <p className="text-2xl font-bold mt-1" />
              <AnimatedCounter value={activeUsers} / /></p></div>
          <div className=" ">$2</div><UserCheck className="h-6 w-6 text-green-600" /></div></Card.Content></Card><Card />
      <Card.Content className="p-6" />
        <div className=" ">$2</div><div>
           
        </div><p className="text-sm text-gray-600">Usuários Inativos</p>
            <p className="text-2xl font-bold mt-1" />
              <AnimatedCounter value={inactiveUsers} / /></p></div>
          <div className=" ">$2</div><UserX className="h-6 w-6 text-gray-600" /></div></Card.Content></Card><Card />
      <Card.Content className="p-6" />
        <div className=" ">$2</div><div>
           
        </div><p className="text-sm text-gray-600">Taxa de Crescimento</p>
            <p className="text-2xl font-bold mt-1">{growthRate.toFixed(1)}%</p></div><div className=" ">$2</div><TrendingUp className="h-6 w-6 text-purple-600" /></div></Card.Content></Card></div>);
