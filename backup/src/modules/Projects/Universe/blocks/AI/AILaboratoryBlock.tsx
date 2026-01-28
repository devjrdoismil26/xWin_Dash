import React, { useState, useEffect, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { 
  Brain, 
  Image, 
  Video, 
  FileText, 
  Code,
  BarChart3,
  Wand2, 
  Play, 
  Pause, 
  Download, 
  Settings,
  Layers,
  Sparkles,
  Cpu,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Upload,
  X,
  Eye,
  Edit,
  Trash2,
  Copy,
  Star,
  TrendingUp,
  Activity,
  Users,
  Target,
  Database,
  Network,
  Globe,
  ChevronDown,
  ChevronRight,
  Maximize2,
  Minimize2,
  RotateCcw,
  Share2,
  Lock,
  Unlock,
  Heart,
  Bookmark
} from 'lucide-react';
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Progress } from '@/components/ui/progress';
import { Card } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from "@/components/ui/Input"
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import BaseBlock from '../../components/Base/BaseBlock';
import { BaseBlockProps } from '../../types/blocks';
import { 
  AILaboratoryBlockData,
  AIGenerationRequest,
  AIGenerationResult,
  AIGenerationType,
  ImageStyle,
  VideoQuality,
  AIAnalysisType,
  ImageAnalysisType,
  CodeGenerationType,
  ProgrammingLanguage,
  DEFAULT_GENERATION_CONFIG
} from './types';
// import { useAILaboratory } from './hooks/useAILaboratory';
interface AILaboratoryBlockProps extends BaseBlockProps {
  data: AILaboratoryBlockData;
}
const AILaboratoryBlock: React.FC<AILaboratoryBlockProps> = ({ 
  data, 
  isConnectable = true,
  isSelected = false,
  onUpdate,
  onDelete,
  onConfigure
}) => {
  // ============================================================================
  // HOOKS
  // ============================================================================
  
  const {
    status,
    connection,
    capabilities,
    systemStatus,
    generations,
    activeGenerations,
    error,
    checkConnection,
    generate,
    cancelGeneration,
    uploadImage,
    clearError,
    clearHistory,
    getMetrics
  } = { experiments: [], loading: false, error: null, createExperiment: () => {}, updateExperiment: () => {}, deleteExperiment: () => {}, runExperiment: () => {} };

  // ============================================================================
  // STATE
  // ============================================================================
  
  const [activeTab, setActiveTab] = useState<AIGenerationType>('image');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>('realistic');
  const [selectedQuality, setSelectedQuality] = useState<VideoQuality>('hd');
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<AIAnalysisType>('sentiment');
  const [selectedImageAnalysisType, setSelectedImageAnalysisType] = useState<ImageAnalysisType>('content_analysis');
  const [selectedCodeType, setSelectedCodeType] = useState<CodeGenerationType>('function_generation');
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage>('python');
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [steps, setSteps] = useState(50);
  const [duration, setDuration] = useState(10);
  const [fps, setFps] = useState(24);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2000);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [batchSize, setBatchSize] = useState(1);
  const [seed, setSeed] = useState<number | undefined>();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    // Verificar conexão inicial
    checkConnection();
  }, [checkConnection]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const getTabIcon = (tab: AIGenerationType) => {
    switch (tab) {
      case 'image': return <Image className="w-3 h-3" />;
      case 'video': return <Video className="w-3 h-3" />;
      case 'text': return <FileText className="w-3 h-3" />;
      case 'code': return <Code className="w-3 h-3" />;
      case 'analysis': return <BarChart3 className="w-3 h-3" />;
      default: return <Brain className="w-3 h-3" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-3 h-3 text-yellow-500" />;
      case 'processing': return <Clock className="w-3 h-3 text-blue-500 animate-spin" />;
      case 'completed': return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'failed': return <AlertCircle className="w-3 h-3 text-red-500" />;
      case 'cancelled': return <X className="w-3 h-3 text-gray-500" />;
      default: return <Clock className="w-3 h-3 text-gray-500" />;
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!currentPrompt.trim()) return;

    try {
      const request: AIGenerationRequest = {
        type: activeTab,
        prompt: currentPrompt,
        negative_prompt: negativePrompt,
        style: selectedStyle,
        width,
        height,
        steps,
        guidance_scale: guidanceScale,
        seed,
        batch_size: batchSize,
        duration,
        fps,
        quality: selectedQuality,
        temperature,
        max_tokens: maxTokens,
        language: selectedLanguage,
        generation_type: selectedCodeType,
        analysis_type: activeTab === 'text' ? selectedAnalysisType : selectedImageAnalysisType,
        context: uploadedFile ? { image_data: 'base64_data' } : undefined
      };

      await generate(request);
      setCurrentPrompt('');
      setNegativePrompt('');
    } catch (error) {
      console.error('Erro na geração:', error);
    }
  }, [
    currentPrompt, negativePrompt, activeTab, selectedStyle, width, height, steps,
    guidanceScale, seed, batchSize, duration, fps, selectedQuality, temperature,
    maxTokens, selectedLanguage, selectedCodeType, selectedAnalysisType,
    selectedImageAnalysisType, uploadedFile, generate
  ]);

  const handleCancelGeneration = useCallback(async (taskId: string) => {
    try {
      await cancelGeneration(taskId);
    } catch (error) {
      console.error('Erro ao cancelar geração:', error);
    }
  }, [cancelGeneration]);

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      setUploadedFile(file);
      await uploadImage(file);
    } catch (error) {
      console.error('Erro no upload:', error);
    }
  }, [uploadImage]);

  const handleConfigure = useCallback(() => {
    setShowSettings(!showSettings);
    onConfigure?.();
  }, [showSettings, onConfigure]);

  const handleDownload = useCallback((generation: AIGenerationResult) => {
    if (generation.file_url) {
      const link = document.createElement('a');
      link.href = generation.file_url;
      link.download = `generation_${generation.id}`;
      link.click();
    }
  }, []);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderConnectionStatus = () => {
    const statusConfig = {
      disconnected: { icon: X, color: 'text-red-500', bg: 'bg-red-50', text: 'Desconectado' },
      connecting: { icon: RefreshCw, color: 'text-yellow-500', bg: 'bg-yellow-50', text: 'Conectando...' },
      connected: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', text: 'Conectado' },
      error: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', text: 'Erro' }
    };

    const config = statusConfig[connection.status];
    const Icon = config.icon;

    return (
      <div className={cn('flex items-center gap-1 px-2 py-1 rounded text-xs', config.bg, config.color)}>
        <Icon className={cn('h-3 w-3', connection.status === 'connecting' && 'animate-spin')} />
        <span className="font-medium">PyLab: {config.text}</span>
      </div>
    );
  };

  const renderGenerationForm = () => {
    return (
      <div className="space-y-3">
        {/* Prompt Input */}
        <div>
          <Label htmlFor="prompt" className="text-xs font-medium">Prompt</Label>
          <Textarea
            id="prompt"
            value={currentPrompt}
            onChange={(e) => setCurrentPrompt(e.target.value)}
            placeholder="Descreva o que deseja gerar..."
            className="mt-1 h-16 text-xs resize-none"
          />
        </div>

        {/* Negative Prompt (for images/videos) */}
        {(activeTab === 'image' || activeTab === 'video') && (
          <div>
            <Label htmlFor="negative-prompt" className="text-xs font-medium">Prompt Negativo</Label>
            <Input
              id="negative-prompt"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="O que não quer na imagem..."
              className="mt-1 h-8 text-xs"
            />
          </div>
        )}

        {/* Tab-specific settings */}
        {activeTab === 'image' && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs font-medium">Estilo</Label>
              <Select value={selectedStyle} onValueChange={(value: ImageStyle) => setSelectedStyle(value)}>
                <SelectTrigger className="h-8 text-xs">
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
            <div>
              <Label className="text-xs font-medium">Dimensões</Label>
              <Select value={`${width}x${height}`} onValueChange={(value) => {
                const [w, h] = value.split('x').map(Number);
                setWidth(w);
                setHeight(h);
              }}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="512x512">512x512</SelectItem>
                  <SelectItem value="768x768">768x768</SelectItem>
                  <SelectItem value="1024x1024">1024x1024</SelectItem>
                  <SelectItem value="1536x1536">1536x1536</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {activeTab === 'video' && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs font-medium">Qualidade</Label>
              <Select value={selectedQuality} onValueChange={(value: VideoQuality) => setSelectedQuality(value)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hd">HD</SelectItem>
                  <SelectItem value="full_hd">Full HD</SelectItem>
                  <SelectItem value="4k">4K</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-medium">Duração: {duration}s</Label>
              <Slider
                value={[duration]}
                onValueChange={([value]) => setDuration(value)}
                min={5}
                max={30}
                step={1}
                className="mt-1"
              />
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div>
            <Label className="text-xs font-medium">Tipo de Análise</Label>
            <Select value={selectedAnalysisType} onValueChange={(value: AIAnalysisType) => setSelectedAnalysisType(value)}>
              <SelectTrigger className="h-8 text-xs">
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
        )}

        {activeTab === 'code' && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs font-medium">Linguagem</Label>
              <Select value={selectedLanguage} onValueChange={(value: ProgrammingLanguage) => setSelectedLanguage(value)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="php">PHP</SelectItem>
                  <SelectItem value="sql">SQL</SelectItem>
                  <SelectItem value="bash">Bash</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-medium">Tipo</Label>
              <Select value={selectedCodeType} onValueChange={(value: CodeGenerationType) => setSelectedCodeType(value)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="function_generation">Função</SelectItem>
                  <SelectItem value="api_creation">API</SelectItem>
                  <SelectItem value="sql_query">Query SQL</SelectItem>
                  <SelectItem value="automation_script">Script de Automação</SelectItem>
                  <SelectItem value="data_analysis">Análise de Dados</SelectItem>
                  <SelectItem value="web_scraping">Web Scraping</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={!currentPrompt.trim() || connection.status !== 'connected' || activeGenerations.length > 0}
          className="w-full h-8 text-xs"
        >
          <Wand2 className="w-3 h-3 mr-1" />
          {activeGenerations.length > 0 ? 'Gerando...' : `Gerar ${activeTab}`}
        </Button>
      </div>
    );
  };

  const renderGenerationsList = () => {
    const filteredGenerations = generations.filter(gen => gen.type === activeTab);
    
    if (filteredGenerations.length === 0) {
      return (
        <div className="text-center py-4 text-gray-400">
          <Brain className="w-6 h-6 mx-auto mb-2 opacity-50" />
          <p className="text-xs">Nenhuma geração ainda</p>
        </div>
      );
    }

    return (
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {filteredGenerations.slice(0, 3).map((generation) => (
          <motion.div
            key={generation.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-2 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {getStatusIcon(generation.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 truncate">{generation.prompt}</p>
                  {generation.status === 'processing' && (
                    <div className="mt-1">
                      <Progress value={generation.progress} className="h-1" />
                      <span className="text-xs text-gray-500">{generation.progress}%</span>
                    </div>
                  )}
                  {generation.status === 'completed' && generation.result && (
                    <p className="text-xs text-gray-500 truncate">
                      {typeof generation.result === 'string' ? generation.result : 'Concluído'}
                    </p>
                  )}
                  {generation.status === 'failed' && generation.error && (
                    <p className="text-xs text-red-500 truncate">{generation.error}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                {generation.status === 'processing' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCancelGeneration(generation.id)}
                    className="p-1 h-6 w-6"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
                {generation.status === 'completed' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDownload(generation)}
                    className="p-1 h-6 w-6"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };
  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <BaseBlock
      id={data.id || 'ai-laboratory'}
      type="aiLaboratory"
      data={data}
      isConnectable={isConnectable}
      isSelected={isSelected}
      onUpdate={onUpdate}
      onDelete={onDelete}
      onConfigure={onConfigure}
    >
      {/* Connection Handles */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="prompt-in" 
        isConnectable={isConnectable}
        className="w-3 h-3 bg-cyan-500"
        style={{ top: '30%' }}
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        id="image-in" 
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-500"
        style={{ top: '50%' }}
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        id="data-in" 
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
        style={{ top: '70%' }}
      />
      
      <Handle 
        type="source" 
        position={Position.Right} 
        id="content-out" 
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-500"
        style={{ top: '30%' }}
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="code-out" 
        isConnectable={isConnectable}
        className="w-3 h-3 bg-orange-500"
        style={{ top: '50%' }}
      />
      <Handle 
        type="source" 
        position={Position.Top} 
        id="media-out" 
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-500"
        style={{ left: '30%' }}
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="analysis-out" 
        isConnectable={isConnectable}
        className="w-3 h-3 bg-indigo-500"
        style={{ left: '70%' }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded text-white relative">
            <Brain className="w-4 h-4" />
            {activeGenerations.length > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse">
                <Sparkles className="w-2 h-2 text-yellow-800 m-0.5" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">AI Laboratory</h3>
            {renderConnectionStatus()}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 h-6 w-6"
          >
            {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleConfigure}
            className="p-1 h-6 w-6"
          >
            <Settings className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-3 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertTitle className="text-xs text-red-700">Erro</AlertTitle>
          <AlertDescription className="text-xs text-red-600">
            {error.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value: AIGenerationType) => setActiveTab(value)} className="mb-3">
        <TabsList className="grid w-full grid-cols-5 h-8">
          <TabsTrigger value="image" className="text-xs px-1">
            <Image className="w-3 h-3 mr-1" />
            Imagem
          </TabsTrigger>
          <TabsTrigger value="video" className="text-xs px-1">
            <Video className="w-3 h-3 mr-1" />
            Vídeo
          </TabsTrigger>
          <TabsTrigger value="text" className="text-xs px-1">
            <FileText className="w-3 h-3 mr-1" />
            Texto
          </TabsTrigger>
          <TabsTrigger value="code" className="text-xs px-1">
            <Code className="w-3 h-3 mr-1" />
            Código
          </TabsTrigger>
          <TabsTrigger value="analysis" className="text-xs px-1">
            <BarChart3 className="w-3 h-3 mr-1" />
            Análise
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {isExpanded ? (
            <div className="space-y-4">
              {renderGenerationForm()}
              {renderGenerationsList()}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Compact Form */}
              <div className="space-y-2">
                <Textarea
                  value={currentPrompt}
                  onChange={(e) => setCurrentPrompt(e.target.value)}
                  placeholder="Descreva o que deseja gerar..."
                  className="h-12 text-xs resize-none"
                />
                <Button
                  onClick={handleGenerate}
                  disabled={!currentPrompt.trim() || connection.status !== 'connected' || activeGenerations.length > 0}
                  className="w-full h-7 text-xs"
                >
                  <Wand2 className="w-3 h-3 mr-1" />
                  {activeGenerations.length > 0 ? 'Gerando...' : `Gerar ${activeTab}`}
                </Button>
              </div>
              
              {/* Compact Generations */}
              {renderGenerationsList()}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* System Status */}
      {systemStatus && (
        <div className="mt-3 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              <span>{systemStatus.active_tasks} tarefas ativas</span>
            </div>
            <div className="flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              <span>{systemStatus.system_resources.cpu_usage}</span>
            </div>
          </div>
        </div>
      )}

      {/* Processing Indicator */}
      {activeGenerations.length > 0 && (
        <div className="absolute top-2 right-2">
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-500 animate-pulse" />
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      )}
    </BaseBlock>
  );
};

export default AILaboratoryBlock;
