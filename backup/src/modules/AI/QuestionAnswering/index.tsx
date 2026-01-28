import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Card } from "@/components/ui/Card";
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import SimpleSelect from '@/components/ui/SimpleSelect';
import Badge from '@/components/ui/Badge';
import { 
  MessageCircle, 
  Brain, 
  Send, 
  FileText,
  Loader,
  CheckCircle,
  Clock,
  Lightbulb,
  BookOpen,
  Zap
} from 'lucide-react';
const QuestionAnswering: React.FC<{ 
  auth?: { user?: { id: string; name: string; email: string; }; }; 
  conversations?: Record<string, unknown>[];
}> = ({ 
  auth, 
  conversations = []
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState<Record<string, unknown>[]>([]);
  const [context, setContext] = useState('');
  const { data, setData, post, processing, errors, reset } = useForm({
    question: '',
    context: '',
    model: 'gpt-4',
    max_tokens: 500,
    temperature: 0.7
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.question.trim()) return;
    setIsProcessing(true);
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: data.question,
      timestamp: new Date().toISOString()
    };
    setChatHistory(prev => [...prev, userMessage]);
    try {
      // Simular resposta da IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateMockResponse(data.question),
        confidence: Math.random() * 0.3 + 0.7, // 70-100%
        sources: [
          'Documento interno: Manual de Procedimentos',
          'Base de conhecimento: FAQ Técnico'
        ],
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, aiResponse]);
      setData('question', '');
    } catch (error) {
      console.error('Erro ao processar pergunta:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  const generateMockResponse = (question: string) => {
    const responses = {
      'como': 'Para realizar essa ação, você deve seguir os seguintes passos: 1) Acesse o painel de controle, 2) Navegue até a seção desejada, 3) Configure as opções necessárias.',
      'o que': 'Isso se refere a uma funcionalidade específica do sistema que permite gerenciar e automatizar processos de forma eficiente.',
      'quando': 'Geralmente isso ocorre durante o horário comercial, entre 9h e 18h, ou conforme configurado nas suas preferências.',
      'onde': 'Você pode encontrar essa opção no menu principal, na seção de configurações ou no painel de administração.',
      'por que': 'Isso acontece devido às configurações de segurança e políticas estabelecidas para garantir a integridade dos dados.'
    };
    const questionLower = question.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (questionLower.includes(key)) {
        return response;
      }
    }
    return 'Com base no contexto fornecido e na minha base de conhecimento, posso ajudar você com essa questão. A resposta envolve múltiplos aspectos que devem ser considerados para uma solução completa e eficaz.';
  };
  const clearChat = () => {
    setChatHistory([]);
  };
  return (
    <AppLayout
      title="Perguntas e Respostas"
      subtitle="Faça perguntas e obtenha respostas inteligentes"
      showSidebar={true}
      showBreadcrumbs={true}
      breadcrumbs={[
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'AI', href: '/ai' },
        { name: 'Q&A', href: '/ai/question-answering', current: true }
      ]}
    >
      <Head title="Perguntas e Respostas - xWin Dash" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Painel de Configuração */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Configurações
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo de IA
                </label>
                <SimpleSelect
                  value={data.model}
                  onChange={(e) => setData('model', e.target.value)}
                >
                  <option value="gpt-4">GPT-4 (Mais Preciso)</option>
                  <option value="gpt-3.5">GPT-3.5 (Mais Rápido)</option>
                  <option value="claude">Claude (Analítico)</option>
                </SimpleSelect>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Criatividade
                </label>
                <SimpleSelect
                  value={data.temperature}
                  onChange={(e) => setData('temperature', parseFloat(e.target.value))}
                >
                  <option value={0.3}>Baixa (Mais Preciso)</option>
                  <option value={0.7}>Média (Balanceado)</option>
                  <option value={1.0}>Alta (Mais Criativo)</option>
                </SimpleSelect>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamanho da Resposta
                </label>
                <SimpleSelect
                  value={data.max_tokens}
                  onChange={(e) => setData('max_tokens', parseInt(e.target.value))}
                >
                  <option value={250}>Curta (250 tokens)</option>
                  <option value={500}>Média (500 tokens)</option>
                  <option value={1000}>Longa (1000 tokens)</option>
                </SimpleSelect>
              </div>
              {chatHistory.length > 0 && (
                <Button 
                  onClick={clearChat}
                  variant="outline"
                  className="w-full"
                >
                  Limpar Conversa
                </Button>
              )}
            </Card.Content>
          </Card>
          {/* Contexto */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Contexto
              </Card.Title>
              <Card.Description>
                Forneça contexto para respostas mais precisas
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <Textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Cole documentos, manuais ou informações relevantes aqui..."
                rows={6}
                className="text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                {context.length} caracteres
              </p>
            </Card.Content>
          </Card>
          {/* Perguntas Sugeridas */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Sugestões
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-2">
                {[
                  'Como configurar uma nova integração?',
                  'Quais são as melhores práticas de segurança?',
                  'Como otimizar o desempenho do sistema?',
                  'Onde encontro os logs de erro?',
                  'Como fazer backup dos dados?'
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setData('question', suggestion)}
                    className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>
        {/* Área de Chat */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Assistente IA
              </Card.Title>
              <Card.Description>
                Faça perguntas e obtenha respostas inteligentes baseadas em IA
              </Card.Description>
            </Card.Header>
            {/* Área de Mensagens */}
            <Card.Content className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {chatHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Pronto para responder
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Faça uma pergunta para começar a conversa
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                      <div className="text-center">
                        <Zap className="h-6 w-6 mx-auto mb-1" />
                        <span>Respostas Rápidas</span>
                      </div>
                      <div className="text-center">
                        <Brain className="h-6 w-6 mx-auto mb-1" />
                        <span>IA Avançada</span>
                      </div>
                      <div className="text-center">
                        <CheckCircle className="h-6 w-6 mx-auto mb-1" />
                        <span>Alta Precisão</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  chatHistory.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {message.type === 'ai' && (
                            <Brain className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm">{message.content}</p>
                            {message.type === 'ai' && (
                              <div className="mt-3 space-y-2">
                                {message.confidence && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-600">Confiança:</span>
                                    <Badge variant="secondary" size="sm">
                                      {Math.round(message.confidence * 100)}%
                                    </Badge>
                                  </div>
                                )}
                                {message.sources && message.sources.length > 0 && (
                                  <div>
                                    <p className="text-xs text-gray-600 mb-1">Fontes:</p>
                                    <ul className="text-xs text-gray-500 space-y-1">
                                      {message.sources.map((source: string, index: number) => (
                                        <li key={index} className="flex items-center gap-1">
                                          <FileText className="h-3 w-3" />
                                          {source}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Clock className="h-3 w-3 text-gray-500" />
                              <span className="text-xs text-gray-500">
                                {new Date(message.timestamp).toLocaleTimeString('pt-BR')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Loader className="h-5 w-5 animate-spin text-blue-600" />
                        <span className="text-sm text-gray-600">Processando sua pergunta...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Área de Input */}
              <form onSubmit={handleSubmit} className="border-t pt-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={data.question}
                      onChange={(e) => setData('question', e.target.value)}
                      placeholder="Digite sua pergunta aqui..."
                      disabled={isProcessing}
                      className="w-full"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isProcessing || !data.question.trim()}
                  >
                    {isProcessing ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {context && (
                  <p className="text-xs text-gray-500 mt-2">
                    Usando contexto personalizado ({context.length} caracteres)
                  </p>
                )}
              </form>
            </Card.Content>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};
export default QuestionAnswering;
