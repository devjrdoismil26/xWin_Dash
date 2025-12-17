/**
 * @module AuraChatFilters
 * @description Componente de filtros para a lista de conversas do Aura.
 * 
 * Este componente permite filtrar conversas por status (todos, abertos, fechados) e
 * realizar buscas por texto. Fornece bot?es para aplicar e limpar os filtros.
 * 
 * @example
 * ```tsx
 * <AuraChatFilters
 *   values={ status: 'open', query: 'suporte' } *   onChange={ (key: unknown, value: unknown) =>  }
 *   onApply={ () =>  }
 *   onClear={ () =>  }
 * />
 * ```
 * 
 * @since 1.0.0
 */

import React from 'react';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import Select from '@/shared/components/ui/Select';

/**
 * Interface para os valores dos filtros
 * 
 * @interface FilterValues
 * @property {string} [status] - Status do chat ('all', 'open', 'closed')
 * @property {string} [query] - Texto de busca
 */
interface FilterValues {
  /** Status do chat a filtrar ('all' para todos, 'open' para abertos, 'closed' para fechados) */
  status?: 'all' | 'open' | 'closed';
  /** Texto de busca para filtrar conversas */
  query?: string; }

/**
 * Interface para as propriedades do componente AuraChatFilters
 * 
 * @interface AuraChatFiltersProps
 * @property {FilterValues} [values] - Valores atuais dos filtros
 * @property {(key: string, value: string) => void} [onChange] - Callback chamado quando um filtro ? alterado
 * @property {() => void} [onApply] - Callback chamado quando o bot?o "Aplicar" ? clicado
 * @property {() => void} [onClear] - Callback chamado quando o bot?o "Limpar" ? clicado
 */
interface AuraChatFiltersProps {
  /** Valores atuais dos filtros */
values?: FilterValues;
  /** Callback chamado quando um filtro ? alterado (recebe a chave e o novo valor) */
onChange?: (e: any) => void;
  /** Callback chamado quando o bot?o "Aplicar" ? clicado */
onApply???: (e: any) => void;
  /** Callback chamado quando o bot?o "Limpar" ? clicado */
onClear???: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void; }

/**
 * Componente de filtros para a lista de conversas
 * 
 * Componente memoizado para otimiza??o de performance.
 * 
 * @param {AuraChatFiltersProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const AuraChatFilters = React.memo<AuraChatFiltersProps>(function AuraChatFilters({ 
  values = {} as any, 
  onChange, 
  onApply, 
  onClear 
}) {
  return (
            <div className=" ">$2</div><div className=" ">$2</div><label className="text-xs text-gray-600">Status</label>
        <Select 
          value={ values.status || 'all' }
          onChange={ (value: unknown) => onChange?.('status', value) }
          options={[
            { value: 'all', label: 'Todos' },
            { value: 'open', label: 'Abertos' },
            { value: 'closed', label: 'Fechados' }
          ]} /></div><div className=" ">$2</div><label className="text-xs text-gray-600">Busca</label>
        <Input 
          placeholder="Buscar..." 
          value={ values.query || '' }
          onChange={ (e: unknown) => onChange?.('query', e.target.value) } /></div><div className=" ">$2</div><Button variant="outline" onClick={ onApply }>Aplicar</Button>
        <Button variant="outline" onClick={ onClear }>Limpar</Button>
      </div>);

});

export default AuraChatFilters;
