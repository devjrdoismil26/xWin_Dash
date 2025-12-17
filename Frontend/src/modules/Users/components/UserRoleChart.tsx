import React, { useEffect } from 'react';
import { Shield, RefreshCw } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { useUserRoles } from '../hooks/useUserRoles';

interface UserRoleChartProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const UserRoleChart: React.FC<UserRoleChartProps> = ({ className = ''    }) => {
  const { roles, loading, error, fetchRoles } = useUserRoles();

  useEffect(() => {
    fetchRoles();

  }, []);

  if (loading) { return (
        <>
      <Card className={className } />
      <Card.Header />
          <Card.Title className="flex items-center gap-2" />
            <Shield className="h-5 w-5" />
            Distribuição de Funções
          </Card.Title>
        </Card.Header>
        <Card.Content className="flex items-center justify-center py-12" />
          <LoadingSpinner / />
        </Card.Content>
      </Card>);

  }

  if (error) { return (
        <>
      <Card className={className } />
      <Card.Content className="p-6" />
          <p className="text-red-600">Erro ao carregar dados: {error}</p>
        </Card.Content>
      </Card>);

  }

  const total = roles?.reduce((sum: unknown, role: unknown) => sum + role.count, 0) || 0;

  return (
        <>
      <Card className={className } />
      <Card.Header />
        <div className=" ">$2</div><Card.Title className="flex items-center gap-2" />
            <Shield className="h-5 w-5" />
            Distribuição de Funções
          </Card.Title>
          <Button size="sm" variant="ghost" onClick={ fetchRoles } />
            <RefreshCw className="h-4 w-4" /></Button></div>
      </Card.Header>
      <Card.Content />
        <div className="{roles?.map((role: unknown) => {">$2</div>
            const percentage = total > 0 ? (role.count / total) * 100 : 0;
            return (
        <>
      <div key={role.name} className="space-y-2">
      </div><div className=" ">$2</div><span className="font-medium capitalize">{role.name}</span>
                  <span className="text-gray-600">{role.count} ({percentage.toFixed(1)}%)</span></div><div className=" ">$2</div><div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={width: `${percentage} %` } / />
           
        </div></div>);

          })}
        </div>
      </Card.Content>
    </Card>);};

export default UserRoleChart;
