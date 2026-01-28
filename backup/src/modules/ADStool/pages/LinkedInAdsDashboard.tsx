import React from 'react';
import { Head } from '@inertiajs/react';
import { BarChart3, DollarSign, UserCheck } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/components/ui/Card';
interface LinkedInMetrics {
  impressions?: number;
  clicks?: number;
  leads?: number;
  cost?: number;
}
interface LinkedInCampaign {
  id: string | number;
  name: string;
  type?: string;
  status?: string;
}
interface LinkedInAdsDashboardProps {
  auth?: any;
  metrics?: LinkedInMetrics;
  campaigns?: LinkedInCampaign[];
}
const LinkedInAdsDashboard: React.FC<LinkedInAdsDashboardProps> = ({ auth, metrics = {}, campaigns = [] }) => {
  const formatCurrency = (value: number = 0) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  return (
    <AuthenticatedLayout user={auth?.user}>
      <Head title="LinkedIn Ads Dashboard" />
      <PageLayout title="LinkedIn Ads">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <Card.Content className="p-6">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Impressões</p>
                  <p className="text-2xl font-bold">{(metrics.impressions || 0).toLocaleString('pt-BR')}</p>
                </div>
              </div>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content className="p-6">
              <div className="flex items-center space-x-3">
                <UserCheck className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Leads</p>
                  <p className="text-2xl font-bold">{(metrics.leads || 0).toLocaleString('pt-BR')}</p>
                </div>
              </div>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content className="p-6">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-6 h-6 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Custo</p>
                  <p className="text-2xl font-bold">{formatCurrency(metrics.cost || 0)}</p>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
        <Card>
          <Card.Header>
            <Card.Title>Campanhas</Card.Title>
          </Card.Header>
          <Card.Content>
            {campaigns.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Nenhuma campanha encontrada</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Nome</th>
                      <th className="text-left py-3 px-4">Tipo</th>
                      <th className="text-left py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((c) => (
                      <tr key={c.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{c.name}</td>
                        <td className="py-3 px-4">{c.type || '-'}</td>
                        <td className="py-3 px-4">{c.status || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card.Content>
        </Card>
      </PageLayout>
    </AuthenticatedLayout>
  );
};
export default LinkedInAdsDashboard;
