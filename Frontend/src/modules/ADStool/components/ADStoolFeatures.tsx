/**
 * Componente de Funcionalidades do ADStool
 * Exibe grid de funcionalidades disponíveis
 */
import React from 'react';
import { Target, Users, BarChart3, TrendingUp } from 'lucide-react';
import { Link } from '@inertiajs/react';
import Card from '@/shared/components/ui/Card';
import Badge from '@/shared/components/ui/Badge';
import { ResponsiveGrid } from '@/shared/components/ui/ResponsiveSystem';
import { AdsCampaign, AdsAccount } from '../types';

interface ADStoolFeaturesProps {
  campaigns: AdsCampaign[];
  accounts: AdsAccount[];
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const ADStoolFeatures: React.FC<ADStoolFeaturesProps> = ({ campaigns,
  accounts
   }) => {
  const features = [
    {
      title: 'Campanhas',
      description: 'Gerencie suas campanhas de anúncios',
      icon: <Target className="w-8 h-8 text-blue-600" />,
      href: '/adstool/campaigns',
      color: 'bg-blue-50 border-blue-200',
      count: campaigns.length
    },
    {
      title: 'Contas',
      description: 'Conecte e gerencie suas contas de anúncios',
      icon: <Users className="w-8 h-8 text-green-600" />,
      href: '/adstool/accounts',
      color: 'bg-green-50 border-green-200',
      count: accounts.length
    },
    {
      title: 'Criativos',
      description: 'Crie e gerencie seus anúncios',
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      href: '/adstool/creatives',
      color: 'bg-purple-50 border-purple-200',
      count: 0
    },
    {
      title: 'Analytics',
      description: 'Analise o desempenho das suas campanhas',
      icon: <TrendingUp className="w-8 h-8 text-orange-600" />,
      href: '/adstool/analytics',
      color: 'bg-orange-50 border-orange-200',
      count: null
    }
  ];

  return (
        <>
      <div>
      </div><h2 className="text-2xl font-bold text-gray-900 mb-6 text-center" />
        Funcionalidades Disponíveis
      </h2>
      <ResponsiveGrid
        columns={ xs: 1, sm: 2, lg: 4 } gap={ xs: '1rem', md: '1.5rem' } />
        {(features || []).map((feature, index: number) => (
          <Link key={index} href={ feature.href } />
            <Card className={`h-full transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer ${feature.color} `} />
              <Card.Content className="p-6 text-center" />
                <div className="{feature.icon}">$2</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2" />
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3" />
                  {feature.description}
                </p>
                {feature.count !== null && (
                  <Badge variant="outline" />
                    {feature.count} {feature.count === 1 ? 'item' : 'itens'}
                  </Badge>
                )}
              </Card.Content></Card></Link>
        ))}
      </ResponsiveGrid>
    </div>);};

export default ADStoolFeatures;
