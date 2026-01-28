import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Search } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
interface Keyword {
  id: string | number;
  text: string;
  match_type?: 'exact' | 'phrase' | 'broad';
  status?: 'enabled' | 'paused' | 'removed';
  quality_score?: number;
}
interface GoogleKeywordManagerProps {
  keywords?: Keyword[];
}
const GoogleKeywordManager: React.FC<GoogleKeywordManagerProps> = ({ keywords = [] }) => {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => keywords.filter((k) => k.text.toLowerCase().includes(search.toLowerCase())), [keywords, search]);
  const formatScoreStars = (score: number = 0) => '★'.repeat(Math.max(0, Math.min(5, Math.round(score / 2))));
  return (
    <AuthenticatedLayout>
      <Head title="Gerenciador de Palavras-chave - Google Ads" />
      <PageLayout title="Palavras-chave Google">
        <Card>
          <Card.Content className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-4 h-4 text-gray-500" />
              <Input placeholder="Buscar..." value={search} onChange={(e: any) => setSearch(e.target.value)} className="max-w-sm" />
            </div>
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Nenhuma palavra-chave encontrada</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Palavra-chave</th>
                      <th className="text-left py-3 px-4">Tipo</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Qualidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((k) => (
                      <tr key={k.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{k.text}</td>
                        <td className="py-3 px-4">{k.match_type || '-'}</td>
                        <td className="py-3 px-4">{k.status || '-'}</td>
                        <td className="py-3 px-4 text-yellow-500">{formatScoreStars(k.quality_score || 0)}</td>
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
export default GoogleKeywordManager;
