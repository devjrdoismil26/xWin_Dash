/**
 * @module FlowCanvas
 * @description Componente de canvas visual para editar fluxos do Aura.
 * 
 * Este componente exibe um canvas interativo onde é possível visualizar, adicionar,
 * editar e deletar nós de um fluxo. Suporta drag-and-drop de nós, renderização de
 * conexões entre nós e exibe estatísticas do fluxo. Interface simplificada para
 * visualização e edição básica de fluxos.
 * 
 * @example
 * ```tsx
 * <FlowCanvas
 *   flow={ flowData }
 *   onFlowUpdate={ (flow: unknown) =>  }
 *   onNodeAdd={ (node: unknown) =>  }
 *   onNodeUpdate={ (id: unknown, node: unknown) =>  }
 *   onNodeDelete={ (id: unknown) =>  }
 * />
 * ```
 * 
 * @since 1.0.0
 */

import React, { useState, useCallback } from 'react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import { FlowCanvasProps, AuraFlowNode, AuraNodeType } from '../types/auraTypes';
import { toast } from 'sonner';

/**
 * Interface para uma aresta/conexão entre nós
 * 
 * @interface FlowEdge
 * @property {string} id - ID único da aresta
 * @property {string} source - ID do nó de origem
 * @property {string} target - ID do nó de destino
 * @property {string} [type] - Tipo da aresta
 */
interface FlowEdge {
  /** ID único da aresta */
  id: string;
  /** ID do nó de origem */
  source: string;
  /** ID do nó de destino */
  target: string;
  /** Tipo da aresta */
  type?: string; }

/**
 * Componente de canvas visual para editar fluxos
 * 
 * @param {FlowCanvasProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const FlowCanvas: React.FC<FlowCanvasProps> = ({ flow, 
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
  /**
   * Retorna o ícone emoji para o tipo de nó
   * 
   * @param {AuraNodeType} type - Tipo do nó
   * @returns {string} Emoji do ícone
   */
  const getNodeTypeIcon = (type: AuraNodeType): string => {
    const icons = {
      message: '💬',
      condition: '❓',
      delay: '⏱️',
      webhook: '🔗',
      assign: '📝',
      tag: '🏷️',
      transfer: '🔄'};

    return icons[type] || '📦';};

  /**
   * Retorna as classes CSS para cores do tipo de nó
   * 
   * @param {AuraNodeType} type - Tipo do nó
   * @returns {string} Classes CSS para background, border e text
   */
  const getNodeTypeColor = (type: AuraNodeType): string => {
    const colors = {
      message: 'bg-blue-100 border-blue-300 text-blue-800',
      condition: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      delay: 'bg-gray-100 border-gray-300 text-gray-800',
      webhook: 'bg-purple-100 border-purple-300 text-purple-800',
      assign: 'bg-green-100 border-green-300 text-green-800',
      tag: 'bg-pink-100 border-pink-300 text-pink-800',
      transfer: 'bg-orange-100 border-orange-300 text-orange-800'};

    return colors[type] || 'bg-gray-100 border-gray-300 text-gray-800';};

  /**
   * Manipula o clique em um nó (seleciona o nó)
   * 
   * @param {AuraFlowNode} node - Nó clicado
   */
  const handleNodeClick = (node: AuraFlowNode) => {
    setSelectedNode(node);};

  /**
   * Adiciona um novo nó ao fluxo
   */
  const handleAddNode = () => {
    if (!newNodeType) return;
    const newNode: AuraFlowNode = {
      id: `node_${Date.now()}`,
      type: newNodeType,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      config: {},
      connections: []};

    onNodeAdd?.(newNode);

    setIsAddingNode(false);

    toast.success('Nó adicionado com sucesso!');};

  /**
   * Deleta um nó do fluxo após confirmação
   * 
   * @param {string} nodeId - ID do nó a ser deletado
   */
  const handleDeleteNode = (nodeId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este nó?')) {
      onNodeDelete?.(nodeId);

      setSelectedNode(null);

      toast.success('Nó excluído com sucesso!');

    } ;

  const handleNodeDrag = (nodeId: string, newPosition: { x: number; y: number }) => {
    const node = flow.nodes.find(n => n.id === nodeId);

    if (node) {
      const updatedNode = { ...node, position: newPosition};

      onNodeUpdate?.(nodeId, updatedNode);

    } ;

  /**
   * Renderiza um nó no canvas
   * 
   * @param {AuraFlowNode} node - Nó a ser renderizado
   * @returns {JSX.Element} Elemento do nó renderizado
   */
  const renderNode = (node: AuraFlowNode) => {
    const isSelected = selectedNode?.id === node.id;
    return (
              <div
        key={ node.id }
        className={`
          absolute cursor-pointer p-3 rounded-lg border-2 min-w-[120px] text-center
          ${getNodeTypeColor(node.type)} ${isSelected ? 'ring-2 ring-blue-500' : ''}
          hover:shadow-md transition-all
        `}
        style={left: node.position.x,
          top: node.position.y,
        } onClick={ () => handleNodeClick(node) }
        draggable
        onDragEnd={(e: unknown) => {
          const rect = e.currentTarget.getBoundingClientRect();

          const newPosition = {
            x: rect.left,
            y: rect.top};

          handleNodeDrag(node.id, newPosition);

        } >
        <div className="{getNodeTypeIcon(node.type)}">$2</div>
        </div>
        <div className="{node.id}">$2</div>
        </div>
        <div className="{nodeTypeOptions.find(opt => opt.value === node.type)?.label}">$2</div>
        </div>);};

  /**
   * Renderiza as conexões/arestas entre nós
   * 
   * @returns {Array<JSX.Element | null>} Array de elementos SVG de conexão
   */
  const renderEdges = () => {
    // Simular conexões baseadas nos nós
    const edges: FlowEdge[] = [] as unknown[];
    for (let i = 0; i < flow.nodes.length - 1; i++) {
      edges.push({
        id: `edge_${i}`,
        source: flow.nodes[i].id,
        target: flow.nodes[i + 1].id
      });

    }
    return (edges || []).map(edge => {
      const sourceNode = flow.nodes.find(n => n.id === edge.source);

      const targetNode = flow.nodes.find(n => n.id === edge.target);

      if (!sourceNode || !targetNode) return null;
      return (
        <>
      <svg
          key={ edge.id }
          className="absolute inset-0 pointer-events-none"
          style={zIndex: 1 } />
      <line
            x1={ sourceNode.position.x + 60 }
            y1={ sourceNode.position.y + 40 }
            x2={ targetNode.position.x + 60 }
            y2={ targetNode.position.y + 40 }
            stroke="#6b7280"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          / />
        </svg>);

    });};

  return (
        <>
      <Card />
      <Card.Header />
        <div className=" ">$2</div><Card.Title>Canvas de Fluxo: {flow.name}</Card.Title>
          <div className=" ">$2</div><Badge variant={ flow.is_active ? 'success' : 'secondary' } />
              {flow.is_active ? 'Ativo' : 'Inativo'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={ () => setIsAddingNode(true)  }>
              + Adicionar Nó
            </Button></div></Card.Header>
      <Card.Content className="p-0" />
        <div className="{/* SVG para setas */}">$2</div>
          <svg className="absolute inset-0 w-full h-full" style={zIndex: 1 } />
            <defs />
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto" />
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#6b7280"
                / /></marker></defs>
          </svg>
          {/* Nós do fluxo */}
          {(flow.nodes || []).map(renderNode)}
          {/* Conexões */}
          {renderEdges()}
          {/* Área vazia */}
          {flow.nodes.length === 0 && (
            <div className=" ">$2</div><div className=" ">$2</div><div className="text-4xl mb-2">🔄</div>
                <p>Nenhum nó no fluxo</p>
                <p className="text-sm">Clique em &quot;Adicionar Nó&quot; para começar</p>
      </div>
    </>
  )}
        </div>
      </Card.Content>
      {/* Painel de Adicionar Nó */}
      {isAddingNode && (
        <Card.Content className="border-t" />
          <div className=" ">$2</div><h3 className="font-medium">Adicionar Novo Nó</h3>
            <div className=" ">$2</div><select
                value={ newNodeType }
                onChange={ (e: unknown) => setNewNodeType(e.target.value as AuraNodeType) }
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                {(nodeTypeOptions || []).map(option => (
                  <option key={option.value} value={ option.value } />
                    {getNodeTypeIcon(option.value as AuraNodeType)} {option.label}
                  </option>
                ))}
              </select>
              <Button onClick={ handleAddNode } />
                Adicionar
              </Button>
              <Button variant="outline" onClick={ () => setIsAddingNode(false)  }>
                Cancelar
              </Button></div></Card.Content>
      )}
      {/* Painel de Detalhes do Nó */}
      {selectedNode && (
        <Card.Content className="border-t" />
          <div className=" ">$2</div><div className=" ">$2</div><h3 className="font-medium" />
                Nó Selecionado: {getNodeTypeIcon(selectedNode.type)} {selectedNode.id}
              </h3>
              <div className=" ">$2</div><Button
                  variant="outline"
                  size="sm"
                  onClick={ () => onNodeUpdate?.(selectedNode.id, selectedNode)  }>
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={ () => handleDeleteNode(selectedNode.id)  }>
                  Excluir
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={ () => setSelectedNode(null)  }>
                  ✕
                </Button></div><div className=" ">$2</div><div>
           
        </div><span className="font-medium">Tipo:</span> {nodeTypeOptions.find(opt => opt.value === selectedNode.type)?.label}
              </div>
              <div>
           
        </div><span className="font-medium">Posição:</span> ({selectedNode.position.x}, {selectedNode.position.y})
              </div>
              <div>
           
        </div><span className="font-medium">Conexões:</span> {selectedNode.connections.length}
              </div>
              <div>
           
        </div><span className="font-medium">Configurações:</span> {Object.keys(selectedNode.config).length}
              </div></div></Card.Content>
      )}
      {/* Estatísticas */}
      <Card.Content className="border-t" />
        <div className=" ">$2</div><div>
           
        </div><div className="{flow.nodes.length}">$2</div>
            </div>
            <div className="text-sm text-gray-500">Nós</div>
          <div>
           
        </div><div className="{(flow.nodes || []).filter(n => n.type === 'message').length}">$2</div>
            </div>
            <div className="text-sm text-gray-500">Mensagens</div>
          <div>
           
        </div><div className="{(flow.nodes || []).filter(n => n.type === 'condition').length}">$2</div>
            </div>
            <div className="text-sm text-gray-500">Condições</div>
          <div>
           
        </div><div className="{(flow.nodes || []).filter(n => n.type === 'webhook').length}">$2</div>
            </div>
            <div className="text-sm text-gray-500">Webhooks</div></div></Card.Content>
    </Card>);};

export default FlowCanvas;
