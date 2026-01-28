import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Card } from "@/components/ui/Card";
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { Plus, Search, Filter, MoreHorizontal } from 'lucide-react';
const MediaIndexPage: React.FC<any> = ({ data = [], filters = {}, pagination = {} }) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };
  return (
    <AppLayout>
      <Head title="Biblioteca de Mídia" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Biblioteca de Mídia</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Novo
          </Button>
        </div>
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center justify-between">
              <span>Arquivos</span>
              <Badge variant="secondary">{data.length} {data.length === 1 ? 'item' : 'itens'}</Badge>
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <form onSubmit={handleSearch} className="flex gap-4 mb-4">
              <div className="flex-1">
                <Input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full" />
              </div>
              <Button type="submit" variant="outline">
                <Search className="h-4 w-4 mr-2" /> Buscar
              </Button>
              <Button type="button" variant="outline">
                <Filter className="h-4 w-4 mr-2" /> Filtros
              </Button>
            </form>
            {data.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-3 font-semibold text-gray-700">Nome</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Tipo</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Criado em</th>
                      <th className="text-center p-3 font-semibold text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item: any, index: number) => (
                      <tr key={item.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 text-sm text-gray-900">{item.name || '-'}</td>
                        <td className="p-3 text-sm text-gray-900">{item.type || '-'}</td>
                        <td className="p-3 text-sm text-gray-600">{item.created_at || '-'}</td>
                        <td className="p-3 text-center">
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum arquivo</h3>
                <p className="text-gray-600 mb-6">Comece adicionando arquivos à sua biblioteca.</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Enviar arquivo
                </Button>
              </div>
            )}
          </Card.Content>
        </Card>
      </div>
    </AppLayout>
  );
};
export default MediaIndexPage;
