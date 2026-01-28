import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { BarChart2, RotateCw, Users, Mail, Check, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import Textarea from '@/components/ui/Textarea';
import { Select } from '@/components/ui/select';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import AudienceSelector from './AudienceSelector.tsx';
import ABTestingConfig from './ABTestingConfig.tsx';
const RemarkCampaignBuilder: React.FC<{projectId, onCampaignCreated}> = ({ projectId, onCampaignCreated }) => {
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showAudienceSelector, setShowAudienceSelector] = useState(false);
  const [showABTesting, setShowABTesting] = useState(false);
  const [data, setData] = useState({
    name: '',
    description: '',
    trigger_type: 'behavior',
    trigger_value: '',
    segment_id: null,
    subject: '',
    content: '',
  });
  const [processing, setProcessing] = useState(false);
  const handleCreate = useCallback(() => {
    if (!data.name.trim() || !data.subject.trim()) {
      toast.error('Preencha nome e assunto.');
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      toast.success('Campanha de remarketing criada com sucesso!');
      setShowCampaignModal(false);
      onCampaignCreated?.({ id: Date.now(), ...data, project_id: projectId });
    }, 600);
  }, [data, onCampaignCreated, projectId]);
  const handleAudienceSelect = useCallback((segmentId) => {
    setData((prev) => ({ ...prev, segment_id: segmentId }));
    setShowAudienceSelector(false);
  }, []);
  const [campaigns] = useState([]);
  const getStatusVariant: React.FC<status> = (status) => (status === 'active' ? 'success' : 'secondary');
  return (
    <div className="space-y-6">
      <Card>
        <Card.Header className="flex items-center justify-between">
          <Card.Title>Campanhas</Card.Title>
          <Button onClick={() => setShowCampaignModal(true)} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Criar Campanha</span>
          </Button>
        </Card.Header>
        <Card.Content>
          {campaigns.length > 0 ? (
            <div className="space-y-2">
              {campaigns.map((c) => (
                <div key={c.id} className="p-3 border rounded flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-gray-600">{c.subject}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusVariant(c.status)}>
                      {c.status === 'active' ? 'Ativo' : 'Pausado'}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <BarChart2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      {c.status === 'active' ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-600">Nenhuma campanha cadastrada.</div>
          )}
        </Card.Content>
      </Card>
      <Modal isOpen={showCampaignModal} onClose={() => setShowCampaignModal(false)} title="Criar Campanha de Remarketing" size="lg">
        <form onSubmit={(e) => e.preventDefault()}>
          <Card className="space-y-4 p-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <InputLabel>Nome</InputLabel>
                <Input value={data.name} onChange={(e) => setData((p) => ({ ...p, name: e.target.value }))} placeholder="Ex: Abandono de carrinho" />
              </div>
              <div>
                <InputLabel>Tipo de Gatilho</InputLabel>
                <Select value={data.trigger_type} onChange={(e) => setData((p) => ({ ...p, trigger_type: e.target.value }))}>
                  <option value="behavior">Comportamental</option>
                  <option value="time">Tempo</option>
                </Select>
              </div>
            </div>
            <div>
              <InputLabel>Descrição</InputLabel>
              <Textarea value={data.description} onChange={(e) => setData((p) => ({ ...p, description: e.target.value }))} placeholder="Descreva o propósito desta campanha" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <InputLabel>Segmento</InputLabel>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setShowAudienceSelector(true)} className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {data.segment_id ? `Segmento #${data.segment_id}` : 'Selecionar'}
                  </Button>
                </div>
              </div>
              <div>
                <InputLabel>Gatilho</InputLabel>
                <Input value={data.trigger_value} onChange={(e) => setData((p) => ({ ...p, trigger_value: e.target.value }))} placeholder="Ex: cart_abandonment" />
              </div>
            </div>
            <Card>
              <Card.Header className="flex items-center justify-between">
                <Card.Title className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Conteúdo do Email
                </Card.Title>
                <Button variant="outline" size="sm" onClick={() => setShowABTesting(true)} className="flex items-center gap-2">
                  <RotateCw className="w-4 h-4" /> Teste A/B
                </Button>
              </Card.Header>
              <Card.Content className="space-y-3">
                <InputLabel>Assunto</InputLabel>
                <Input value={data.subject} onChange={(e) => setData((p) => ({ ...p, subject: e.target.value }))} placeholder="Ex: Sua compra te espera!" />
                <InputLabel>Conteúdo</InputLabel>
                <Textarea rows={6} value={data.content} onChange={(e) => setData((p) => ({ ...p, content: e.target.value }))} placeholder="Digite o conteúdo do email..." />
              </Card.Content>
            </Card>
            <div className="flex justify-end">
              <Button onClick={handleCreate} disabled={processing} className="flex items-center gap-2">
                {processing ? 'Criando...' : 'Criar Campanha'}
              </Button>
            </div>
          </Card>
        </form>
      </Modal>
      <AudienceSelector isOpen={showAudienceSelector} onClose={() => setShowAudienceSelector(false)} onSelect={handleAudienceSelect} />
      <Modal isOpen={showABTesting} onClose={() => setShowABTesting(false)} title="Teste A/B" size="lg">
        <ABTestingConfig onSave={() => setShowABTesting(false)} onClose={() => setShowABTesting(false)} />
      </Modal>
    </div>
  );
};
RemarkCampaignBuilder.propTypes = {
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onCampaignCreated: PropTypes.func,
};
export default RemarkCampaignBuilder;
