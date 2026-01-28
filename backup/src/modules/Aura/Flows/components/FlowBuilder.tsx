import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
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
  AlertCircle
} from 'lucide-react';
// Node Edit Modal Component
const NodeEditModal = ({ node, onSave, onClose }) => {
  const [formData, setFormData] = useState(node.data || {});
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-90vw max-h-90vh overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Editar {node.type === 'message' ? 'Mensagem' : node.type === 'question' ? 'Pergunta' : 'Componente'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {node.type === 'message' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensagem
              </label>
              <textarea
                value={formData.message || ''}
                onChange={(e) => handleChange('message', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Digite sua mensagem..."
                required
              />
            </div>
          )}
          {node.type === 'question' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pergunta
                </label>
                <textarea
                  value={formData.question || ''}
                  onChange={(e) => handleChange('question', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="Digite sua pergunta..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opções (uma por linha)
                </label>
                <textarea
                  value={formData.options ? formData.options.join('\n') : ''}
                  onChange={(e) => handleChange('options', e.target.value.split('\n').filter(o => o.trim()))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={4}
                  placeholder="Opção 1\nOpção 2\nOpção 3"
                />
              </div>
            </>
          )}
          {node.type === 'condition' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condição
              </label>
              <input
                type="text"
                value={formData.condition || ''}
                onChange={(e) => handleChange('condition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Ex: idade > 18"
                required
              />
            </div>
          )}
          {node.type === 'humanHandoff' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departamento
              </label>
              <input
                type="text"
                value={formData.department || ''}
                onChange={(e) => handleChange('department', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Ex: Vendas, Suporte"
              />
            </div>
          )}
          {node.type === 'delay' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tempo de espera (segundos)
              </label>
              <input
                type="number"
                min="1"
                max="3600"
                value={formData.delay || 5}
                onChange={(e) => handleChange('delay', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
          {node.type === 'webhook' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Webhook
                </label>
                <input
                  type="text"
                  value={formData.webhookName || ''}
                  onChange={(e) => handleChange('webhookName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ex: Criar Lead"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={formData.url || ''}
                  onChange={(e) => handleChange('url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://api.exemplo.com/webhook"
                  required
                />
              </div>
            </>
          )}
          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              Salvar Alterações
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
// Custom Node Types with Enhanced UI
const MessageNode = ({ data, isConnectable, selected }) => (
  <div className={`group relative min-w-[200px] max-w-[280px] ${selected ? 'ring-2 ring-blue-500' : ''}`}>
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            💬
          </div>
          <span className="font-semibold text-sm">Mensagem</span>
        </div>
        <button 
          className="opacity-0 group-hover:opacity-100 hover:bg-white hover:bg-opacity-20 rounded p-1 transition-all duration-200"
          title="Editar nó"
          onClick={() => window.editNode?.(data.id)}
        >
          ✏️
        </button>
      </div>
      {/* Content */}
      <div className="p-4">
        <div className="text-gray-800 text-sm leading-relaxed">
          {data.message || 'Digite sua mensagem...'}
        </div>
        {data.message && (
          <div className="mt-2 text-xs text-gray-500">
            {data.message.length} caracteres
          </div>
        )}
      </div>
      {/* Connection Points */}
      <div className="absolute -right-2 top-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md transform -translate-y-1/2"></div>
      <div className="absolute -left-2 top-1/2 w-4 h-4 bg-gray-400 rounded-full border-2 border-white shadow-md transform -translate-y-1/2"></div>
      {/* Delete button */}
      <button 
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-200 flex items-center justify-center text-xs"
        title="Deletar nó"
        onClick={() => window.deleteNode?.(data.id)}
      >
        ×
      </button>
    </div>
  </div>
);
const QuestionNode = ({ data, isConnectable, selected }) => (
  <div className={`group relative min-w-[200px] max-w-[280px] ${selected ? 'ring-2 ring-purple-500' : ''}`}>
    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-300 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
      {/* Header */}
      <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
        <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          ❓
        </div>
        <span className="font-semibold text-sm">Pergunta</span>
      </div>
      {/* Content */}
      <div className="p-4">
        <div className="text-purple-800 text-sm font-medium leading-relaxed">
          {data.question || 'Digite sua pergunta...'}
        </div>
        {data.options && (
          <div className="mt-3 space-y-1">
            {data.options.map((option, idx) => (
              <div key={idx} className="text-xs bg-white px-2 py-1 rounded border border-purple-200">
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Connection Points */}
      <div className="absolute -right-2 top-1/2 w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-md transform -translate-y-1/2"></div>
      <div className="absolute -left-2 top-1/2 w-4 h-4 bg-gray-400 rounded-full border-2 border-white shadow-md transform -translate-y-1/2"></div>
    </div>
  </div>
);
const ConditionNode = ({ data, isConnectable, selected }) => (
  <div className={`group relative min-w-[180px] max-w-[250px] ${selected ? 'ring-2 ring-yellow-500' : ''}`}>
    <div className="bg-gradient-to-br from-yellow-50 to-amber-100 border border-yellow-300 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
      {/* Header */}
      <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-t-lg">
        <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          ⚡
        </div>
        <span className="font-semibold text-sm">Condição</span>
      </div>
      {/* Content */}
      <div className="p-4">
        <div className="text-yellow-800 text-sm font-medium">
          {data.condition || 'Configure a condição...'}
        </div>
        <div className="mt-2 flex space-x-2">
          <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded border">
            ✓ Sim
          </div>
          <div className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded border">
            ✕ Não
          </div>
        </div>
      </div>
      {/* Connection Points */}
      <div className="absolute -right-2 top-1/3 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
      <div className="absolute -right-2 top-2/3 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-md"></div>
      <div className="absolute -left-2 top-1/2 w-4 h-4 bg-gray-400 rounded-full border-2 border-white shadow-md transform -translate-y-1/2"></div>
    </div>
  </div>
);
const HumanHandoffNode = ({ data, isConnectable, selected }) => (
  <div className={`group relative min-w-[200px] max-w-[280px] ${selected ? 'ring-2 ring-red-500' : ''}`}>
    <div className="bg-gradient-to-br from-red-50 to-rose-100 border border-red-300 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
      {/* Header */}
      <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-t-lg">
        <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          👤
        </div>
        <span className="font-semibold text-sm">Transferir Humano</span>
      </div>
      {/* Content */}
      <div className="p-4">
        <div className="text-red-800 text-sm font-medium">
          Transferir para atendimento humano
        </div>
        <div className="mt-2 text-xs text-red-600">
          🕐 Tempo estimado: 2-5 min
        </div>
        {data.department && (
          <div className="mt-2 px-2 py-1 bg-white text-red-700 text-xs rounded border border-red-200">
            📍 {data.department}
          </div>
        )}
      </div>
      {/* Connection Points */}
      <div className="absolute -left-2 top-1/2 w-4 h-4 bg-gray-400 rounded-full border-2 border-white shadow-md transform -translate-y-1/2"></div>
      {/* No right connection point - this is typically an end node */}
    </div>
  </div>
);
// New node types for enhanced workflow
const DelayNode = ({ data, isConnectable, selected }) => (
  <div className={`group relative min-w-[180px] max-w-[250px] ${selected ? 'ring-2 ring-indigo-500' : ''}`}>
    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-300 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
      <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-t-lg">
        <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          ⏱️
        </div>
        <span className="font-semibold text-sm">Aguardar</span>
      </div>
      <div className="p-4">
        <div className="text-indigo-800 text-sm font-medium">
          Aguardar {data.delay || '5'} segundos
        </div>
      </div>
      <div className="absolute -right-2 top-1/2 w-4 h-4 bg-indigo-500 rounded-full border-2 border-white shadow-md transform -translate-y-1/2"></div>
      <div className="absolute -left-2 top-1/2 w-4 h-4 bg-gray-400 rounded-full border-2 border-white shadow-md transform -translate-y-1/2"></div>
    </div>
  </div>
);
const WebhookNode = ({ data, isConnectable, selected }) => (
  <div className={`group relative min-w-[200px] max-w-[280px] ${selected ? 'ring-2 ring-green-500' : ''}`}>
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-300 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
      <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
        <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          🔗
        </div>
        <span className="font-semibold text-sm">Webhook</span>
      </div>
      <div className="p-4">
        <div className="text-green-800 text-sm font-medium">
          {data.webhookName || 'Chamar API externa'}
        </div>
        <div className="mt-1 text-xs text-green-600 truncate">
          {data.url || 'Configure a URL'}
        </div>
      </div>
      <div className="absolute -right-2 top-1/2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-md transform -translate-y-1/2"></div>
      <div className="absolute -left-2 top-1/2 w-4 h-4 bg-gray-400 rounded-full border-2 border-white shadow-md transform -translate-y-1/2"></div>
    </div>
  </div>
);
const nodeTypes = {
  message: MessageNode,
  question: QuestionNode,
  condition: ConditionNode,
  humanHandoff: HumanHandoffNode,
  delay: DelayNode,
  webhook: WebhookNode,
};
const initialNodes = [
  {
    id: '1',
    type: 'message',
    position: { x: 250, y: 25 },
    data: { message: 'Olá! Como posso ajudar você hoje?' },
  },
];
const initialEdges = [];
const FlowBuilder = () => {
  const { flows, createFlow, flowLoading, error: auraError } = useAuraFlows();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNodeType, setSelectedNodeType] = useState('message');
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [editingNode, setEditingNode] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const onConnect = useCallback(
    (params) => {
      if (validateConnections(params)) {
        setEdges((eds) => addEdge(params, eds));
        notify.success('Conexão Criada', 'Os nós foram conectados com sucesso.');
      }
    },
    [setEdges, validateConnections],
  );
  const onInit = (reactFlowInstance) => setReactFlowInstance(reactFlowInstance);
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type || !reactFlowInstance) {
        return;
      }
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: `${type}_${Date.now()}`,
        type,
        position,
        data: { 
          message: type === 'message' ? 'Nova mensagem' : undefined,
          question: type === 'question' ? 'Nova pergunta' : undefined,
          condition: type === 'condition' ? 'Nova condição' : undefined,
        },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  const handleSaveFlow = async () => {
    if (nodes.length === 0) {
      toast.error('Adicione pelo menos um componente ao fluxo antes de salvar');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const flowData = {
        name: `Fluxo ${new Date().toLocaleString('pt-BR')}`,
        description: 'Fluxo criado no editor visual drag-and-drop',
        structure: {
          nodes: nodes.map(node => ({
            id: node.id,
            type: node.type,
            position: node.position,
            data: node.data
          })),
          edges: edges.map(edge => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.type || 'default'
          }))
        },
        is_active: false
      };
      const newFlow = await createFlow(flowData);
      toast.success('Fluxo criado com sucesso! ID: ' + newFlow.id);
      // Limpar editor após salvar
      setNodes([]);
      setEdges([]);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao salvar o fluxo. Tente novamente.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const handleClearFlow = () => {
    if (nodes.length > 0 && window.confirm('Tem certeza que deseja limpar todo o fluxo?')) {
      setNodes([]);
      setEdges([]);
      toast.info('Fluxo limpo - Todos os componentes foram removidos do editor');
    }
  };
  const handleEditNode = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setEditingNode(node);
      setShowEditModal(true);
    }
  };
  const handleDeleteNode = (nodeId) => {
    if (confirm('Tem certeza que deseja deletar este nó?')) {
      setNodes(prevNodes => prevNodes.filter(n => n.id !== nodeId));
      setEdges(prevEdges => prevEdges.filter(e => e.source !== nodeId && e.target !== nodeId));
      toast.info('Componente removido do fluxo');
    }
  };
  const saveNodeEdit = (updatedData) => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === editingNode.id 
          ? { ...node, data: { ...node.data, ...updatedData } }
          : node
      )
    );
    setShowEditModal(false);
    setEditingNode(null);
    toast.success('Nó atualizado com sucesso!');
  };
  // Expose functions globally for node access
  React.useEffect(() => {
    window.editNode = handleEditNode;
    window.deleteNode = handleDeleteNode;
    return () => {
      window.editNode = null;
      window.deleteNode = null;
    };
  }, [nodes]);
  const validateConnections = useCallback((connection) => {
    // Prevent self-connections
    if (connection.source === connection.target) {
      toast.warning('Um nó não pode se conectar a si mesmo');
      return false;
    }
    // Check for duplicate connections
    const duplicateExists = edges.some(edge => 
      edge.source === connection.source && 
      edge.target === connection.target
    );
    if (duplicateExists) {
      toast.warning('Esta conexão já existe');
      return false;
    }
    return true;
  }, [edges]);
  return (
    <div className="h-screen flex">
      {/* Sidebar with node palette */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-4">Componentes</h3>
        <div className="space-y-3 mb-6">
          {/* Basic Flow Components */}
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Componentes Básicos
          </div>
          <div
            className="group p-3 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg cursor-move hover:shadow-lg hover:scale-105 transition-all duration-200"
            onDragStart={(event) => onDragStart(event, 'message')}
            draggable
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">💬</span>
              <div>
                <div className="font-semibold text-blue-800">Mensagem</div>
                <div className="text-xs text-blue-600">Enviar mensagem de texto</div>
              </div>
            </div>
          </div>
          <div
            className="group p-3 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg cursor-move hover:shadow-lg hover:scale-105 transition-all duration-200"
            onDragStart={(event) => onDragStart(event, 'question')}
            draggable
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">❓</span>
              <div>
                <div className="font-semibold text-purple-800">Pergunta</div>
                <div className="text-xs text-purple-600">Fazer pergunta com opções</div>
              </div>
            </div>
          </div>
          <div
            className="group p-3 bg-gradient-to-br from-yellow-50 to-amber-100 border border-yellow-200 rounded-lg cursor-move hover:shadow-lg hover:scale-105 transition-all duration-200"
            onDragStart={(event) => onDragStart(event, 'condition')}
            draggable
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">⚡</span>
              <div>
                <div className="font-semibold text-yellow-800">Condição</div>
                <div className="text-xs text-yellow-600">Lógica condicional</div>
              </div>
            </div>
          </div>
          {/* Advanced Components */}
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-6">
            Componentes Avançados
          </div>
          <div
            className="group p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg cursor-move hover:shadow-lg hover:scale-105 transition-all duration-200"
            onDragStart={(event) => onDragStart(event, 'delay')}
            draggable
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">⏱️</span>
              <div>
                <div className="font-semibold text-indigo-800">Aguardar</div>
                <div className="text-xs text-indigo-600">Pausa no fluxo</div>
              </div>
            </div>
          </div>
          <div
            className="group p-3 bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-lg cursor-move hover:shadow-lg hover:scale-105 transition-all duration-200"
            onDragStart={(event) => onDragStart(event, 'webhook')}
            draggable
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">🔗</span>
              <div>
                <div className="font-semibold text-green-800">Webhook</div>
                <div className="text-xs text-green-600">Chamar API externa</div>
              </div>
            </div>
          </div>
          {/* Action Components */}
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-6">
            Ações Finais
          </div>
          <div
            className="group p-3 bg-gradient-to-br from-red-50 to-rose-100 border border-red-200 rounded-lg cursor-move hover:shadow-lg hover:scale-105 transition-all duration-200"
            onDragStart={(event) => onDragStart(event, 'humanHandoff')}
            draggable
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">👤</span>
              <div>
                <div className="font-semibold text-red-800">Transferir</div>
                <div className="text-xs text-red-600">Para atendimento humano</div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Button 
            onClick={handleSaveFlow} 
            className="w-full"
            disabled={isLoading || flowLoading}
            loading={isLoading || flowLoading}
          >
            {isLoading || flowLoading ? 'Salvando...' : 'Salvar Fluxo'}
          </Button>
          <Button 
            onClick={handleClearFlow} 
            variant="outline" 
            className="w-full"
            disabled={isLoading || flowLoading}
          >
            Limpar Tudo
          </Button>
        </div>
        {/* Status info */}
        <div className="mt-4 text-xs text-gray-600 space-y-1">
          <div>💡 Arraste componentes para o canvas</div>
          <div>🔗 Clique para conectar nós</div>
          <div>✏️ Clique no nó para editar</div>
          <div>💾 {flows.length} fluxos salvos</div>
        </div>
        {(error || auraError) && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
            {error || auraError}
          </div>
        )}
      </div>
      {/* Node Edit Modal */}
      {showEditModal && editingNode && (
        <NodeEditModal 
          node={editingNode}
          onSave={saveNodeEdit}
          onClose={() => {
            setShowEditModal(false);
            setEditingNode(null);
          }}
        />
      )}
      {/* Main flow editor area */}
      <div className="flex-1" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={onInit}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
};
// Wrap with ReactFlowProvider for proper context
const FlowBuilderWrapper = () => (
  <ReactFlowProvider>
    <FlowBuilder />
  </ReactFlowProvider>
);
export default FlowBuilderWrapper;
