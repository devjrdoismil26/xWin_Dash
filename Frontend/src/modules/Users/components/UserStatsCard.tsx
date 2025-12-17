import React from 'react';
import { LucideIcon } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import { AnimatedCounter } from '@/shared/components/ui/AdvancedAnimations';

interface UserStatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: {
isPositive: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };

  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  className?: string;
}

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600',
  red: 'bg-red-100 text-red-600',};

const UserStatsCard: React.FC<UserStatsCardProps> = ({ title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
  className = ''
   }) => (
  <Card className={className } />
    <Card.Content className="p-6" />
      <div className=" ">$2</div><div>
           
        </div><p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold mt-1" />
            <AnimatedCounter value={value} / />
          </p>
          {trend && (
            <p className={`text-xs mt-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'} `} />
              {trend.isPositive ? '+' : ''}{trend.value}% vs período anterior
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]} `}>
           
        </div><Icon className="h-6 w-6" /></div></Card.Content>
  </Card>);

export default UserStatsCard;
