import React from 'react';
import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react';

export const ProjectsDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Projetos', value: '24', icon: BarChart3, color: 'blue' },
    { label: 'Em Andamento', value: '12', icon: TrendingUp, color: 'green' },
    { label: 'Membros', value: '48', icon: Users, color: 'purple' },
    { label: 'Horas', value: '1,240', icon: Clock, color: 'orange' }
  ];

  return (
            <div className=" ">$2</div><h1 className="text-3xl font-bold mb-6">Dashboard de Projetos</h1>
      <div className="{stats.map((stat: unknown, i: unknown) => (">$2</div>
          <div key={i} className="bg-white p-6 rounded-lg shadow">
           
        </div><div className=" ">$2</div><div>
           
        </div><p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p></div><stat.icon className={`w-12 h-12 text-${stat.color} -500`} / />
            </div>
        ))}
      </div>);};

export default ProjectsDashboard;
