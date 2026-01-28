import React, { useState, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { FlowCanvasProps, AuraFlowNode, AuraNodeType } from '../types/auraTypes';
import { toast } from 'sonner';
interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}
const FlowCanvas: React.FC<FlowCanvasProps> = ({ 
  flow, 
  onFlowUpdate, 
  onNodeAdd, 
  onNodeUpdate, 
  onNodeDelete 
}) => {
  const [selectedNode, setSelectedNode] = useState<AuraFlowNode | null>(null);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [newNodeType, setNewNodeType] = useState<AuraNodeType>('message');
  const nodeTypeOptions = [
    { value: 'message', label: 'Mensagem' },
    { value: 'condition', label: 'Condição' },
    { value: 'delay', label: 'Delay' },
    { value: 'webhook', label: 'Webhook' },
    { value: 'assign', label: 'Atribuir' },
    { value: 'tag', label: 'Tag' },
    { value: 'transfer', label: 'Transferir' }
  ];
  const getNodeTypeIcon = (type: AuraNodeType): string => {
    const icons = {
      message: '💬',
      condition: '❓',
      delay: '⏱️',
      webhook: '🔗',
      assign: '📝',
      tag: '🏷️',
      transfer: '🔄'
    };
    return icons[type] || '📦';
  };
  const getNodeTypeColor = (type: AuraNodeType): string => {
    const colors = {
      message: 'bg-blue-100 border-blue-300 text-blue-800',
      condition: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      delay: 'bg-gray-100 border-gray-300 text-gray-800',
      webhook: 'bg-purple-100 border-purple-300 text-purple-800',
      assign: 'bg-green-100 border-green-300 text-green-800',
      tag: 'bg-pink-100 border-pink-300 text-pink-800',
      transfer: 'bg-orange-100 border-orange-300 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 border-gray-300 text-gray-800';
  };
  const handleNodeClick = (node: AuraFlowNode) => {
    setSelectedNode(node);
  };
  const handleAddNode = () => {
    if (!newNodeType) return;
    const newNode: AuraFlowNode = {
      id: `node_${Date.now()}`,
      type: newNodeType,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      config: {},
      connections: []
    };
    onNodeAdd?.(newNode);
    setIsAddingNode(false);
    toast.success('Nó adicionado com sucesso!');
  };
  const handleDeleteNode = (nodeId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este nó?')) {
      onNodeDelete?.(nodeId);
      setSelectedNode(null);
      toast.success('Nó excluído com sucesso!');
    }
  };
  const handleNodeDrag = (nodeId: string, newPosition: { x: number; y: number }) => {
    const node = flow.nodes.find(n => n.id === nodeId);
    if (node) {
      const updatedNode = { ...node, position: newPosition };
      onNodeUpdate?.(nodeId, updatedNode);
    }
  };
  const renderNode = (node: AuraFlowNode) => {
    const isSelected = selectedNode?.id === node.id;
    return (
      <div
        key={node.id}
        className={`
          absolute cursor-pointer p-3 rounded-lg border-2 min-w-[120px] text-center
          ${getNodeTypeColor(node.type)}
          ${isSelected ? 'ring-2 ring-blue-500' : ''}
          hover:shadow-md transition-all
        `}
        style={{
          left: node.position.x,
          top: node.position.y,
        }}
        onClick={() => handleNodeClick(node)}
        draggable
        onDragEnd={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const newPosition = {
            x: rect.left,
            y: rect.top
          };
          handleNodeDrag(node.id, newPosition);
        }}
      >
        <div className="text-lg mb-1">
          {getNodeTypeIcon(node.type)}
        </div>
        <div className="text-sm font-medium truncate">
          {node.id}
        </div>
        <div className="text-xs opacity-75">
          {nodeTypeOptions.find(opt => opt.value === node.type)?.label}
        </div>
      </div>
    );
  };
  const renderEdges = () => {
    // Simular conexões baseadas nos nós
    const edges: FlowEdge[] = [];
    for (let i = 0; i < flow.nodes.length - 1; i++) {
      edges.push({
        id: `edge_${i}`,
        source: flow.nodes[i].id,
        target: flow.nodes[i + 1].id
      });
    }
    return edges.map(edge => {
      const sourceNode = flow.nodes.find(n => n.id === edge.source);
      const targetNode = flow.nodes.find(n => n.id === edge.target);
      if (!sourceNode || !targetNode) return null;
      return (
        <svg
          key={edge.id}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <line
            x1={sourceNode.position.x + 60}
            y1={sourceNode.position.y + 40}
            x2={targetNode.position.x + 60}
            y2={targetNode.position.y + 40}
            stroke="#6b7280"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          />
        </svg>
      );
    });
  };
  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <Card.Title>Canvas de Fluxo: {flow.name}</Card.Title>
          <div className="flex items-center gap-2">
            <Badge variant={flow.is_active ? 'success' : 'secondary'}>
              {flow.is_active ? 'Ativo' : 'Inativo'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingNode(true)}
            >
              + Adicionar Nó
            </Button>
          </div>
        </div>
      </Card.Header>
      <Card.Content className="p-0">
        <div className="relative h-96 bg-gray-50 overflow-hidden">
          {/* SVG para setas */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#6b7280"
                />
              </marker>
            </defs>
          </svg>
          {/* Nós do fluxo */}
          {flow.nodes.map(renderNode)}
          {/* Conexões */}
          {renderEdges()}
          {/* Área vazia */}
          {flow.nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">🔄</div>
                <p>Nenhum nó no fluxo</p>
                <p className="text-sm">Clique em &quot;Adicionar Nó&quot; para começar</p>
              </div>
            </div>
          )}
        </div>
      </Card.Content>
      {/* Painel de Adicionar Nó */}
      {isAddingNode && (
        <Card.Content className="border-t">
          <div className="space-y-4">
            <h3 className="font-medium">Adicionar Novo Nó</h3>
            <div className="flex items-center gap-4">
              <select
                value={newNodeType}
                onChange={(e) => setNewNodeType(e.target.value as AuraNodeType)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                {nodeTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {getNodeTypeIcon(option.value as AuraNodeType)} {option.label}
                  </option>
                ))}
              </select>
              <Button onClick={handleAddNode}>
                Adicionar
              </Button>
              <Button variant="outline" onClick={() => setIsAddingNode(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </Card.Content>
      )}
      {/* Painel de Detalhes do Nó */}
      {selectedNode && (
        <Card.Content className="border-t">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">
                Nó Selecionado: {getNodeTypeIcon(selectedNode.type)} {selectedNode.id}
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNodeUpdate?.(selectedNode.id, selectedNode)}
                >
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteNode(selectedNode.id)}
                >
                  Excluir
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedNode(null)}
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Tipo:</span> {nodeTypeOptions.find(opt => opt.value === selectedNode.type)?.label}
              </div>
              <div>
                <span className="font-medium">Posição:</span> ({selectedNode.position.x}, {selectedNode.position.y})
              </div>
              <div>
                <span className="font-medium">Conexões:</span> {selectedNode.connections.length}
              </div>
              <div>
                <span className="font-medium">Configurações:</span> {Object.keys(selectedNode.config).length}
              </div>
            </div>
          </div>
        </Card.Content>
      )}
      {/* Estatísticas */}
      <Card.Content className="border-t">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {flow.nodes.length}
            </div>
            <div className="text-sm text-gray-500">Nós</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {flow.nodes.filter(n => n.type === 'message').length}
            </div>
            <div className="text-sm text-gray-500">Mensagens</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {flow.nodes.filter(n => n.type === 'condition').length}
            </div>
            <div className="text-sm text-gray-500">Condições</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {flow.nodes.filter(n => n.type === 'webhook').length}
            </div>
            <div className="text-sm text-gray-500">Webhooks</div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};
export default FlowCanvas;
