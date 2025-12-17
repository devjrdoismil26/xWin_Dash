import React from 'react';
import { ShoppingBag, DollarSign, TrendingUp, Star } from 'lucide-react';

interface ProductCatalogStatsProps {
  totalProducts: number;
  totalRevenue: number;
  averageConversion: number;
  averageRating: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ProductCatalogStats: React.FC<ProductCatalogStatsProps> = ({ totalProducts,
  totalRevenue,
  averageConversion,
  averageRating
   }) => {
  const stats = [
    {
      label: 'Total de Produtos',
      value: totalProducts,
      icon: ShoppingBag,
      color: 'blue'
    },
    {
      label: 'Receita Total',
      value: `R$ ${totalRevenue.toLocaleString('pt-BR')}`,
      icon: DollarSign,
      color: 'green'
    },
    {
      label: 'Taxa de Conversão',
      value: `${averageConversion.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'purple'
    },
    {
      label: 'Avaliação Média',
      value: averageRating.toFixed(1),
      icon: Star,
      color: 'yellow'
    }
  ];

  return (
            <div className="{stats.map((stat: unknown, index: unknown) => (">$2</div>
        <div key={index} className="bg-white p-4 rounded-lg border">
           
        </div><div className=" ">$2</div><span className="text-sm text-gray-600">{stat.label}</span>
            <stat.icon className={`w-5 h-5 text-${stat.color} -500`} / /></div><div className="text-2xl font-bold">{stat.value}</div>
      ))}
    </div>);};
