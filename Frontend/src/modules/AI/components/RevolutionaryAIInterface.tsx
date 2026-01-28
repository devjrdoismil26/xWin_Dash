/**
 * Revolutionary AI Interface - Módulo AI
 * Interface de IA de última geração com recursos avançados 95%+
 */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  Brain, 
  Sparkles, 
  Send, 
  Mic, 
  MicOff, 
  Image, 
  FileText, 
  Code, 
  Zap, 
  Settings, 
  Download, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  RefreshCw, 
  Trash2, 
  BookOpen, 
  History, 
  Star,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Loader2,
  Video,
  Camera
} from 'lucide-react';
// Design System
import { ENHANCED_TRANSITIONS, VISUAL_EFFECTS } from '@/components/ui/design-tokens';
// Hooks
import { useT } from '@/hooks/useTranslation';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { useDataLoadingStates } from '@/hooks/useLoadingStates';
// Componentes
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { Select } from '@/components/ui/select';
import Progress from '@/components/ui/Progress';
import Tooltip from '@/components/ui/Tooltip';
import CodeBlock from '@/components/ui/CodeBlock';
import Modal from '@/components/ui/Modal';
import Tabs from '@/components/ui/Tabs';
interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  type: 'text' | 'code' | 'image' | 'file' | 'audio' | 'video' | 'thinking';
  metadata?: {
    model?: string;
    tokens?: number;
    cost?: number;
    duration?: number;
    confidence?: number;
    language?: string;
    attachments?: string[];
  };
  timestamp: number;
  reactions?: {
    thumbsUp: boolean;
    thumbsDown: boolean;
    starred: boolean;
  };
  thinking?: string;
  streaming?: boolean;
}
interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'local';
  description: string;
  capabilities: string[];
  cost_per_token: number;
  max_tokens: number;
  supports_vision: boolean;
  supports_audio: boolean;
  supports_video: boolean;
  supports_code: boolean;
  status: 'available' | 'busy' | 'maintenance';
}
interface AISettings {
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  system_prompt: string;
  auto_save: boolean;
  voice_output: boolean;
  thinking_mode: boolean;
  streaming: boolean;
}
const DEFAULT_MODELS: AIModel[] = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    description: 'Modelo mais avançado da OpenAI com vision e análise de documentos',
    capabilities: ['text', 'vision', 'code', 'analysis'],
    cost_per_token: 0.00003,
    max_tokens: 128000,
    supports_vision: true,
    supports_audio: false,
    supports_video: false,
    supports_code: true,
    status: 'available',
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    description: 'Modelo mais poderoso da Anthropic para tarefas complexas',
    capabilities: ['text', 'vision', 'code', 'reasoning'],
    cost_per_token: 0.000015,
    max_tokens: 200000,
    supports_vision: true,
    supports_audio: false,
    supports_video: false,
    supports_code: true,
    status: 'available',
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'google',
    description: 'Modelo multimodal do Google com excelente performance',
    capabilities: ['text', 'vision', 'code', 'multimodal'],
    cost_per_token: 0.0000125,
    max_tokens: 32000,
    supports_vision: true,
    supports_audio: true,
    supports_video: false,
    supports_code: true,
    status: 'available',
  },
  {
    id: 'veo-3.0-generate-preview',
    name: 'Veo 3 (Video)',
    provider: 'google',
    description: 'Geração de vídeos 720p com áudio nativo e diálogos multilíngues',
    capabilities: ['text-to-video', 'image-to-video', 'audio', 'dialogue'],
    cost_per_token: 0.00015, // Estimativa para vídeo generation
    max_tokens: 8000, // Para prompts de vídeo
    supports_vision: true,
    supports_audio: true,
    supports_video: true,
    supports_code: false,
    status: 'available',
  },
  {
    id: 'veo-3-fast',
    name: 'Veo 3 Fast (Video)',
    provider: 'google',
    description: 'Versão otimizada do Veo 3 para geração rápida de vídeos',
    capabilities: ['text-to-video', 'image-to-video', 'audio', 'fast-generation'],
    cost_per_token: 0.0001, // Menor custo para versão fast
    max_tokens: 4000,
    supports_vision: true,
    supports_audio: true,
    supports_video: true,
    supports_code: false,
    status: 'available',
  },
];
const DEFAULT_SETTINGS: AISettings = {
  temperature: 0.7,
  max_tokens: 2000,
  top_p: 1.0,
  frequency_penalty: 0,
  presence_penalty: 0,
  system_prompt: 'Você é um assistente inteligente e útil. Responda de forma clara, precisa e sempre em português brasileiro.',
  auto_save: true,
  voice_output: false,
  thinking_mode: true,
  streaming: true,
};
interface RevolutionaryAIInterfaceProps {
  initialMessages?: AIMessage[];
  onSave?: (messages: AIMessage[]) => void;
  className?: string;
}
const RevolutionaryAIInterface: React.FC<RevolutionaryAIInterfaceProps> = ({
  initialMessages = [],
  onSave,
  className = '',
}) => {
  const { t } = useT();
  const { showSuccess, showError, showInfo } = useAdvancedNotifications();
  const { operations, isOperationLoading } = useDataLoadingStates();
  // State
  const [messages, setMessages] = useState<AIMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>('claude-3-opus');
  const [settings, setSettings] = useState<AISettings>(DEFAULT_SETTINGS);
  const [isRecording, setIsRecording] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const [thinking, setThinking] = useState<string>('');
  const [sessionCost, setSessionCost] = useState(0);
  const [sessionTokens, setSessionTokens] = useState(0);
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Current model
  const currentModel = useMemo(() => 
    DEFAULT_MODELS.find(m => m.id === selectedModel) || DEFAULT_MODELS[0],
    [selectedModel]
  );
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);
  // Generate message ID
  const generateMessageId = useCallback(() => {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);
  // Send message
  const sendMessage = useCallback(async (content: string, type: 'text' | 'image' | 'video' = 'text') => {
    if (!content.trim()) return;
    const userMessage: AIMessage = {
      id: generateMessageId(),
      role: 'user',
      content: content.trim(),
      type,
      timestamp: Date.now(),
      reactions: { thumbsUp: false, thumbsDown: false, starred: false },
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);
    try {
      await operations.create('ai-message', async () => {
        // Simulate AI thinking
        if (settings.thinking_mode) {
          setThinking('Analisando sua solicitação...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          setThinking('Processando informações...');
          await new Promise(resolve => setTimeout(resolve, 800));
          setThinking('Gerando resposta...');
          await new Promise(resolve => setTimeout(resolve, 600));
        }
        // Simulate streaming response
        let fullResponse = '';
        let responseType = 'text';
        // Check if using Veo models for video generation
        if (currentModel.supports_video && (content.toLowerCase().includes('vídeo') || content.toLowerCase().includes('video') || content.toLowerCase().includes('gerar vídeo') || content.toLowerCase().includes('criar vídeo'))) {
          responseType = 'video';
          // Call video generation API
          try {
            const videoResponse = await fetch('/api/ai/video/generate', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
              },
              body: JSON.stringify({
                prompt: content,
                model: currentModel.id,
                duration: 8,
                resolution: '720p',
                language: 'pt-BR'
              })
            });
            const videoResult = await videoResponse.json();
            if (videoResult.success) {
              fullResponse = `🎬 **Vídeo gerado com sucesso usando ${currentModel.name}!**
**Prompt:** "${content}"
**Especificações do vídeo:**
• Resolução: ${videoResult.data.resolution}
• Duração: ${videoResult.data.duration} segundos
• Status: ${videoResult.data.status}
• Video ID: ${videoResult.data.video_id}
${videoResult.data.video_url ? `🎥 **[Assistir Vídeo](${videoResult.data.video_url})**` : '⏳ Vídeo sendo processado...'}
*Gerado usando a API Veo 3 da Google.*`;
            } else {
              fullResponse = `❌ **Erro na geração do vídeo**
${videoResult.message}
${videoResult.error_code === 'VEO3_NOT_CONFIGURED' ? 
  '💡 **Dica:** Configure suas credenciais do Google AI Studio nas configurações para usar o Veo 3.' : 
  'Tente novamente ou contate o suporte.'}`;
            }
          } catch (error) {
            fullResponse = `❌ **Erro na comunicação com o servidor**
Não foi possível conectar com a API de geração de vídeos.
💡 **Dica:** Verifique sua conexão e tente novamente.`;
          }
        } else {
          fullResponse = `Esta é uma resposta simulada para: "${content}". 
Como seu assistente de IA avançado, posso ajudar com:
• Análise de dados e documentos
• Geração de código e scripts
• Criação de conteúdo criativo
• **Geração de vídeos com Veo 3** (experimente: "crie um vídeo de...")
• Resolução de problemas complexos
• Tradução e interpretação
• E muito mais!
Estou usando o modelo ${currentModel.name} para fornecer a melhor resposta possível.`;
        }
        if (settings.streaming) {
          const words = fullResponse.split(' ');
          let currentResponse = '';
          for (let i = 0; i < words.length; i++) {
            currentResponse += words[i] + ' ';
            setStreamingMessage(currentResponse);
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        }
        const aiMessage: AIMessage = {
          id: generateMessageId(),
          role: 'assistant',
          content: fullResponse,
          type: responseType as 'text' | 'code' | 'image' | 'file' | 'audio' | 'video' | 'thinking',
          timestamp: Date.now(),
          metadata: {
            model: currentModel.name,
            tokens: Math.floor(Math.random() * 500) + 100,
            cost: responseType === 'video' ? Math.random() * 0.05 + 0.01 : Math.random() * 0.01,
            duration: responseType === 'video' ? Math.floor(Math.random() * 8000) + 5000 : Math.floor(Math.random() * 3000) + 1000,
            confidence: 0.85 + Math.random() * 0.15,
          },
          reactions: { thumbsUp: false, thumbsDown: false, starred: false },
          thinking: settings.thinking_mode ? thinking : undefined,
        };
        setMessages(prev => [...prev, aiMessage]);
        setSessionTokens(prev => prev + (aiMessage.metadata?.tokens || 0));
        setSessionCost(prev => prev + (aiMessage.metadata?.cost || 0));
        // Auto-save if enabled
        if (settings.auto_save && onSave) {
          onSave([...messages, userMessage, aiMessage]);
        }
        return aiMessage;
      });
      showSuccess('Resposta gerada com sucesso');
    } catch (error) {
      showError('Erro ao gerar resposta');
    } finally {
      setIsStreaming(false);
      setStreamingMessage('');
      setThinking('');
    }
  }, [operations, settings, currentModel, messages, generateMessageId, thinking, onSave, showSuccess, showError]);
  // Handle form submit
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isStreaming) {
      sendMessage(input);
    }
  }, [input, isStreaming, sendMessage]);
  // Handle file upload
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = `[Imagem anexada: ${file.name}]\n\nPor favor, analise esta imagem.`;
        sendMessage(content, 'image');
      };
      reader.readAsDataURL(file);
    } else {
      const content = `[Arquivo anexado: ${file.name}]\n\nPor favor, analise este arquivo.`;
      sendMessage(content, 'file');
    }
    e.target.value = '';
  }, [sendMessage]);
  // Message reactions
  const handleReaction = useCallback((messageId: string, reaction: keyof AIMessage['reactions']) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? {
            ...msg,
            reactions: {
              ...msg.reactions!,
              [reaction]: !msg.reactions![reaction],
            },
          }
        : msg
    ));
  }, []);
  // Copy message content
  const copyMessage = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
    showSuccess('Conteúdo copiado para a área de transferência');
  }, [showSuccess]);
  // Clear conversation
  const clearConversation = useCallback(() => {
    setMessages([]);
    setSessionCost(0);
    setSessionTokens(0);
    showInfo('Conversa limpa');
  }, [showInfo]);
  // Voice recording (mock)
  const toggleRecording = useCallback(() => {
    setIsRecording(prev => !prev);
    if (!isRecording) {
      showInfo('Gravação iniciada');
      // Simulate recording
      setTimeout(() => {
        setIsRecording(false);
        setInput('Esta é uma mensagem de voz transcrita.');
        showSuccess('Áudio transcrito com sucesso');
      }, 3000);
    }
  }, [isRecording, showInfo, showSuccess]);
  const isGenerating = isOperationLoading('create', 'ai-message');
  return (
    <div className={`flex flex-col h-full max-h-[800px] ${isExpanded ? 'fixed inset-4 z-50' : ''} ${className}`}>
      <Card className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Assistente IA Avançado</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Badge variant="success" className="text-xs">
                  {currentModel.name}
                </Badge>
                <span>•</span>
                <span>{messages.length} mensagens</span>
                <span>•</span>
                <span>R$ {sessionCost.toFixed(4)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Tooltip content="Histórico">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(true)}
              >
                <History className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Configurações">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip content={isExpanded ? "Minimizar" : "Expandir"}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </Tooltip>
            <Tooltip content="Limpar conversa">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearConversation}
                disabled={messages.length === 0}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Tooltip>
          </div>
        </div>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-full mb-4">
                <Sparkles className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Bem-vindo ao Assistente IA</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                Faça qualquer pergunta ou solicite ajuda. Posso analisar documentos, gerar código, 
                criar conteúdo e muito mais.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <Button variant="outline" size="sm" onClick={() => setInput('Analise as tendências de marketing digital para 2024')}>
                  📊 Análise de Mercado
                </Button>
                <Button variant="outline" size="sm" onClick={() => setInput('Crie um script Python para automação')}>
                  💻 Gerar Código
                </Button>
                <Button variant="outline" size="sm" onClick={() => setInput('Escreva um artigo sobre IA')}>
                  ✍️ Criar Conteúdo
                </Button>
                <Button variant="outline" size="sm" onClick={() => setInput('Explique conceitos de machine learning')}>
                  🧠 Explicar Conceitos
                </Button>
                {currentModel.supports_video && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setInput('Crie um vídeo de um pôr do sol na praia')}>
                      🎬 Gerar Vídeo
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setInput('Faça um vídeo promocional para produto')}>
                      📹 Vídeo Marketing
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {/* Thinking indicator */}
                    {message.thinking && (
                      <div className="mb-2 p-2 backdrop-blur-xl bg-purple-100/10 dark:bg-purple-900/10 border border-purple-200/20 dark:border-purple-700/20 rounded shadow-xl shadow-purple-500/10 text-sm text-purple-800 dark:text-purple-200">
                        <div className="flex items-center space-x-2">
                          <Brain className="h-4 w-4" />
                          <span>Pensando: {message.thinking}</span>
                        </div>
                      </div>
                    )}
                    {/* Message content */}
                    <div className="prose prose-sm max-w-none">
                      {message.type === 'code' ? (
                        <CodeBlock code={message.content} language="typescript" />
                      ) : message.type === 'video' ? (
                        <div className="space-y-3">
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          {/* Video Player Component */}
                          <div className="backdrop-blur-xl bg-gray-900/10 dark:bg-gray-800/10 border border-gray-700/20 dark:border-gray-600/20 rounded-lg shadow-xl shadow-gray-500/10 overflow-hidden">
                            <div className="aspect-video bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center relative">
                              <div className="text-center text-white">
                                <Video className="h-16 w-16 mx-auto mb-4 opacity-80" />
                                <h3 className="text-lg font-semibold mb-2">Vídeo Gerado com Veo 3</h3>
                                <p className="text-sm opacity-90 mb-4">Resolução: 720p • Duração: 8s • Com áudio</p>
                                <div className="flex items-center justify-center space-x-2">
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                                  >
                                    <Play className="h-4 w-4 mr-2" />
                                    Reproduzir
                                  </Button>
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </Button>
                                </div>
                              </div>
                              {/* Simulated video preview */}
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                                  <Play className="h-8 w-8 text-white" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      )}
                    </div>
                    {/* Message metadata */}
                    {message.metadata && (
                      <div className="mt-2 text-xs opacity-70 space-y-1">
                        <div className="flex items-center justify-between">
                          <span>{message.metadata.model}</span>
                          <span>{message.metadata.duration}ms</span>
                        </div>
                        {message.metadata.tokens && (
                          <div className="flex items-center justify-between">
                            <span>{message.metadata.tokens} tokens</span>
                            <span>R$ {message.metadata.cost?.toFixed(4)}</span>
                          </div>
                        )}
                      </div>
                    )}
                    {/* Message actions */}
                    {message.role === 'assistant' && (
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-1">
                          <Tooltip content="Gostei">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReaction(message.id, 'thumbsUp')}
                              className={message.reactions?.thumbsUp ? 'text-green-600' : ''}
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Não gostei">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReaction(message.id, 'thumbsDown')}
                              className={message.reactions?.thumbsDown ? 'text-red-600' : ''}
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Favoritar">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReaction(message.id, 'starred')}
                              className={message.reactions?.starred ? 'text-yellow-600' : ''}
                            >
                              <Star className="h-3 w-3" />
                            </Button>
                          </Tooltip>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Tooltip content="Copiar">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyMessage(message.content)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Regenerar">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const userMessage = messages[messages.indexOf(message) - 1];
                                if (userMessage && userMessage.role === 'user') {
                                  sendMessage(userMessage.content);
                                }
                              }}
                            >
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                          </Tooltip>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {/* Streaming message */}
              {isStreaming && streamingMessage && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-4 bg-gray-100 dark:bg-gray-800">
                    <div className="flex items-center space-x-2 mb-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-gray-600">Gerando resposta...</span>
                    </div>
                    <div className="whitespace-pre-wrap">{streamingMessage}</div>
                  </div>
                </div>
              )}
              {/* Thinking indicator */}
              {thinking && (
                <div className="flex justify-start">
                  <div className="rounded-lg p-3 bg-purple-100 dark:bg-purple-900">
                    <div className="flex items-center space-x-2">
                      <Brain className="h-4 w-4 animate-pulse text-purple-600" />
                      <span className="text-sm text-purple-800 dark:text-purple-200">{thinking}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Input Area */}
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua mensagem... (Shift+Enter para nova linha)"
                  className="resize-none"
                  rows={1}
                  maxLength={10000}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                  {input.length}/10000
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  className="hidden"
                />
                <Tooltip content="Anexar arquivo">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isGenerating}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                </Tooltip>
                <Tooltip content={isRecording ? "Parar gravação" : "Gravar áudio"}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={toggleRecording}
                    disabled={isGenerating}
                    className={isRecording ? 'text-red-600' : ''}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </Tooltip>
                {currentModel.supports_video && (
                  <Tooltip content="Gerar vídeo">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setInput('Crie um vídeo ')}
                      disabled={isGenerating}
                      className="text-purple-600"
                    >
                      <Video className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!input.trim() || isGenerating}
                  loading={isGenerating}
                  className="min-w-[80px]"
                >
                  {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            {/* Quick actions */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <span>Modelo: {currentModel.name}</span>
                <span>•</span>
                <span>{sessionTokens} tokens utilizados</span>
                <span>•</span>
                <span>Custo: R$ {sessionCost.toFixed(4)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInput('Resuma os pontos principais da nossa conversa')}
                  disabled={messages.length === 0}
                >
                  📝 Resumir
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInput('Continue a partir do último ponto que discutimos')}
                  disabled={messages.length === 0}
                >
                  ⏭️ Continuar
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Card>
      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Configurações da IA"
        size="lg"
      >
        <div className="space-y-6">
          <Tabs defaultValue="model">
            <div className="border-b">
              <nav className="flex space-x-8">
                <button className="py-2 px-1 border-b-2 border-blue-500 text-blue-600 text-sm font-medium">
                  Modelo
                </button>
                <button className="py-2 px-1 text-gray-500 hover:text-gray-700 text-sm font-medium">
                  Parâmetros
                </button>
                <button className="py-2 px-1 text-gray-500 hover:text-gray-700 text-sm font-medium">
                  Avançado
                </button>
              </nav>
            </div>
            <div className="mt-6">
              {/* Model Selection */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Modelo de IA</label>
                  <div className="grid gap-3">
                    {DEFAULT_MODELS.map((model) => (
                      <div
                        key={model.id}
                        className={`p-4 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-lg shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 cursor-pointer ${
                          selectedModel === model.id
                            ? 'border-blue-500/50 bg-blue-500/10 shadow-blue-500/20'
                            : 'hover:border-blue-300/50 hover:shadow-blue-500/20'
                        }`}
                        onClick={() => setSelectedModel(model.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{model.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{model.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {model.provider}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                ${model.cost_per_token}/token
                              </span>
                              {model.supports_video && (
                                <Badge variant="success" className="text-xs">
                                  <Video className="h-3 w-3 mr-1" />
                                  Video
                                </Badge>
                              )}
                              {model.supports_vision && (
                                <Badge variant="secondary" className="text-xs">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Vision
                                </Badge>
                              )}
                              {model.supports_audio && (
                                <Badge variant="secondary" className="text-xs">
                                  <Volume2 className="h-3 w-3 mr-1" />
                                  Audio
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedModel === model.id
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Tabs>
        </div>
      </Modal>
    </div>
  );
};
export default RevolutionaryAIInterface;
