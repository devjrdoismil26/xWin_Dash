import React, { useState } from 'react';
import { Head } from '@inertiajs/react';

interface UniverseInterfaceSimpleProps {
  auth?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

interface Block {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  position: { x: number;
  y: number;
};

}

const UniverseInterfaceSimple: React.FC<UniverseInterfaceSimpleProps> = ({ auth    }) => {
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: '1',
      type: 'dashboard',
      title: 'Dashboard Block',
      description: 'Painel principal com métricas',
      icon: '📊',
      color: 'blue',
      position: { x: 100, y: 100 } ,
    {
      id: '2',
      type: 'ai-lab',
      title: 'AI Laboratory',
      description: 'Laboratório de IA',
      icon: '🤖',
      color: 'purple',
      position: { x: 300, y: 100 } ,
    {
      id: '3',
      type: 'analytics',
      title: 'Analytics Block',
      description: 'Análise de dados',
      icon: '📈',
      color: 'green',
      position: { x: 100, y: 250 } ,
    {
      id: '4',
      type: 'email-marketing',
      title: 'Email Marketing',
      description: 'Campanhas de email',
      icon: '📧',
      color: 'red',
      position: { x: 300, y: 250 } ]);

  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

  const [draggedBlock, setDraggedBlock] = useState<Block | null>(null);

  const addNewBlock = (type: string) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      title: `Novo ${type}`,
      description: `Bloco ${type} adicionado`,
      icon: type === 'dashboard' ? '📊' : type === 'ai-lab' ? '🤖' : type === 'analytics' ? '📈' : '📧',
      color: type === 'dashboard' ? 'blue' : type === 'ai-lab' ? 'purple' : type === 'analytics' ? 'green' : 'red',
      position: { x: Math.random() * 300 + 50, y: Math.random() * 200 + 50 } ;

    setBlocks(prev => [...prev, newBlock]);};

  const getBlockStyle = (block: Block) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      red: 'bg-red-50 border-red-200 text-red-800'};

    return colors[block.color as keyof typeof colors] || 'bg-gray-50 border-gray-200 text-gray-800';};

  const handleBlockDrag = (block: Block, e: React.MouseEvent) => {
    setDraggedBlock(block);

    const startX = e.clientX - block.position.x;
    const startY = e.clientY - block.position.y;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - startX;
      const newY = e.clientY - startY;
      setBlocks(prev => (prev || []).map(b => 
        b.id === block.id ? { ...b, position: { x: newX, y: newY } : b
      ));};

    const handleMouseUp = () => {
      setDraggedBlock(null);

      document.removeEventListener('mousemove', handleMouseMove);

      document.removeEventListener('mouseup', handleMouseUp);};

    document.addEventListener('mousemove', handleMouseMove);

    document.addEventListener('mouseup', handleMouseUp);};

  return (
            <div className=" ">$2</div><Head title="Universe Drag & Drop Demo - xWin Dash" / />
      <div className=" ">$2</div><div className=" ">$2</div><h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" />
            🎨 Universe Drag & Drop Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400" />
            Sistema de drag and drop com blocos interativos do Universe
          </p>
        </div>

        {/* Controles */}
        <div className=" ">$2</div><div className=" ">$2</div><h3 className="text-lg font-semibold text-gray-900 dark:text-white" />
              Adicionar Blocos:
            </h3>
            <button
              onClick={ () => addNewBlock('dashboard') }
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              📊 Dashboard
            </button>
            <button
              onClick={ () => addNewBlock('ai-lab') }
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              🤖 AI Lab
            </button>
            <button
              onClick={ () => addNewBlock('analytics') }
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              📈 Analytics
            </button>
            <button
              onClick={ () => addNewBlock('email-marketing') }
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              📧 Email Marketing
            </button>
          </div>

        {/* Canvas */}
        <div className=" ">$2</div><div className=" ">$2</div><div className="{(blocks || []).map((block: unknown) => (">$2</div>
                <div
                  key={ block.id }
                  className={`
                    absolute p-4 rounded-lg border-2 cursor-move transition-all duration-200
                    ${getBlockStyle(block)} ${selectedBlock?.id === block.id ? 'ring-2 ring-blue-500' : ''}
                    ${draggedBlock?.id === block.id ? 'shadow-lg scale-105' : 'hover:shadow-md'}
                  `}
                  style={left: block.position.x,
                    top: block.position.y,
                    width: '200px'
                  } onClick={ () => setSelectedBlock(block) }
                  onMouseDown={ (e: unknown) => handleBlockDrag(block, e)  }>
                  <div className=" ">$2</div><span className="text-2xl">{block.icon}</span>
                    <div>
           
        </div><h3 className="font-semibold text-sm">{block.title}</h3>
                      <p className="text-xs opacity-75">{block.description}</p></div></div>
              ))}
            </div>
            
            {blocks.length === 0 && (
              <div className=" ">$2</div><div className=" ">$2</div><div className="text-4xl mb-2">🎨</div>
                  <p>Clique nos botões acima para adicionar blocos</p>
      </div>
    </>
  )}
          </div>

        {/* Estatísticas */}
        <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className="text-2xl mr-3">📊</div>
              <div>
           
        </div><div className="text-sm text-gray-500 dark:text-gray-400">Total de Blocos</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{blocks.length}</div></div><div className=" ">$2</div><div className=" ">$2</div><div className="text-2xl mr-3">🎯</div>
              <div>
           
        </div><div className="text-sm text-gray-500 dark:text-gray-400">Bloco Selecionado</div>
                <div className="{selectedBlock ? selectedBlock.title : 'Nenhum'}">$2</div>
                </div></div><div className=" ">$2</div><div className=" ">$2</div><div className="text-2xl mr-3">🏷️</div>
              <div>
           
        </div><div className="text-sm text-gray-500 dark:text-gray-400">Tipos Únicos</div>
                <div className="{new Set((blocks || []).map(b => b.type)).size}">$2</div>
                </div></div><div className=" ">$2</div><div className=" ">$2</div><div className="text-2xl mr-3">🎨</div>
              <div>
           
        </div><div className="text-sm text-gray-500 dark:text-gray-400">Canvas Ativo</div>
                <div className="text-2xl font-bold text-green-600">✅</div></div></div>

        {/* Detalhes do Bloco Selecionado */}
        {selectedBlock && (
          <div className=" ">$2</div><h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4" />
              🔍 Detalhes do Bloco: {selectedBlock.title}
            </h3>
            <div className=" ">$2</div><div>
           
        </div><h4 className="font-medium text-gray-900 dark:text-white mb-2">Informações Básicas</h4>
                <div className=" ">$2</div><div><span className="font-medium">ID:</span> {selectedBlock.id}</div>
                  <div><span className="font-medium">Tipo:</span> {selectedBlock.type}</div>
                  <div><span className="font-medium">Posição:</span> ({selectedBlock.position.x}, {selectedBlock.position.y})</div>
                  <div><span className="font-medium">Cor:</span> {selectedBlock.color}</div></div><div>
           
        </div><h4 className="font-medium text-gray-900 dark:text-white mb-2">Descrição</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedBlock.description}</p></div></div>
        )}
      </div>);};

export default UniverseInterfaceSimple;