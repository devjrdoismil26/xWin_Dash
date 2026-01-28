import React, { useState, useCallback, useMemo } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import { Select } from '@/components/ui/select';
import Textarea from '@/components/ui/Textarea';
import Switch from '@/components/ui/Switch';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
interface AdExtension {
  id: string;
  type: string;
  text?: string;
  url?: string;
  description1?: string;
  description2?: string;
  header?: string;
  values?: string[];
  phone_number?: string;
  country_code?: string;
  call_tracking?: boolean;
  business_name?: string;
  address?: string;
  status: 'active' | 'inactive' | 'pending';
  metrics?: {
    impressions: number;
    clicks: number;
    ctr: number;
  };
}
interface AdExtensionsManagerProps {
  campaignId: string;
  extensions: AdExtension[];
  loading?: boolean;
  onExtensionCreate?: (extension: Partial<AdExtension>) => void;
  onExtensionUpdate?: (extension: AdExtension) => void;
  onExtensionDelete?: (extension: AdExtension) => void;
}
const EXTENSION_TYPES = [
  { type: 'sitelink', label: 'Links do Site', icon: Plus, fields: ['text', 'url', 'description1', 'description2'] },
  { type: 'callout', label: 'Texto Explicativo', icon: Plus, fields: ['text'] },
  { type: 'structured_snippet', label: 'Snippet Estruturado', icon: Plus, fields: ['header', 'values'] },
  { type: 'call', label: 'Extensão de Chamada', icon: Plus, fields: ['phone_number', 'country_code', 'call_tracking'] },
  { type: 'location', label: 'Extensão de Local', icon: Plus, fields: ['business_name', 'address', 'phone_number'] },
  { type: 'price', label: 'Extensão de Preço', icon: Plus, fields: ['type', 'currency', 'items'] },
];
const AdExtensionsManager: React.FC<AdExtensionsManagerProps> = ({ 
  campaignId, 
  extensions = [], 
  loading = false, 
  onExtensionCreate, 
  onExtensionUpdate, 
  onExtensionDelete 
}) => {
  const [selectedType, setSelectedType] = useState('sitelink');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const typeExtensions = useMemo(() => 
    extensions.filter((e) => e.type === selectedType), 
    [extensions, selectedType]
  );
  const handleSubmitExtension = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!onExtensionCreate) return;
      onExtensionCreate({ ...formData, type: selectedType, campaignId });
    },
    [formData, selectedType, campaignId, onExtensionCreate],
  );
  const renderExtensionForm = () => {
    const extensionType = EXTENSION_TYPES.find((t) => t.type === selectedType);
    if (!extensionType) return null;
    return (
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center space-x-2">
            <span>{extensionType.label}</span>
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <form onSubmit={handleSubmitExtension} className="space-y-4">
            {selectedType === 'sitelink' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <InputLabel htmlFor="text">Texto</InputLabel>
                    <Input 
                      id="text" 
                      value={formData.text || ''} 
                      onChange={(e) => setFormData((p) => ({ ...p, text: e.target.value }))} 
                      placeholder="Ex: Promoções" 
                    />
                    <p className="text-xs text-gray-500 mt-1">Use um texto curto e direto</p>
                  </div>
                  <div>
                    <InputLabel htmlFor="url">URL</InputLabel>
                    <Input 
                      id="url" 
                      type="url" 
                      value={formData.url || ''} 
                      onChange={(e) => setFormData((p) => ({ ...p, url: e.target.value }))} 
                      placeholder="https://seusite.com/promocoes" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <InputLabel htmlFor="description1">Descrição 1</InputLabel>
                    <Input 
                      id="description1" 
                      value={formData.description1 || ''} 
                      onChange={(e) => setFormData((p) => ({ ...p, description1: e.target.value }))} 
                      placeholder="Primeira linha de descrição" 
                    />
                  </div>
                  <div>
                    <InputLabel htmlFor="description2">Descrição 2</InputLabel>
                    <Input 
                      id="description2" 
                      value={formData.description2 || ''} 
                      onChange={(e) => setFormData((p) => ({ ...p, description2: e.target.value }))} 
                      placeholder="Segunda linha de descrição" 
                      maxLength={35} 
                    />
                  </div>
                </div>
              </>
            )}
            {selectedType === 'callout' && (
              <div>
                <InputLabel htmlFor="text">Texto Explicativo</InputLabel>
                <Input 
                  id="text" 
                  value={formData.text || ''} 
                  onChange={(e) => setFormData((p) => ({ ...p, text: e.target.value }))} 
                  placeholder="Ex: Frete Grátis, 24h de Suporte" 
                  maxLength={25}
                />
                <p className="text-xs text-gray-500 mt-1">Máximo 25 caracteres</p>
              </div>
            )}
            {selectedType === 'structured_snippet' && (
              <>
                <div>
                  <InputLabel htmlFor="header">Cabeçalho</InputLabel>
                  <Input 
                    id="header" 
                    value={formData.header || ''} 
                    onChange={(e) => setFormData((p) => ({ ...p, header: e.target.value }))} 
                    placeholder="Ex: Serviços" 
                  />
                </div>
                <div>
                  <InputLabel htmlFor="values">Valores</InputLabel>
                  <Textarea 
                    id="values" 
                    value={formData.values?.join('\n') || ''} 
                    onChange={(e) => setFormData((p) => ({ ...p, values: e.target.value.split('\n') }))} 
                    placeholder="Consultoria\nDesenvolvimento\nSuporte" 
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">Um valor por linha</p>
                </div>
              </>
            )}
            {selectedType === 'call' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <InputLabel htmlFor="phone_number">Número de Telefone</InputLabel>
                    <Input 
                      id="phone_number" 
                      value={formData.phone_number || ''} 
                      onChange={(e) => setFormData((p) => ({ ...p, phone_number: e.target.value }))} 
                      placeholder="(11) 99999-9999" 
                    />
                  </div>
                  <div>
                    <InputLabel htmlFor="country_code">Código do País</InputLabel>
                    <Select 
                      id="country_code" 
                      value={formData.country_code || 'BR'} 
                      onChange={(value) => setFormData((p) => ({ ...p, country_code: value }))}
                      options={[
                        { value: 'BR', label: 'Brasil (+55)' },
                        { value: 'US', label: 'Estados Unidos (+1)' },
                        { value: 'AR', label: 'Argentina (+54)' }
                      ]}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={formData.call_tracking || false} 
                    onChange={(checked) => setFormData((p) => ({ ...p, call_tracking: checked }))} 
                  />
                  <InputLabel htmlFor="call_tracking">Rastreamento de Chamadas</InputLabel>
                </div>
              </>
            )}
            {selectedType === 'location' && (
              <>
                <div>
                  <InputLabel htmlFor="business_name">Nome do Negócio</InputLabel>
                  <Input 
                    id="business_name" 
                    value={formData.business_name || ''} 
                    onChange={(e) => setFormData((p) => ({ ...p, business_name: e.target.value }))} 
                    placeholder="Nome da sua empresa" 
                  />
                </div>
                <div>
                  <InputLabel htmlFor="address">Endereço</InputLabel>
                  <Textarea 
                    id="address" 
                    value={formData.address || ''} 
                    onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))} 
                    placeholder="Rua, número, bairro, cidade, estado" 
                    rows={2}
                  />
                </div>
                <div>
                  <InputLabel htmlFor="phone_number">Telefone</InputLabel>
                  <Input 
                    id="phone_number" 
                    value={formData.phone_number || ''} 
                    onChange={(e) => setFormData((p) => ({ ...p, phone_number: e.target.value }))} 
                    placeholder="(11) 99999-9999" 
                  />
                </div>
              </>
            )}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setFormData({})}>
                Limpar
              </Button>
              <Button type="submit">
                Criar Extensão
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card>
    );
  };
  const renderExtensionItem = (extension: AdExtension) => {
    return (
      <div key={extension.id} className="border rounded-lg p-4 hover:bg-gray-50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-medium text-gray-900">
                {extension.text || extension.header || 'Extensão'}
              </h4>
              <Badge variant={extension.status === 'active' ? 'success' : 'secondary'}>
                {extension.status || 'inactive'}
              </Badge>
            </div>
            <div className="text-xs text-gray-600">
              {extension.type === 'sitelink' && (
                <div>
                  <p>URL: {extension.url}</p>
                  {extension.description1 && <p>Desc: {extension.description1}</p>}
                </div>
              )}
              {extension.type === 'callout' && (
                <p>Texto: {extension.text}</p>
              )}
              {extension.type === 'structured_snippet' && (
                <div>
                  <p>Cabeçalho: {extension.header}</p>
                  {extension.values && <p>Valores: {extension.values.join(', ')}</p>}
                </div>
              )}
              {extension.type === 'call' && (
                <p>Telefone: {extension.phone_number}</p>
              )}
              {extension.type === 'location' && (
                <div>
                  <p>Negócio: {extension.business_name}</p>
                  <p>Endereço: {extension.address}</p>
                </div>
              )}
            </div>
            <div className="mt-2 grid grid-cols-3 gap-4 text-xs text-gray-500">
              <div>
                <span className="block font-medium">Impressões</span>
                <span>{extension.metrics?.impressions?.toLocaleString() || '0'}</span>
              </div>
              <div>
                <span className="block font-medium">Cliques</span>
                <span>{extension.metrics?.clicks?.toLocaleString() || '0'}</span>
              </div>
              <div>
                <span className="block font-medium">CTR</span>
                <span>{extension.metrics?.ctr ? `${extension.metrics.ctr.toFixed(2)}%` : '0%'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="sm" onClick={() => onExtensionUpdate?.(extension)}>
              <Edit className="w-3 h-3" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onExtensionDelete?.(extension)}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  };
  if (loading) return <LoadingSpinner text="Carregando extensões..." />;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Extensões de Anúncio</h2>
        <Button variant="outline" size="sm" onClick={() => setSelectedType('sitelink')}>
          <Plus className="w-4 h-4 mr-2" /> Nova extensão
        </Button>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {EXTENSION_TYPES.map((type) => {
            const isSelected = selectedType === type.type;
            const className = `cursor-pointer border-2 rounded-lg p-3 transition-all ${
              isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`;
            return (
              <div key={type.type} onClick={() => setSelectedType(type.type)} className={className}>
                <div className="flex items-center space-x-2">
                  <type.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{type.label}</span>
                </div>
              </div>
            );
          })}
        </div>
        {renderExtensionForm()}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center space-x-2">
              <span>Minhas Extensões</span>
              <Badge variant="secondary">{typeExtensions.length}</Badge>
            </Card.Title>
          </Card.Header>
          <Card.Content>
            {typeExtensions.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <Plus className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Nenhuma extensão encontrada</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Criar Extensão
                </Button>
              </div>
            ) : (
              <div className="space-y-3">{typeExtensions.map(renderExtensionItem)}</div>
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};
export default AdExtensionsManager;
