import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Card } from "@/components/ui/Card";
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import SimpleSelect from '@/components/ui/SimpleSelect';
import Badge from '@/components/ui/Badge';
import { 
  FileText, 
  Brain, 
  BarChart3, 
  TrendingUp,
  Loader,
  CheckCircle,
  AlertCircle,
  Zap,
  Target,
  Hash
} from 'lucide-react';
const TextAnalysis: React.FC<{ 
  auth?: { user?: { id: string; name: string; email: string; }; }; 
  analyses?: Record<string, unknown>[];
}> = ({ 
  auth, 
  analyses = []
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<Record<string, unknown> | null>(null);
  const { data, setData, post, processing, errors } = useForm({
    text: '',
    analysis_type: 'sentiment',
    language: 'pt'
  });
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    try {
      // Simular análise de texto
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Resultado simulado baseado no tipo de análise
      const mockResults = {
        sentiment: {
          sentiment: 'positive',
          confidence: 0.85,
          scores: {
            positive: 0.85,
            neutral: 0.10,
            negative: 0.05
          },
          emotions: {
            joy: 0.7,
            trust: 0.6,
            anticipation: 0.4,
            surprise: 0.2
          }
        },
        keywords: {
          keywords: [
            { word: 'tecnologia', relevance: 0.9, count: 5 },
            { word: 'inovação', relevance: 0.8, count: 3 },
            { word: 'futuro', relevance: 0.7, count: 4 },
            { word: 'desenvolvimento', relevance: 0.6, count: 2 }
          ],
          entities: [
            { entity: 'OpenAI', type: 'Organization', confidence: 0.95 },
            { entity: 'Brasil', type: 'Location', confidence: 0.88 }
          ]
        },
        summary: {
          summary: 'O texto aborda temas relacionados à tecnologia e inovação, com foco no desenvolvimento futuro e suas implicações.',
          key_points: [
            'Importância da tecnologia na sociedade moderna',
            'Impacto da inovação no desenvolvimento',
            'Perspectivas futuras do setor tecnológico'
          ],
          word_count: data.text.split(' ').length,
          reading_time: Math.ceil(data.text.split(' ').length / 200)
        }
      };
      setAnalysisResult({
        type: data.analysis_type,
        ...mockResults[data.analysis_type],
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao analisar texto:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-50';
      case 'negative':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-4 w-4" />;
      case 'negative':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };
  return (
    <AppLayout
      title="Análise de Texto"
      subtitle="Analise sentimentos, extraia palavras-chave e resumos"
      showSidebar={true}
      showBreadcrumbs={true}
      breadcrumbs={[
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'AI', href: '/ai' },
        { name: 'Análise de Texto', href: '/ai/text-analysis', current: true }
      ]}
    >
      <Head title="Análise de Texto - xWin Dash" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel de Entrada */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Configurações
              </Card.Title>
              <Card.Description>
                Configure o texto e tipo de análise
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <form onSubmit={handleAnalyze} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texto para Análise *
                  </label>
                  <Textarea
                    value={data.text}
                    onChange={(e) => setData('text', e.target.value)}
                    placeholder="Cole ou digite o texto que você quer analisar..."
                    rows={8}
                    className={errors.text ? 'border-red-500' : ''}
                  />
                  {errors.text && (
                    <p className="text-red-500 text-sm mt-1">{errors.text}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {data.text.length} caracteres • {data.text.split(' ').filter(w => w).length} palavras
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Análise
                  </label>
                  <SimpleSelect
                    value={data.analysis_type}
                    onChange={(e) => setData('analysis_type', e.target.value)}
                    className={errors.analysis_type ? 'border-red-500' : ''}
                  >
                    <option value="sentiment">Análise de Sentimento</option>
                    <option value="keywords">Palavras-chave e Entidades</option>
                    <option value="summary">Resumo e Pontos-chave</option>
                  </SimpleSelect>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idioma
                  </label>
                  <SimpleSelect
                    value={data.language}
                    onChange={(e) => setData('language', e.target.value)}
                  >
                    <option value="pt">Português</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </SimpleSelect>
                </div>
                <Button
                  type="submit"
                  disabled={isAnalyzing || !data.text.trim()}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Analisando...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Analisar Texto
                    </>
                  )}
                </Button>
              </form>
            </Card.Content>
          </Card>
          {/* Exemplos */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Textos de Exemplo
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-2">
                {[
                  {
                    title: 'Review Positivo',
                    text: 'Este produto é incrível! Superou todas as minhas expectativas. Recomendo fortemente para todos.'
                  },
                  {
                    title: 'Feedback Neutro',
                    text: 'O serviço foi adequado. Atendeu às necessidades básicas, mas há espaço para melhorias.'
                  },
                  {
                    title: 'Artigo Técnico',
                    text: 'A inteligência artificial está revolucionando diversos setores da economia brasileira, especialmente na área de tecnologia e inovação.'
                  }
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setData('text', example.text)}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded transition-colors"
                  >
                    <p className="font-medium text-sm">{example.title}</p>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {example.text}
                    </p>
                  </button>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>
        {/* Área de Resultados */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status de Análise */}
          {isAnalyzing && (
            <Card>
              <Card.Content className="p-6">
                <div className="text-center">
                  <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                  <h3 className="font-semibold mb-2">Analisando seu texto...</h3>
                  <p className="text-gray-600">Processando com IA avançada</p>
                </div>
              </Card.Content>
            </Card>
          )}
          {/* Resultados da Análise */}
          {analysisResult && (
            <>
              {/* Análise de Sentimento */}
              {analysisResult.type === 'sentiment' && (
                <Card>
                  <Card.Header>
                    <Card.Title>Análise de Sentimento</Card.Title>
                    <Card.Description>
                      Resultado da análise emocional do texto
                    </Card.Description>
                  </Card.Header>
                  <Card.Content className="space-y-6">
                    {/* Sentimento Principal */}
                    <div className="text-center">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getSentimentColor(analysisResult.sentiment)}`}>
                        {getSentimentIcon(analysisResult.sentiment)}
                        <span className="font-semibold capitalize">
                          {analysisResult.sentiment === 'positive' ? 'Positivo' :
                           analysisResult.sentiment === 'negative' ? 'Negativo' : 'Neutro'}
                        </span>
                        <span className="text-sm">
                          ({Math.round(analysisResult.confidence * 100)}% confiança)
                        </span>
                      </div>
                    </div>
                    {/* Scores de Sentimento */}
                    <div>
                      <h4 className="font-medium mb-3">Distribuição de Sentimentos</h4>
                      <div className="space-y-2">
                        {Object.entries(analysisResult.scores).map(([sentiment, score]: [string, any]) => (
                          <div key={sentiment} className="flex items-center justify-between">
                            <span className="capitalize text-sm">
                              {sentiment === 'positive' ? 'Positivo' :
                               sentiment === 'negative' ? 'Negativo' : 'Neutro'}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    sentiment === 'positive' ? 'bg-green-500' :
                                    sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                                  }`}
                                  style={{ width: `${score * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium w-12">
                                {Math.round(score * 100)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Emoções */}
                    <div>
                      <h4 className="font-medium mb-3">Emoções Detectadas</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(analysisResult.emotions).map(([emotion, score]: [string, any]) => (
                          <div key={emotion} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="capitalize text-sm">
                              {emotion === 'joy' ? 'Alegria' :
                               emotion === 'trust' ? 'Confiança' :
                               emotion === 'anticipation' ? 'Expectativa' : 'Surpresa'}
                            </span>
                            <Badge variant="secondary">
                              {Math.round(score * 100)}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              )}
              {/* Palavras-chave e Entidades */}
              {analysisResult.type === 'keywords' && (
                <div className="space-y-6">
                  <Card>
                    <Card.Header>
                      <Card.Title className="flex items-center gap-2">
                        <Hash className="h-5 w-5" />
                        Palavras-chave
                      </Card.Title>
                    </Card.Header>
                    <Card.Content>
                      <div className="space-y-3">
                        {analysisResult.keywords.map((keyword: Record<string, unknown>, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">{keyword.word}</span>
                              <span className="text-sm text-gray-600 ml-2">
                                ({keyword.count}x)
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="h-2 bg-blue-500 rounded-full"
                                  style={{ width: `${keyword.relevance * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium w-10">
                                {Math.round(keyword.relevance * 100)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card.Content>
                  </Card>
                  <Card>
                    <Card.Header>
                      <Card.Title className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Entidades Identificadas
                      </Card.Title>
                    </Card.Header>
                    <Card.Content>
                      <div className="space-y-2">
                        {analysisResult.entities.map((entity: Record<string, unknown>, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <span className="font-medium">{entity.entity}</span>
                              <Badge variant="outline" className="ml-2">
                                {entity.type}
                              </Badge>
                            </div>
                            <span className="text-sm text-gray-600">
                              {Math.round(entity.confidence * 100)}% confiança
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card.Content>
                  </Card>
                </div>
              )}
              {/* Resumo */}
              {analysisResult.type === 'summary' && (
                <Card>
                  <Card.Header>
                    <Card.Title>Resumo e Análise</Card.Title>
                  </Card.Header>
                  <Card.Content className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Resumo Automático</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded">
                        {analysisResult.summary}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Pontos-chave</h4>
                      <ul className="space-y-1">
                        {analysisResult.key_points.map((point: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {analysisResult.word_count}
                        </p>
                        <p className="text-sm text-gray-600">Palavras</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {analysisResult.reading_time}min
                        </p>
                        <p className="text-sm text-gray-600">Tempo de Leitura</p>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              )}
            </>
          )}
          {/* Estado Vazio */}
          {!isAnalyzing && !analysisResult && (
            <Card>
              <Card.Content className="p-12">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Pronto para analisar
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Digite ou cole um texto no painel ao lado para começar a análise
                  </p>
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                    <div className="text-center">
                      <Brain className="h-6 w-6 mx-auto mb-1" />
                      <span>IA Avançada</span>
                    </div>
                    <div className="text-center">
                      <Zap className="h-6 w-6 mx-auto mb-1" />
                      <span>Análise Rápida</span>
                    </div>
                    <div className="text-center">
                      <Target className="h-6 w-6 mx-auto mb-1" />
                      <span>Alta Precisão</span>
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
export default TextAnalysis;
