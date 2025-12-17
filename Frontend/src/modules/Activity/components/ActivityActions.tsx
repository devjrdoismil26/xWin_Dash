/**
 * Ações do módulo Activity
 *
 * @description
 * Componente para exibir ações em lote e operações em massa no módulo Activity.
 * Permite selecionar todas, limpar seleção, exportar e excluir atividades selecionadas.
 * Exibe contador de itens selecionados e validações antes de executar ações destrutivas.
 *
 * @module modules/Activity/components/ActivityActions
 * @since 1.0.0
 */

import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { Download, Trash2, CheckSquare, Square, AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Props do componente ActivityActions
 *
 * @interface ActivityActionsProps
 * @property {number} selectedCount - Número de itens selecionados
 * @property {() => void} onSelectAll - Callback para selecionar todos
 * @property {() => void} onClearSelection - Callback para limpar seleção
 * @property {() => void} [onExport] - Callback para exportar selecionados
 * @property {() => void} [onDelete] - Callback para excluir selecionados
 * @property {() => void} [onRefresh] - Callback para atualizar lista
 * @property {string} [className] - Classes CSS adicionais
 */
interface ActivityActionsProps {
  selectedCount: number;
  onSelectAll??: (e: any) => void;
  onClearSelection??: (e: any) => void;
  onExport???: (e: any) => void;
  onDelete???: (e: any) => void;
  onRefresh???: (e: any) => void;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente ActivityActions
 *
 * @description
 * Renderiza barra de ações com botões para selecionar todos, limpar seleção,
 * exportar e excluir. Exibe contador e valida ações destrutivas.
 *
 * @param {ActivityActionsProps} props - Props do componente
 * @returns {JSX.Element} Barra de ações
 */
export const ActivityActions: React.FC<ActivityActionsProps> = ({ selectedCount,
  onSelectAll,
  onClearSelection,
  onExport,
  onDelete,
  onRefresh,
  className
   }) => {
  const handleExport = () => {
    if (onExport) {
      onExport();

    } ;

  const handleDelete = () => {
    if (onDelete && confirm(`Tem certeza que deseja excluir ${selectedCount} atividades?`)) {
      onDelete();

    } ;

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();

    } ;

  return (
        <>
      <Card className={`backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 ${className} `} />
      <Card.Content className="p-4" />
        <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Badge variant="secondary" className="backdrop-blur-sm" />
                {selectedCount} selecionado{selectedCount !== 1 ? 's' : ''}
              </Badge></div><div className=" ">$2</div><Button
                variant="outline"
                size="sm"
                onClick={ onSelectAll }
                className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20" />
                <CheckSquare className="h-4 w-4 mr-2" />
                Selecionar Todos
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={ onClearSelection }
                className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20" />
                <Square className="h-4 w-4 mr-2" />
                Limpar Seleção
              </Button></div><div className=" ">$2</div><Button
              variant="outline"
              size="sm"
              onClick={ handleRefresh }
              className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20" />
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={ handleExport }
              className="backdrop-blur-sm bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30 text-blue-600" />
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={ handleDelete }
              className="backdrop-blur-sm bg-red-500/20 border-red-500/30 hover:bg-red-500/30 text-red-600" />
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button></div></Card.Content>
    </Card>);};

export default ActivityActions;
