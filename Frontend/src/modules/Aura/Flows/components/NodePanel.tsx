/**
 * @module NodePanel
 * @description Painel lateral para selecionar e adicionar n?s ao fluxo.
 * 
 * Este componente exibe uma lista de n?s dispon?veis que podem ser adicionados
 * ao editor de fluxos. Cada n? ? apresentado como um bot?o clic?vel que dispara
 * a a??o de adicionar ao canvas.
 * 
 * @example
 * ```tsx
 * <NodePanel
 *   nodes={[
 *     { type: 'message', label: 'Mensagem' },
 *     { type: 'question', label: 'Pergunta' }
 *   ]}
 *   onAdd={ (node: unknown) =>  }
 * />
 * ```
 * 
 * @since 1.0.0
 */

import React from 'react';
import Card from '@/shared/components/ui/Card';

/**
 * Interface para um n? dispon?vel no painel
 * 
 * @interface AvailableNode
 * @property {string} type - Tipo do n?
 * @property {string} label - Label exibido no painel
 */
interface AvailableNode {
  /** Tipo do n? */
  type: string;
  /** Label exibido no painel */
  label: string; }

/**
 * Interface para as propriedades do componente NodePanel
 * 
 * @interface NodePanelProps
 * @property {AvailableNode[]} [nodes] - Array de n?s dispon?veis
 * @property {(node: AvailableNode) => void} [onAdd] - Callback chamado ao adicionar um n?
 */
interface NodePanelProps {
  /** Array de n?s dispon?veis */
nodes?: AvailableNode[];
  /** Callback chamado ao adicionar um n? */
onAdd??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente painel para selecionar e adicionar n?s
 * 
 * @param {NodePanelProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const NodePanel: React.FC<NodePanelProps> = ({ nodes = [] as unknown[], onAdd    }) => (
  <Card title="Blocos" />
    <div className="{(nodes || []).map((n: unknown) => (">$2</div>
        <button 
          key={ n.type }
          className="w-full text-left p-2 rounded border hover:bg-gray-50" 
          onClick={ () => onAdd?.(n)  }>
          {n.label}
        </button>
      ))}
    </div>
  </Card>);

export default NodePanel;
