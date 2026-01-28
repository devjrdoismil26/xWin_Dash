/**
 * 🚀 PyLab Integration Component
 * 
 * Componente para integração entre aiLaboratory e PyLab
 * Interface unificada para acessar todas as capacidades do PyLab
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain, 
  Image, 
  Video, 
  Code, 
  BarChart3, 
  FileText, 
  Upload, 
  Settings, 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Zap,
  Cpu,
  Database,
  Network,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Server,
  Cloud,
  Wifi,
  Bluetooth,
  Battery,
  Signal,
  AlertTriangle,
  Info,
  HelpCircle,
  Lightbulb,
  Sun,
  Moon,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Target,
  Star,
  Heart,
  Bookmark,
  Download,
  Share2,
  Copy,
  Edit,
  Trash2,
  Plus,
  Minus,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Maximize2,
  Minimize2,
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move,
  MousePointer,
  Hand,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowDownRight,
  RotateCw as RotateCwIcon,
  RotateCcw as RotateCcwIcon,
  FlipHorizontal,
  FlipVertical,
  Mirror,
  Paste,
  Cut,
  Undo,
  Redo,
  Save,
  File,
  Folder,
  FolderOpen,
  FolderPlus,
  FolderMinus,
  FolderX,
  FolderCheck,
  FolderEdit,
  FolderSearch,
  FolderDownload,
  FolderUpload,
  FolderShare,
  FolderLock,
  FolderUnlock,
  FolderHeart,
  FolderStar,
  BookmarkPlus,
  BookmarkMinus,
  BookmarkX,
  BookmarkCheck,
  BookmarkEdit,
  BookmarkSearch,
  BookmarkDownload,
  BookmarkUpload,
  BookmarkShare,
  BookmarkLock,
  BookmarkUnlock,
  BookmarkHeart,
  BookmarkStar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge"
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from "@/components/ui/Input"
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  pylabIntegrationService,
  PyLabCapabilities,
  PyLabSystemStatus,
  PyLabGenerationRequest,
  PyLabGenerationResponse,
  PyLabProgressResponse,
  PyLabTextAnalysisRequest,
  PyLabTextAnalysisResponse,
  PyLabImageAnalysisRequest,
  PyLabImageAnalysisResponse,
  PyLabCodeGenerationRequest,
  PyLabCodeGenerationResponse
} from '../services/pylabIntegrationService';

// ============================================================================
// TYPES
// ============================================================================

interface PyLabIntegrationProps {
  className?: string;
  onGenerationComplete?: (result: PyLabGenerationResponse) => void;
  onAnalysisComplete?: (result: Record<string, unknown>) => void;
}

interface GenerationTask {
  id: string;
  type: 'image' | 'video' | 'text' | 'code';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: Record<string, unknown>;
  error?: string;
  startTime: Date;
  endTime?: Date;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const PyLabIntegration: React.FC<PyLabIntegrationProps> = ({
  className,
  onGenerationComplete,
  onAnalysisComplete
}) => {
  // ============================================================================
  // STATE
  // ============================================================================
  
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [capabilities, setCapabilities] = useState<PyLabCapabilities | null>(null);
  const [systemStatus, setSystemStatus] = useState<PyLabSystemStatus | null>(null);
  const [activeTab, setActiveTab] = useState<'media' | 'analysis' | 'code' | 'bi' | 'status'>('media');
  const [generationTasks, setGenerationTasks] = useState<GenerationTask[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('');

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    initializeConnection();
  }, []);

  useEffect(() => {
    if (connectionStatus === 'connected') {
      loadCapabilities();
      loadSystemStatus();
    }
  }, [connectionStatus]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const initializeConnection = useCallback(async () => {
    setConnectionStatus('connecting');
    try {
      const isConnected = await pylabIntegrationService.checkConnection();
      setConnectionStatus(isConnected ? 'connected' : 'error');
    } catch (error) {
      console.error('Erro ao conectar com PyLab:', error);
      setConnectionStatus('error');
    }
  }, []);

  const loadCapabilities = useCallback(async () => {
    try {
      const caps = await pylabIntegrationService.getCapabilities();
      setCapabilities(caps);
    } catch (error) {
      console.error('Erro ao carregar capacidades:', error);
    }
  }, []);

  const loadSystemStatus = useCallback(async () => {
    try {
      const status = await pylabIntegrationService.getSystemStatus();
      setSystemStatus(status);
    } catch (error) {
      console.error('Erro ao carregar status do sistema:', error);
    }
  }, []);

  const handleImageGeneration = useCallback(async (request: PyLabGenerationRequest) => {
    setIsGenerating(true);
    const taskId = `img_${Date.now()}`;
    
    const task: GenerationTask = {
      id: taskId,
      type: 'image',
      status: 'pending',
      progress: 0,
      startTime: new Date()
    };

    setGenerationTasks(prev => [...prev, task]);

    try {
      const response = await pylabIntegrationService.generateImage(request);
      
      // Atualizar task
      setGenerationTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, status: 'processing', progress: 50 }
          : t
      ));

      // Polling para progresso
      const pollProgress = async () => {
        try {
          const progress = await pylabIntegrationService.getGenerationProgress(response.task_id);
          
          setGenerationTasks(prev => prev.map(t => 
            t.id === taskId 
              ? { ...t, progress: progress.progress_percent }
              : t
          ));

          if (progress.status === 'completed') {
            const finalStatus = await pylabIntegrationService.getGenerationStatus(response.task_id);
            setGenerationTasks(prev => prev.map(t => 
              t.id === taskId 
                ? { ...t, status: 'completed', progress: 100, result: finalStatus, endTime: new Date() }
                : t
            ));
            onGenerationComplete?.(finalStatus);
            setIsGenerating(false);
          } else if (progress.status === 'failed') {
            setGenerationTasks(prev => prev.map(t => 
              t.id === taskId 
                ? { ...t, status: 'failed', error: 'Geração falhou', endTime: new Date() }
                : t
            ));
            setIsGenerating(false);
          } else {
            setTimeout(pollProgress, 2000);
          }
        } catch (error) {
          console.error('Erro ao verificar progresso:', error);
          setGenerationTasks(prev => prev.map(t => 
            t.id === taskId 
              ? { ...t, status: 'failed', error: 'Erro ao verificar progresso', endTime: new Date() }
              : t
          ));
          setIsGenerating(false);
        }
      };

      setTimeout(pollProgress, 1000);
    } catch (error) {
      console.error('Erro na geração de imagem:', error);
      setGenerationTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, status: 'failed', error: 'Erro na geração', endTime: new Date() }
          : t
      ));
      setIsGenerating(false);
    }
  }, [onGenerationComplete]);

  const handleVideoGeneration = useCallback(async (request: PyLabGenerationRequest) => {
    setIsGenerating(true);
    const taskId = `vid_${Date.now()}`;
    
    const task: GenerationTask = {
      id: taskId,
      type: 'video',
      status: 'pending',
      progress: 0,
      startTime: new Date()
    };

    setGenerationTasks(prev => [...prev, task]);

    try {
      const response = await pylabIntegrationService.generateVideo(request);
      
      setGenerationTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, status: 'processing', progress: 10 }
          : t
      ));

      // Polling para progresso (vídeos demoram mais)
      const pollProgress = async () => {
        try {
          const progress = await pylabIntegrationService.getGenerationProgress(response.task_id);
          
          setGenerationTasks(prev => prev.map(t => 
            t.id === taskId 
              ? { ...t, progress: progress.progress_percent }
              : t
          ));

          if (progress.status === 'completed') {
            const finalStatus = await pylabIntegrationService.getGenerationStatus(response.task_id);
            setGenerationTasks(prev => prev.map(t => 
              t.id === taskId 
                ? { ...t, status: 'completed', progress: 100, result: finalStatus, endTime: new Date() }
                : t
            ));
            onGenerationComplete?.(finalStatus);
            setIsGenerating(false);
          } else if (progress.status === 'failed') {
            setGenerationTasks(prev => prev.map(t => 
              t.id === taskId 
                ? { ...t, status: 'failed', error: 'Geração falhou', endTime: new Date() }
                : t
            ));
            setIsGenerating(false);
          } else {
            setTimeout(pollProgress, 3000);
          }
        } catch (error) {
          console.error('Erro ao verificar progresso:', error);
          setGenerationTasks(prev => prev.map(t => 
            t.id === taskId 
              ? { ...t, status: 'failed', error: 'Erro ao verificar progresso', endTime: new Date() }
              : t
          ));
          setIsGenerating(false);
        }
      };

      setTimeout(pollProgress, 2000);
    } catch (error) {
      console.error('Erro na geração de vídeo:', error);
      setGenerationTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, status: 'failed', error: 'Erro na geração', endTime: new Date() }
          : t
      ));
      setIsGenerating(false);
    }
  }, [onGenerationComplete]);

  const handleTextAnalysis = useCallback(async (request: PyLabTextAnalysisRequest) => {
    try {
      const response = await pylabIntegrationService.analyzeText(request);
      onAnalysisComplete?.(response);
    } catch (error) {
      console.error('Erro na análise de texto:', error);
    }
  }, [onAnalysisComplete]);

  const handleImageAnalysis = useCallback(async (request: PyLabImageAnalysisRequest) => {
    try {
      const response = await pylabIntegrationService.analyzeImage(request);
      onAnalysisComplete?.(response);
    } catch (error) {
      console.error('Erro na análise de imagem:', error);
    }
  }, [onAnalysisComplete]);

  const handleCodeGeneration = useCallback(async (request: PyLabCodeGenerationRequest) => {
    try {
      const response = await pylabIntegrationService.generateCode(request);
      onAnalysisComplete?.(response);
    } catch (error) {
      console.error('Erro na geração de código:', error);
    }
  }, [onAnalysisComplete]);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderConnectionStatus = () => {
    const statusConfig = {
      disconnected: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', text: 'Desconectado' },
      connecting: { icon: RefreshCw, color: 'text-yellow-500', bg: 'bg-yellow-50', text: 'Conectando...' },
      connected: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', text: 'Conectado' },
      error: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', text: 'Erro de Conexão' }
    };

    const config = statusConfig[connectionStatus];
    const Icon = config.icon;

    return (
      <div className={cn('flex items-center gap-2 px-3 py-2 rounded-lg', config.bg)}>
        <Icon className={cn('h-4 w-4', config.color, connectionStatus === 'connecting' && 'animate-spin')} />
        <span className={cn('text-sm font-medium', config.color)}>
          PyLab: {config.text}
        </span>
        {connectionStatus === 'error' && (
          <Button
            size="sm"
            variant="outline"
            onClick={initializeConnection}
            className="ml-auto"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Reconectar
          </Button>
        )}
      </div>
    );
  };

  const renderSystemStatus = () => {
    if (!systemStatus) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <Card.Content className="p-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">CPU</span>
            </div>
            <p className="text-2xl font-bold mt-1">{systemStatus.system_resources.cpu_usage}</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-4">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">RAM</span>
            </div>
            <p className="text-2xl font-bold mt-1">{systemStatus.system_resources.memory_usage}</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Tasks Ativas</span>
            </div>
            <p className="text-2xl font-bold mt-1">{systemStatus.active_tasks}</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Total</span>
            </div>
            <p className="text-2xl font-bold mt-1">{systemStatus.total_generations}</p>
          </Card.Content>
        </Card>
      </div>
    );
  };

  const renderGenerationTasks = () => {
    if (generationTasks.length === 0) return null;

    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Tarefas de Geração</h3>
        {generationTasks.map((task) => (
          <Card key={task.id}>
            <Card.Content className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {task.type === 'image' && <Image className="h-4 w-4 text-blue-500" />}
                  {task.type === 'video' && <Video className="h-4 w-4 text-purple-500" />}
                  <span className="font-medium">{task.id}</span>
                  <Badge variant={
                    task.status === 'completed' ? 'default' :
                    task.status === 'failed' ? 'destructive' :
                    task.status === 'processing' ? 'secondary' : 'outline'
                  }>
                    {task.status}
                  </Badge>
                </div>
                <span className="text-sm text-gray-500">
                  {task.startTime.toLocaleTimeString()}
                </span>
              </div>
              
              <Progress value={task.progress} className="mb-2" />
              
              {task.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{task.error}</AlertDescription>
                </Alert>
              )}
              
              {task.result && (
                <div className="mt-2 p-2 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✅ Geração concluída: {task.result.filename}
                  </p>
                </div>
              )}
            </Card.Content>
          </Card>
        ))}
      </div>
    );
  };

  const renderMediaGeneration = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Geração de Imagem */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Image className="h-5 w-5 text-blue-500" />
                Geração de Imagem
              </Card.Title>
              <Card.Description>
                Gere imagens usando Stable Diffusion XL
              </Card.Description>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div>
                <Label htmlFor="image-prompt">Prompt</Label>
                <Textarea
                  id="image-prompt"
                  placeholder="Descreva a imagem que deseja gerar..."
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image-width">Largura</Label>
                  <Select defaultValue="1024">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="512">512px</SelectItem>
                      <SelectItem value="768">768px</SelectItem>
                      <SelectItem value="1024">1024px</SelectItem>
                      <SelectItem value="1536">1536px</SelectItem>
                      <SelectItem value="2048">2048px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="image-height">Altura</Label>
                  <Select defaultValue="1024">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="512">512px</SelectItem>
                      <SelectItem value="768">768px</SelectItem>
                      <SelectItem value="1024">1024px</SelectItem>
                      <SelectItem value="1536">1536px</SelectItem>
                      <SelectItem value="2048">2048px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="image-style">Estilo</Label>
                <Select defaultValue="realistic">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realistic">Realista</SelectItem>
                    <SelectItem value="artistic">Artístico</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                    <SelectItem value="concept_art">Concept Art</SelectItem>
                    <SelectItem value="photography">Fotografia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => handleImageGeneration({
                  prompt: 'A beautiful landscape',
                  style: 'realistic',
                  width: 1024,
                  height: 1024,
                  steps: 50
                })}
                disabled={isGenerating || connectionStatus !== 'connected'}
              >
                <Play className="h-4 w-4 mr-2" />
                Gerar Imagem
              </Button>
            </Card.Content>
          </Card>

          {/* Geração de Vídeo */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Video className="h-5 w-5 text-purple-500" />
                Geração de Vídeo
              </Card.Title>
              <Card.Description>
                Gere vídeos usando ModelScope T2V
              </Card.Description>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div>
                <Label htmlFor="video-prompt">Prompt</Label>
                <Textarea
                  id="video-prompt"
                  placeholder="Descreva o vídeo que deseja gerar..."
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="video-duration">Duração (segundos)</Label>
                  <Select defaultValue="10">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5s</SelectItem>
                      <SelectItem value="10">10s</SelectItem>
                      <SelectItem value="15">15s</SelectItem>
                      <SelectItem value="20">20s</SelectItem>
                      <SelectItem value="30">30s</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="video-quality">Qualidade</Label>
                  <Select defaultValue="hd">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hd">HD</SelectItem>
                      <SelectItem value="full_hd">Full HD</SelectItem>
                      <SelectItem value="4k">4K</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => handleVideoGeneration({
                  prompt: 'A beautiful landscape animation',
                  duration: 10,
                  fps: 24,
                  quality: 'hd'
                })}
                disabled={isGenerating || connectionStatus !== 'connected'}
              >
                <Play className="h-4 w-4 mr-2" />
                Gerar Vídeo
              </Button>
            </Card.Content>
          </Card>
        </div>
      </div>
    );
  };

  const renderAnalysisTools = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Análise de Texto */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-500" />
                Análise de Texto
              </Card.Title>
              <Card.Description>
                Análise avançada de texto com GPT-4
              </Card.Description>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div>
                <Label htmlFor="text-analysis-type">Tipo de Análise</Label>
                <Select defaultValue="sentiment">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sentiment">Análise de Sentimento</SelectItem>
                    <SelectItem value="business_insights">Insights de Negócio</SelectItem>
                    <SelectItem value="document_summary">Resumo de Documento</SelectItem>
                    <SelectItem value="competitor_analysis">Análise de Concorrentes</SelectItem>
                    <SelectItem value="executive_report">Relatório Executivo</SelectItem>
                    <SelectItem value="market_research">Pesquisa de Mercado</SelectItem>
                    <SelectItem value="customer_feedback">Feedback de Clientes</SelectItem>
                    <SelectItem value="financial_analysis">Análise Financeira</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="text-input">Texto para Análise</Label>
                <Textarea
                  id="text-input"
                  placeholder="Cole o texto que deseja analisar..."
                  className="mt-1 min-h-[120px]"
                />
              </div>
              
              <Button 
                className="w-full"
                onClick={() => handleTextAnalysis({
                  text: 'Sample text for analysis',
                  analysis_type: 'sentiment',
                  language: 'pt-BR'
                })}
                disabled={connectionStatus !== 'connected'}
              >
                <Brain className="h-4 w-4 mr-2" />
                Analisar Texto
              </Button>
            </Card.Content>
          </Card>

          {/* Análise de Imagem */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Image className="h-5 w-5 text-orange-500" />
                Análise de Imagem
              </Card.Title>
              <Card.Description>
                Análise visual com CLIP e BLIP
              </Card.Description>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div>
                <Label htmlFor="image-analysis-type">Tipo de Análise</Label>
                <Select defaultValue="content_analysis">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="content_analysis">Análise de Conteúdo</SelectItem>
                    <SelectItem value="brand_analysis">Análise de Marca</SelectItem>
                    <SelectItem value="product_analysis">Análise de Produto</SelectItem>
                    <SelectItem value="marketing_analysis">Análise de Marketing</SelectItem>
                    <SelectItem value="competitor_analysis">Análise de Concorrentes</SelectItem>
                    <SelectItem value="quality_analysis">Análise de Qualidade</SelectItem>
                    <SelectItem value="emotion_analysis">Análise de Emoção</SelectItem>
                    <SelectItem value="accessibility_analysis">Análise de Acessibilidade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="image-upload">Upload de Imagem</Label>
                <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Arraste uma imagem aqui ou clique para selecionar
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    className="mt-2"
                  />
                </div>
              </div>
              
              <Button 
                className="w-full"
                onClick={() => handleImageAnalysis({
                  image_data: 'base64_image_data',
                  analysis_type: 'content_analysis'
                })}
                disabled={connectionStatus !== 'connected'}
              >
                <Eye className="h-4 w-4 mr-2" />
                Analisar Imagem
              </Button>
            </Card.Content>
          </Card>
        </div>
      </div>
    );
  };

  const renderCodeGeneration = () => {
    return (
      <div className="space-y-6">
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Code className="h-5 w-5 text-indigo-500" />
              Geração de Código
            </Card.Title>
            <Card.Description>
              Gere código usando CodeT5 e GPT-4
            </Card.Description>
          </Card.Header>
          <Card.Content className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code-language">Linguagem</Label>
                <Select defaultValue="python">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="php">PHP</SelectItem>
                    <SelectItem value="sql">SQL</SelectItem>
                    <SelectItem value="bash">Bash</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="go">Go</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="code-type">Tipo de Geração</Label>
                <Select defaultValue="function_generation">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="function_generation">Função</SelectItem>
                    <SelectItem value="api_creation">API</SelectItem>
                    <SelectItem value="sql_query">Query SQL</SelectItem>
                    <SelectItem value="automation_script">Script de Automação</SelectItem>
                    <SelectItem value="data_analysis">Análise de Dados</SelectItem>
                    <SelectItem value="web_scraping">Web Scraping</SelectItem>
                    <SelectItem value="integration">Integração</SelectItem>
                    <SelectItem value="optimization">Otimização</SelectItem>
                    <SelectItem value="documentation">Documentação</SelectItem>
                    <SelectItem value="refactoring">Refatoração</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="code-description">Descrição</Label>
              <Textarea
                id="code-description"
                placeholder="Descreva o código que deseja gerar..."
                className="mt-1 min-h-[100px]"
              />
            </div>
            
            <Button 
              className="w-full"
              onClick={() => handleCodeGeneration({
                description: 'Create a function to calculate fibonacci numbers',
                language: 'python',
                generation_type: 'function_generation'
              })}
              disabled={connectionStatus !== 'connected'}
            >
              <Code className="h-4 w-4 mr-2" />
              Gerar Código
            </Button>
          </Card.Content>
        </Card>
      </div>
    );
  };

  const renderBusinessIntelligence = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-emerald-500" />
                Análise Completa
              </Card.Title>
              <Card.Description>
                Análise multi-modal de business intelligence
              </Card.Description>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div>
                <Label htmlFor="bi-text">Dados de Texto</Label>
                <Textarea
                  id="bi-text"
                  placeholder="Cole dados de texto para análise..."
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="bi-domain">Domínio de Negócio</Label>
                <Input
                  id="bi-domain"
                  placeholder="Ex: e-commerce, SaaS, fintech..."
                  className="mt-1"
                />
              </div>
              
              <Button 
                className="w-full"
                onClick={() => {
                  // Implementar análise completa
                }}
                disabled={connectionStatus !== 'connected'}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Análise Completa
              </Button>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-cyan-500" />
                Dashboard Executivo
              </Card.Title>
              <Card.Description>
                Gere insights executivos automaticamente
              </Card.Description>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div>
                <Label htmlFor="exec-data">Dados Executivos</Label>
                <Textarea
                  id="exec-data"
                  placeholder="Cole dados para dashboard executivo..."
                  className="mt-1"
                />
              </div>
              
              <Button 
                className="w-full"
                onClick={() => {
                  // Implementar dashboard executivo
                }}
                disabled={connectionStatus !== 'connected'}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Gerar Dashboard
              </Button>
            </Card.Content>
          </Card>
        </div>
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  if (connectionStatus === 'disconnected') {
    return (
      <div className={cn('p-6', className)}>
        <Card>
          <Card.Content className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">PyLab Não Conectado</h3>
            <p className="text-gray-600 mb-4">
              O serviço PyLab não está disponível. Verifique se o serviço está rodando.
            </p>
            <Button onClick={initializeConnection}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Conectar
            </Button>
          </Card.Content>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn('p-6 space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-500" />
            PyLab Integration
          </h2>
          <p className="text-gray-600">
            Laboratório de IA avançada integrado ao aiLaboratory
          </p>
        </div>
        {renderConnectionStatus()}
      </div>

      {/* System Status */}
      {connectionStatus === 'connected' && (
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Status do Sistema
            </Card.Title>
          </Card.Header>
          <Card.Content>
            {renderSystemStatus()}
          </Card.Content>
        </Card>
      )}

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="media">Mídia</TabsTrigger>
          <TabsTrigger value="analysis">Análise</TabsTrigger>
          <TabsTrigger value="code">Código</TabsTrigger>
          <TabsTrigger value="bi">BI</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
        </TabsList>

        <TabsContent value="media" className="space-y-6">
          {renderMediaGeneration()}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          {renderAnalysisTools()}
        </TabsContent>

        <TabsContent value="code" className="space-y-6">
          {renderCodeGeneration()}
        </TabsContent>

        <TabsContent value="bi" className="space-y-6">
          {renderBusinessIntelligence()}
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          {renderGenerationTasks()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PyLabIntegration;
