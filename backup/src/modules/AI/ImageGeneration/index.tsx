import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Card } from "@/components/ui/Card";
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import SimpleSelect from '@/components/ui/SimpleSelect';
import { 
  Image, 
  Wand2, 
  Download, 
  Share, 
  Settings,
  Loader,
  Sparkles,
  Palette,
  Zap
} from 'lucide-react';
const ImageGeneration: React.FC<{ 
  auth?: { user?: { id: string; name: string; email: string; }; }; 
  generations?: Record<string, unknown>[];
  models?: Record<string, unknown>[];
}> = ({ 
  auth, 
  generations = [],
  models = []
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<Record<string, unknown>[]>([]);
  const { data, setData, post, processing, errors } = useForm({
    prompt: '',
    negative_prompt: '',
    model: 'dall-e-3',
    style: 'natural',
    size: '1024x1024',
    quality: 'standard',
    count: 1
  });
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      // Simular geração de imagem
      await new Promise(resolve => setTimeout(resolve, 3000));
      const newImages = Array.from({ length: data.count }, (_, i) => ({
        id: Date.now() + i,
        url: `https://picsum.photos/1024/1024?random=${Date.now() + i}`,
        prompt: data.prompt,
        model: data.model,
        created_at: new Date().toISOString()
      }));
      setGeneratedImages(prev => [...newImages, ...prev]);
    } catch (error) {
      console.error('Erro ao gerar imagens:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <AppLayout
      title="Geração de Imagens"
      subtitle="Crie imagens incríveis com IA"
      showSidebar={true}
      showBreadcrumbs={true}
      breadcrumbs={[
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'AI', href: '/ai' },
        { name: 'Geração de Imagens', href: '/ai/image-generation', current: true }
      ]}
    >
      <Head title="Geração de Imagens - xWin Dash" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel de Controle */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                Configurações
              </Card.Title>
              <Card.Description>
                Configure os parâmetros para gerar suas imagens
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prompt *
                  </label>
                  <Textarea
                    value={data.prompt}
                    onChange={(e) => setData('prompt', e.target.value)}
                    placeholder="Descreva a imagem que você quer gerar..."
                    rows={4}
                    className={errors.prompt ? 'border-red-500' : ''}
                  />
                  {errors.prompt && (
                    <p className="text-red-500 text-sm mt-1">{errors.prompt}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Seja específico e detalhado para melhores resultados
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prompt Negativo
                  </label>
                  <Textarea
                    value={data.negative_prompt}
                    onChange={(e) => setData('negative_prompt', e.target.value)}
                    placeholder="O que você NÃO quer na imagem..."
                    rows={2}
                    className={errors.negative_prompt ? 'border-red-500' : ''}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Opcional: elementos a evitar na imagem
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo
                  </label>
                  <SimpleSelect
                    value={data.model}
                    onChange={(e) => setData('model', e.target.value)}
                    className={errors.model ? 'border-red-500' : ''}
                  >
                    <option value="dall-e-3">DALL-E 3 (Mais Avançado)</option>
                    <option value="dall-e-2">DALL-E 2 (Rápido)</option>
                    <option value="midjourney">Midjourney Style</option>
                    <option value="stable-diffusion">Stable Diffusion</option>
                  </SimpleSelect>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estilo
                    </label>
                    <SimpleSelect
                      value={data.style}
                      onChange={(e) => setData('style', e.target.value)}
                    >
                      <option value="natural">Natural</option>
                      <option value="vivid">Vibrante</option>
                      <option value="artistic">Artístico</option>
                      <option value="photographic">Fotográfico</option>
                    </SimpleSelect>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tamanho
                    </label>
                    <SimpleSelect
                      value={data.size}
                      onChange={(e) => setData('size', e.target.value)}
                    >
                      <option value="1024x1024">Quadrado (1024x1024)</option>
                      <option value="1792x1024">Paisagem (1792x1024)</option>
                      <option value="1024x1792">Retrato (1024x1792)</option>
                    </SimpleSelect>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualidade
                    </label>
                    <SimpleSelect
                      value={data.quality}
                      onChange={(e) => setData('quality', e.target.value)}
                    >
                      <option value="standard">Padrão</option>
                      <option value="hd">Alta Definição</option>
                    </SimpleSelect>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantidade
                    </label>
                    <SimpleSelect
                      value={data.count}
                      onChange={(e) => setData('count', parseInt(e.target.value))}
                    >
                      <option value={1}>1 imagem</option>
                      <option value={2}>2 imagens</option>
                      <option value={4}>4 imagens</option>
                    </SimpleSelect>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isGenerating || !data.prompt}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Gerar Imagem
                    </>
                  )}
                </Button>
              </form>
            </Card.Content>
          </Card>
          {/* Prompts Sugeridos */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Prompts Sugeridos
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-2">
                {[
                  'Um gato astronauta flutuando no espaço, arte digital',
                  'Paisagem futurista com cidades voadoras, cyberpunk',
                  'Retrato de uma pessoa em estilo aquarela',
                  'Logo minimalista para empresa de tecnologia',
                  'Ilustração de um dragão em estilo anime'
                ].map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setData('prompt', prompt)}
                    className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>
        {/* Área de Resultados */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status de Geração */}
          {isGenerating && (
            <Card>
              <Card.Content className="p-6">
                <div className="text-center">
                  <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                  <h3 className="font-semibold mb-2">Gerando sua imagem...</h3>
                  <p className="text-gray-600">Isso pode levar alguns segundos</p>
                </div>
              </Card.Content>
            </Card>
          )}
          {/* Imagens Geradas */}
          {generatedImages.length > 0 && (
            <Card>
              <Card.Header>
                <Card.Title>Imagens Geradas</Card.Title>
                <Card.Description>
                  Suas criações mais recentes
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedImages.map((image) => (
                    <div key={image.id} className="group relative">
                      <img
                        src={image.url}
                        alt={image.prompt}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="secondary">
                            <Download className="h-4 w-4 mr-1" />
                            Baixar
                          </Button>
                          <Button size="sm" variant="secondary">
                            <Share className="h-4 w-4 mr-1" />
                            Compartilhar
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {image.prompt}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {image.model} • {new Date(image.created_at).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          )}
          {/* Histórico */}
          {generations.length > 0 && (
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <div>
                    <Card.Title>Histórico</Card.Title>
                    <Card.Description>
                      Suas gerações anteriores
                    </Card.Description>
                  </div>
                  <Button href="/ai/image-generation/history" variant="outline" size="sm">
                    Ver Tudo
                  </Button>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {generations.slice(0, 8).map((generation) => (
                    <div key={generation.id} className="group cursor-pointer">
                      <img
                        src={generation.url || `https://picsum.photos/200/200?random=${generation.id}`}
                        alt={generation.prompt}
                        className="w-full h-24 object-cover rounded group-hover:opacity-80 transition-opacity"
                      />
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {generation.prompt}
                      </p>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          )}
          {/* Estado Vazio */}
          {!isGenerating && generatedImages.length === 0 && generations.length === 0 && (
            <Card>
              <Card.Content className="p-12">
                <div className="text-center">
                  <Image className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Comece a gerar imagens
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Use o painel ao lado para criar suas primeiras imagens com IA
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4" />
                      <span>Geração rápida</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-4 w-4" />
                      <span>Alta qualidade</span>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
};
export default ImageGeneration;
