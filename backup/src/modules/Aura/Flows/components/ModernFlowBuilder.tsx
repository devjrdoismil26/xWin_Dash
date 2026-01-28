import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card } from "@/components/ui/Card";
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal, { ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { toast } from 'sonner';
import { useAuraFlows } from '../hooks/useAuraFlows';
import { cn } from '@/lib/utils';
import { 
  Plus, 
  Save, 
  Play, 
  Pause, 
  Settings, 
  Trash2, 
  Copy, 
  Download,
  Upload,
  Zap,
  MessageCircle,
  HelpCircle,
  GitBranch,
  Clock,
  CheckCircle,
  AlertCircle,
  Bot,
  User,
  Send,
  Database,
  Globe,
  Smartphone
} from 'lucide-react';
// Modern Node Components
const MessageNode = ({ data, isConnectable, selected }) => (
  <div className={cn(
    'workflow-node',
    'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100',
    selected && 'selected'
  )}>
    <Handle
      type="target"
      position={Position.Left}
      isConnectable={isConnectable}
      className="workflow-node-handle target"
    />
    <Handle
      type="source"
      position={Position.Right}
      isConnectable={isConnectable}
      className="workflow-node-handle source"
    />
    <div className="workflow-node-header">
      <div className="workflow-node-icon bg-blue-500">
        <MessageCircle className="w-4 h-4" />
      </div>
      <div className="workflow-node-title">
        {data?.name || 'Mensagem'}
      </div>
    </div>
    <div className="workflow-node-content">
      <p className="text-xs text-gray-600 mb-2">
        {data?.message || 'Digite sua mensagem...'}
      </p>
      {data?.messageType && (
        <Badge variant="secondary" size="sm">
          {data.messageType}
        </Badge>
      )}
    </div>
  </div>
);
const QuestionNode = ({ data, isConnectable, selected }) => (
  <div className={cn(
    'workflow-node',
    'border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100',
    selected && 'selected'
  )}>
    <Handle
      type="target"
      position={Position.Left}
      isConnectable={isConnectable}
      className="workflow-node-handle target"
    />
    <Handle
      type="source"
      position={Position.Right}
      isConnectable={isConnectable}
      className="workflow-node-handle source"
    />
    <div className="workflow-node-header">
      <div className="workflow-node-icon bg-purple-500">
        <HelpCircle className="h-4 w-4" />
      </div>
      <div className="workflow-node-title">
        {data?.name || 'Pergunta'}
      </div>
    </div>
    <div className="workflow-node-content">
      <p className="text-xs text-gray-600 mb-2">
        {data?.question || 'Digite sua pergunta...'}
      </p>
      {data?.options && data.options.length > 0 && (
        <div className="text-xs text-gray-500">
          {data.options.length} opções
        </div>
      )}
    </div>
  </div>
);
const ConditionNode = ({ data, isConnectable, selected }) => (
  <div className={cn(
    'workflow-node',
    'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100',
    selected && 'selected'
  )}>
    <Handle
      type="target"
      position={Position.Left}
      isConnectable={isConnectable}
      className="workflow-node-handle target"
    />
    <Handle
      type="source"
      position={Position.Right}
      isConnectable={isConnectable}
      className="workflow-node-handle source"
    />
    <div className="workflow-node-header">
      <div className="workflow-node-icon bg-yellow-500">
        <GitBranch className="h-4 w-4" />
      </div>
      <div className="workflow-node-title">
        {data?.name || 'Condição'}
      </div>
    </div>
    <div className="workflow-node-content">
      <p className="text-xs text-gray-600 mb-2">
        {data?.condition || 'Defina a condição...'}
      </p>
      {data?.variable && (
        <Badge variant="secondary" size="sm">
          {data.variable}
        </Badge>
      )}
    </div>
  </div>
);
const DelayNode = ({ data, isConnectable, selected }) => (
  <div className={cn(
    'workflow-node',
    'border-indigo-300 bg-gradient-to-br from-indigo-50 to-indigo-100',
    selected && 'selected'
  )}>
    <Handle
      type="target"
      position={Position.Left}
      isConnectable={isConnectable}
      className="workflow-node-handle target"
    />
    <Handle
      type="source"
      position={Position.Right}
      isConnectable={isConnectable}
      className="workflow-node-handle source"
    />
    <div className="workflow-node-header">
      <div className="workflow-node-icon bg-indigo-500">
        <Clock className="h-4 w-4" />
      </div>
      <div className="workflow-node-title">
        {data?.name || 'Delay'}
      </div>
    </div>
    <div className="workflow-node-content">
      <p className="text-xs text-gray-600 mb-2">
        Aguardar {data?.delay || 5} segundos
      </p>
    </div>
  </div>
);
const WebhookNode = ({ data, isConnectable, selected }) => (
  <div className={cn(
    'workflow-node',
    'border-green-300 bg-gradient-to-br from-green-50 to-green-100',
    selected && 'selected'
  )}>
    <Handle
      type="target"
      position={Position.Left}
      isConnectable={isConnectable}
      className="workflow-node-handle target"
    />
    <Handle
      type="source"
      position={Position.Right}
      isConnectable={isConnectable}
      className="workflow-node-handle source"
    />
    <div className="workflow-node-header">
      <div className="workflow-node-icon bg-green-500">
        <Globe className="h-4 w-4" />
      </div>
      <div className="workflow-node-title">
        {data?.name || 'Webhook'}
      </div>
    </div>
    <div className="workflow-node-content">
      <p className="text-xs text-gray-600 mb-2">
        {data?.webhookName || 'Nome do webhook...'}
      </p>
      {data?.url && (
        <div className="text-xs text-gray-500 truncate">
          {data.url}
        </div>
      )}
    </div>
  </div>
);
// Node Types
const nodeTypes = {
  message: MessageNode,
  question: QuestionNode,
  condition: ConditionNode,
  delay: DelayNode,
  webhook: WebhookNode,
};
// Node Edit Modal
const NodeEditModal = ({ node, onSave, onClose }) => {
  const [formData, setFormData] = useState(node.data || {});
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  const getNodeIcon = (type) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="h-5 w-5 text-blue-600" />;
      case 'question':
        return <HelpCircle className="h-5 w-5 text-purple-600" />;
      case 'condition':
        return <GitBranch className="h-5 w-5 text-yellow-600" />;
      case 'delay':
        return <Clock className="h-5 w-5 text-indigo-600" />;
      case 'webhook':
        return <Globe className="h-5 w-5 text-green-600" />;
      default:
        return <Zap className="h-5 w-5 text-gray-600" />;
    }
  };
  const getNodeTitle = (type) => {
    switch (type) {
      case 'message':
        return 'Mensagem';
      case 'question':
        return 'Pergunta';
      case 'condition':
        return 'Condição';
      case 'delay':
        return 'Delay';
      case 'webhook':
        return 'Webhook';
      default:
        return 'Componente';
    }
  };
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title=""
      size="lg"
    >
      <ModalHeader>
        <div className="flex items-center gap-3">
          {getNodeIcon(node.type)}
          <div>
            <h3 className="text-lg font-semibold">
              Editar {getNodeTitle(node.type)}
            </h3>
            <p className="text-sm text-gray-500">
              Configure as propriedades do nó
            </p>
          </div>
        </div>
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          {node.type === 'message' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem
                </label>
                <textarea
                  value={formData.message || ''}
                  onChange={(e) => handleChange('message', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Digite sua mensagem..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Mensagem
                </label>
                <select
                  value={formData.messageType || 'text'}
                  onChange={(e) => handleChange('messageType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="text">Texto</option>
                  <option value="image">Imagem</option>
                  <option value="document">Documento</option>
                  <option value="audio">Áudio</option>
                </select>
              </div>
            </div>
          )}
          {node.type === 'question' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pergunta
                </label>
                <textarea
                  value={formData.question || ''}
                  onChange={(e) => handleChange('question', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="Digite sua pergunta..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opções (uma por linha)
                </label>
                <textarea
                  value={formData.options ? formData.options.join('\n') : ''}
                  onChange={(e) => handleChange('options', e.target.value.split('\n').filter(o => o.trim()))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={4}
                  placeholder="Opção 1\nOpção 2\nOpção 3"
                />
              </div>
            </div>
          )}
          {node.type === 'condition' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condição
                </label>
                <Input
                  type="text"
                  value={formData.condition || ''}
                  onChange={(e) => handleChange('condition', e.target.value)}
                  placeholder="Ex: {{user.name}} === 'João'"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Variável
                </label>
                <Input
                  type="text"
                  value={formData.variable || ''}
                  onChange={(e) => handleChange('variable', e.target.value)}
                  placeholder="Ex: user.name"
                />
              </div>
            </div>
          )}
          {node.type === 'delay' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tempo de espera (segundos)
              </label>
              <Input
                type="number"
                min="1"
                max="3600"
                value={formData.delay || 5}
                onChange={(e) => handleChange('delay', parseInt(e.target.value))}
              />
            </div>
          )}
          {node.type === 'webhook' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Webhook
                </label>
                <Input
                  type="text"
                  value={formData.webhookName || ''}
                  onChange={(e) => handleChange('webhookName', e.target.value)}
                  placeholder="Ex: Criar Lead"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL
                </label>
                <Input
                  type="url"
                  value={formData.url || ''}
                  onChange={(e) => handleChange('url', e.target.value)}
                  placeholder="https://api.exemplo.com/webhook"
                  required
                />
              </div>
            </div>
          )}
          {/* Configurações Gerais */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Configurações Gerais</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Nó
                </label>
                <Input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Nome identificador do nó"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  rows={2}
                  placeholder="Descrição opcional do nó"
                />
              </div>
            </div>
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};
// Main FlowBuilder Component
const ModernFlowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [flowName, setFlowName] = useState('Novo Fluxo');
  const [isRunning, setIsRunning] = useState(false);
  const { saveFlow, loadFlow, executeFlow } = useAuraFlows();
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  // Add new node
  const addNode = useCallback((type, position) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: {
        name: `Novo ${type}`,
        ...getDefaultData(type)
      }
    };
    setNodes(nds => [...nds, newNode]);
    toast.success(`Nó ${type} adicionado`);
  }, [setNodes]);
  const getDefaultData = (type) => {
    switch (type) {
      case 'message':
        return { message: '', messageType: 'text' };
      case 'question':
        return { question: '', options: [] };
      case 'condition':
        return { condition: '', variable: '' };
      case 'delay':
        return { delay: 5 };
      case 'webhook':
        return { webhookName: '', url: '' };
      default:
        return {};
    }
  };
  // Handle node edit
  const handleNodeEdit = useCallback((nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setSelectedNode(node);
      setIsEditing(true);
    }
  }, [nodes]);
  // Save node changes
  const handleSaveNode = useCallback((formData) => {
    setNodes(nds => nds.map(node => 
      node.id === selectedNode.id 
        ? { ...node, data: { ...node.data, ...formData } }
        : node
    ));
    setIsEditing(false);
    setSelectedNode(null);
    toast.success('Nó atualizado com sucesso');
  }, [selectedNode, setNodes]);
  // Handle edge creation
  const onConnect = useCallback((params) => {
    setEdges(eds => addEdge(params, eds));
  }, [setEdges]);
  // Save flow
  const handleSaveFlow = useCallback(async () => {
    try {
      await saveFlow({
        name: flowName,
        nodes,
        edges
      });
      toast.success('Fluxo salvo com sucesso');
    } catch (error) {
      toast.error('Erro ao salvar fluxo');
    }
  }, [flowName, nodes, edges, saveFlow]);
  // Execute flow
  const handleExecuteFlow = useCallback(async () => {
    setIsRunning(true);
    try {
      await executeFlow({ nodes, edges });
      toast.success('Fluxo executado com sucesso');
    } catch (error) {
      toast.error('Erro ao executar fluxo');
    } finally {
      setIsRunning(false);
    }
  }, [nodes, edges, executeFlow]);
  // Drag and drop
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  const onDrop = useCallback((event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;
    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    addNode(type, position);
  }, [reactFlowInstance, addNode]);
  return (
    <div className="h-screen flex flex-col">
      {/* Toolbar */}
      <div className="border-b bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Input
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              className="w-64"
              placeholder="Nome do fluxo"
            />
            <Badge variant="secondary">
              {nodes.length} nós
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleSaveFlow}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
            <Button
              onClick={handleExecuteFlow}
              disabled={isRunning || nodes.length === 0}
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Executando...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Executar
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 flex">
        {/* Node Palette */}
        <div className="w-64 border-r bg-gray-50 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Componentes</h3>
          <div className="space-y-2">
            {[
              { type: 'message', label: 'Mensagem', icon: MessageCircle, color: 'blue' },
              { type: 'question', label: 'Pergunta', icon: HelpCircle, color: 'purple' },
              { type: 'condition', label: 'Condição', icon: GitBranch, color: 'yellow' },
              { type: 'delay', label: 'Delay', icon: Clock, color: 'indigo' },
              { type: 'webhook', label: 'Webhook', icon: Globe, color: 'green' },
            ].map((node) => (
              <div
                key={node.type}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border-2 border-dashed cursor-move',
                  'hover:border-solid hover:shadow-sm transition-all',
                  `border-${node.color}-300 hover:border-${node.color}-400`
                )}
                draggable
                onDragStart={(event) => event.dataTransfer.setData('application/reactflow', node.type)}
              >
                <div className={cn(
                  'p-2 rounded-lg',
                  `bg-${node.color}-100 text-${node.color}-600`
                )}>
                  <node.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {node.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Flow Canvas */}
        <div className="flex-1">
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              onNodeClick={(event, node) => handleNodeEdit(node.id)}
              className="bg-gray-50"
              fitView
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>
      {/* Node Edit Modal */}
      {isEditing && selectedNode && (
        <NodeEditModal
          node={selectedNode}
          onSave={handleSaveNode}
          onClose={() => {
            setIsEditing(false);
            setSelectedNode(null);
          }}
        />
      )}
    </div>
  );
};
export default ModernFlowBuilder;
