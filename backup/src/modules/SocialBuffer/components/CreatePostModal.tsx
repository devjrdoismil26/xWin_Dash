import React, { useState, useEffect } from 'react';
import { X, Send, Calendar, Image, Hash, Link as Link, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Badge from '@/components/ui/Badge';
import useSocialBuffer from '../hooks/useSocialBuffer';
interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const {
    socialAccounts,
    fetchSocialAccounts,
    createPost,
    generateContent,
    isCreatingPost,
    getConnectedAccounts,
  } = useSocialBuffer();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    platform: '',
    scheduled_at: '',
    media_url: '',
    hashtags: '',
  });
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  useEffect(() => {
    if (isOpen) {
      fetchSocialAccounts();
    }
  }, [isOpen]);
  const connectedAccounts = getConnectedAccounts();
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleAccountToggle = (accountId: number) => {
    setSelectedAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };
  const handleGenerateContent = async () => {
    if (!formData.title.trim()) {
      alert('Digite um título ou tema para gerar o conteúdo');
      return;
    }
    setIsGenerating(true);
    try {
      const response = await generateContent(formData.title);
      if (response.content) {
        setFormData(prev => ({
          ...prev,
          content: response.content
        }));
      }
    } catch (error) {
      console.error('Erro ao gerar conteúdo:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) {
      alert('O conteúdo do post é obrigatório');
      return;
    }
    if (selectedAccounts.length === 0) {
      alert('Selecione pelo menos uma conta para publicar');
      return;
    }
    try {
      const postData = {
        ...formData,
        social_account_ids: selectedAccounts,
        status: formData.scheduled_at ? 'scheduled' : 'draft',
        hashtags: formData.hashtags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };
      await createPost(postData);
      onClose();
      // Reset form
      setFormData({
        title: '',
        content: '',
        platform: '',
        scheduled_at: '',
        media_url: '',
        hashtags: '',
      });
      setSelectedAccounts([]);
    } catch (error) {
      console.error('Erro ao criar post:', error);
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Criar Novo Post</h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título/Tema
            </label>
            <div className="flex gap-2">
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Digite o título ou tema do post..."
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateContent}
                disabled={isGenerating || !formData.title.trim()}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isGenerating ? 'Gerando...' : 'IA'}
              </Button>
            </div>
          </div>
          {/* Conteúdo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conteúdo *
            </label>
            <Textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Digite o conteúdo do post..."
              rows={6}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.content.length} caracteres
            </p>
          </div>
          {/* Contas Selecionadas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contas para Publicar *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {connectedAccounts.map((account) => (
                <div
                  key={account.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedAccounts.includes(account.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleAccountToggle(account.id)}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedAccounts.includes(account.id)}
                      onChange={() => handleAccountToggle(account.id)}
                      className="rounded"
                    />
                    <Badge variant="outline">{account.platform}</Badge>
                    <span className="text-sm font-medium">{account.username}</span>
                  </div>
                </div>
              ))}
            </div>
            {connectedAccounts.length === 0 && (
              <p className="text-sm text-gray-500">
                Nenhuma conta conectada. <a href="/social-buffer/accounts" className="text-blue-600 hover:underline">Conectar contas</a>
              </p>
            )}
          </div>
          {/* Agendamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Agendamento
            </label>
            <Input
              type="datetime-local"
              value={formData.scheduled_at}
              onChange={(e) => handleInputChange('scheduled_at', e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Deixe em branco para salvar como rascunho
            </p>
          </div>
          {/* Opções Avançadas */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-blue-600 hover:underline"
            >
              {showAdvanced ? 'Ocultar' : 'Mostrar'} opções avançadas
            </button>
          </div>
          {showAdvanced && (
            <div className="space-y-4 border-t pt-4">
              {/* Hashtags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Hash className="w-4 h-4 inline mr-1" />
                  Hashtags
                </label>
                <Input
                  value={formData.hashtags}
                  onChange={(e) => handleInputChange('hashtags', e.target.value)}
                  placeholder="hashtag1, hashtag2, hashtag3..."
                />
              </div>
              {/* URL da Mídia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Image className="w-4 h-4 inline mr-1" />
                  URL da Mídia
                </label>
                <Input
                  value={formData.media_url}
                  onChange={(e) => handleInputChange('media_url', e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
            </div>
          )}
          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isCreatingPost || !formData.content.trim() || selectedAccounts.length === 0}
            >
              {isCreatingPost ? (
                'Salvando...'
              ) : formData.scheduled_at ? (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Post
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Salvar Rascunho
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreatePostModal;
