import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Mail, Eye, Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import Textarea from '@/components/ui/Textarea';
const EmailEditor: React.FC<{template?: any, onSave, onPreview}> = ({ template = null, onSave, onPreview }) => {
  const isEditing = Boolean(template);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: template?.name || '',
    subject: template?.subject || '',
    content: template?.content || '',
    html_content: template?.html_content || '',
  });
  const handleSave = useCallback(() => {
    setLoading(true);
    try {
      onSave?.(data);
    } finally {
      setLoading(false);
    }
  }, [data, onSave]);
  const handlePreview = useCallback(() => {
    onPreview?.(data);
  }, [data, onPreview]);
  return (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <div className="flex justify-between items-center">
            <Card.Title className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>{isEditing ? 'Editar Template' : 'Novo Template'}</span>
            </Card.Title>
            <div className="flex space-x-2">
              <Button onClick={handlePreview} variant="outline"><Eye className="w-4 h-4 mr-1" />Pré-visualizar</Button>
              <Button onClick={handleSave} disabled={loading} className="flex items-center space-x-2">
                {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <Save className="w-4 h-4" />}
                <span>{loading ? 'Salvando...' : 'Salvar'}</span>
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Content className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputLabel htmlFor="name">Nome</InputLabel>
              <Input id="name" value={data.name} onChange={(e) => setData((p) => ({ ...p, name: e.target.value }))} placeholder="Ex: Newsletter" />
            </div>
            <div>
              <InputLabel htmlFor="subject">Assunto *</InputLabel>
              <Input id="subject" value={data.subject} onChange={(e) => setData((p) => ({ ...p, subject: e.target.value }))} placeholder="Ex: Novidades da semana" />
            </div>
          </div>
          <div>
            <InputLabel htmlFor="content">Conteúdo</InputLabel>
            <Textarea id="content" rows={10} value={data.content} onChange={(e) => setData((p) => ({ ...p, content: e.target.value }))} placeholder="Digite o conteúdo do email..." />
          </div>
          <div>
            <InputLabel htmlFor="html_content">HTML (opcional)</InputLabel>
            <Textarea id="html_content" rows={10} value={data.html_content} onChange={(e) => setData((p) => ({ ...p, html_content: e.target.value }))} placeholder="Cole seu HTML aqui..." />
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};
EmailEditor.propTypes = {
  template: PropTypes.object,
  onSave: PropTypes.func,
  onPreview: PropTypes.func,
};
export default EmailEditor;
